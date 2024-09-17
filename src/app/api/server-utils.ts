import { v4 as uuidv4 } from 'uuid'
import { headers } from 'next/headers'
import { cookies } from 'next/headers'
import { Time } from '../../lib/consts'

export function getIp() {
  const forwardedFor = headers().get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const ip = headers().get('x-real-ip')
  if (ip) {
    return ip
  }

  return '0.0.0.0'
}

/**
 * 生成一个用户 ID 并保存在 Cookie 中
 * 如果 Cookie 中已经存在 userId，则使用该值
 * 如果 Cookie 中不存在 userId，则生成一个新的 UUID 作为 userId
 * 最后，设置 Cookie 的属性，使其在一个月后过期
 *
 * @returns 返回生成或获取的用户ID
 */
export function generateUserId() {
  const cookieStore = cookies()
  const userId = cookieStore.get('userId')?.value || uuidv4()
  console.log(
    `cookieStore.get('userId')?.value`,
    cookieStore.get('userId')?.value
  )
  console.log('userId ', userId)
  cookieStore.set({
    name: 'userId',
    value: userId!,
    httpOnly: true,
    maxAge: Time.MONTH,
  })

  return userId
}
