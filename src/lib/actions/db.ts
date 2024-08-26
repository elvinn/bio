import { sql } from "@vercel/postgres";

interface BioTable {
  id: string; // 自动生成的 uuid
  userId: string; // 用户 ID
  merit: string; // 用户特点
  bio: string; // 生成的个人简介
  ip: string; // 用户 IP
  createdAt: number; // 创建时间戳（秒）
}

export async function saveBio(bioData: Omit<BioTable, 'id' | 'createdAt'>) {
  await sql`
    INSERT INTO bio (userId, merit, bio, ip, createdAt)
    VALUES (${bioData.userId}, ${bioData.merit}, ${bioData.bio}, ${bioData.ip}, ${Math.floor(Date.now() / 1000)})
  `;
}

export async function queryRecentBioCountByIp(filter: Pick<BioTable, 'ip' | 'createdAt'>) {
  const { rows } = await sql`
    SELECT COUNT(*) FROM bio
    WHERE ip = ${filter.ip} AND createdAt >= ${filter.createdAt}
  `;

  return Number(rows[0].count)
}
