import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { NextResponse } from 'next/server'

import { Time } from '@/lib/consts'
import { getIp, generateUserId } from '@/app/api/server-utils'
import { saveBio, queryRecentBioCountByIp } from './db'
import { getPrompt, getMockResult } from './utils'

export const maxDuration = 30

const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
})

const BiosSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, { message: '输入自己的特点再试试吧' })
    .max(100, { message: '太长啦，不要超过 100 字' }),
})

export async function POST(req: Request) {
  const validatedFields = BiosSchema.safeParse(await req.json())
  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors
    return NextResponse.json(
      {
        error: `参数错误 ${JSON.stringify(fieldErrors)}`,
      },
      {
        status: 400,
      }
    )
  }

  if (process.env.USE_MOCK_DATA === 'true') {
    const mockResult = await getMockResult()
    return mockResult.toDataStreamResponse()
  }

  // 限制请求频率，一个 IP 12 个小时内不得生成超过 process.env.IP_LIMIT 次
  const ip = getIp()
  const ipCount = await queryRecentBioCountByIp({
    ip,
    createdAt: Math.floor(Date.now() / 1000) - Time.HOUR * 12,
  })
  if (ipCount > Number(process.env.IP_LIMIT)) {
    return NextResponse.json(
      {
        message: '你的网络 IP 请求次数已超过限制，稍后再试',
      },
      {
        status: 400,
      }
    )
  }

  // 注意：不能放到 onFinish 回调中，因为可能需要 set cookie
  const userId = generateUserId()

  const { prompt: merit } = validatedFields.data
  const bioResult = await streamText({
    model: openai(process.env.MODEL_NAME as string),
    prompt: getPrompt(merit),
    onFinish: (message) => {
      void saveBio({
        userId,
        merit,
        bio: message.text,
        ip,
      })
    },
  })

  return bioResult.toDataStreamResponse()
}
