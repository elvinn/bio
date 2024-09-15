import { streamText } from 'ai';
import { convertArrayToReadableStream, MockLanguageModelV1 } from 'ai/test';
import { bios } from '@/lib/consts';
import { sleep } from 'radash';

export function getPrompt(merit: string) {
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

export function getMockResult() {
  return streamText({
    model: new MockLanguageModelV1({
      // @ts-ignore 延迟返回，模拟流式数据
      doStream: async () => {
        await sleep(1000);
        return {
          stream: convertArrayToReadableStream([
            { type: 'text-delta', textDelta: '👨‍🎓北大毕业生 | 深圳职场新秀\n' },
            { type: 'text-delta', textDelta: '🌟互联网探索者 | 热爱创新与学习\n' },
            { type: 'text-delta', textDelta: '🌆上海人 | 融合两城的独特视角\n' },
            { type: 'text-delta', textDelta: '📚分享成长经历 | 职场干货与生活灵感\n' },
            { type: 'text-delta', textDelta: '🚀一起启航，共享精彩旅程！' },
            {
              type: 'finish',
              finishReason: 'stop',
              logprobs: undefined,
              usage: { completionTokens: 10, promptTokens: 3 },
            },
          ]),
          rawCall: { rawPrompt: null, rawSettings: {} },
        }
      },
    }),
    prompt: 'Return mock result.',
  });
}
