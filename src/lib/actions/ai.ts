"use server";
import { sleep } from 'radash'
import { z } from 'zod';
import OpenAI from 'openai';
import { ActionError, Bio } from '@/app/type';
import { bios, Time } from '../consts';
import { getIp } from '../server-utils';
import { queryRecentBioCountByIp, saveBio } from './db';
import { generateUserId } from '../server-utils';

const aiClient = new OpenAI();

const getPrompt = (merit: string) => {
  const promptLines = [
    `我的特点是“${merit}”，帮我生成一个小红书的个人简介。`,
    '注意：',
    '1. 需要使用多种 emoji 来增强视觉吸引力和情感表达。',
    '2. 每行不超过 30 字，整体不超过 100 字。',
  ];

  bios.slice(0, 2).forEach((bio, index) => {
    promptLines.push('');
    promptLines.push(`优秀的示例 ${index + 1} :`)
    promptLines.push(bio.content)
  });

  return promptLines.join('\n');
};

const BiosSchema = z.object({
  merit: z.string()
    .trim()
    .min(1, { message: '输入自己的特点再试试吧'})
    .max(100, { message: '太长啦，不要超过 100 字'})
});

export async function createBio(prevState: any, formData: FormData): Promise<Bio | ActionError> {
  const userId = generateUserId();

  const validatedFields = BiosSchema.safeParse({
    merit: formData.get('merit'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      errorMessage: fieldErrors.merit?.join(', ') || '请输入自己的特点再试试吧',
    };
  }

  if (process.env.USE_FAKE_DATA === 'true') {
    await sleep(1000);
    return {
      title: '专属介绍',
      content: [
        '👨‍🎓北大毕业生 | 深圳职场新秀',
        '🌟互联网探索者 | 热爱创新与学习',
        '🌆上海人 | 融合两城的独特视角',
        '📚分享成长经历 | 职场干货与生活灵感',
        '🚀一起启航，共享精彩旅程！',
      ].join('\n'),
    };
  }

  // 限制请求频率，一个 IP 12 个小时内不得生成超过 process.env.IP_LIMIT 次
  const ip = getIp();
  const ipCount = await queryRecentBioCountByIp({ ip, createdAt: Math.floor(Date.now() / 1000) - Time.HOUR * 12});
  if (ipCount > Number(process.env.IP_LIMIT)) {
    return {
      errorMessage: '你的网络 IP 请求次数已超过限制，稍后再试'
    }
  }

  const { merit } = validatedFields.data;
  const prompt = getPrompt(merit);
  const chatCompletion = await aiClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: process.env.MODEL_NAME as string,
  });

  const content = chatCompletion.choices[0].message.content;
  if (!content) {
    return {
      errorMessage: '生成失败，请稍后再试',
    }
  }

  void saveBio({
    userId,
    merit,
    bio: content,
    ip,
  });

  return {
    title: '专属介绍',
    content,
  };
}
