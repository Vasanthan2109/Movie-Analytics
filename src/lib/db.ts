import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load .env and override any pre-set env vars (e.g., from shell)
config({ override: true, path: '.env' })

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db