import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaService;
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
    const connectionUrl = databaseUrl
      ? `${databaseUrl}${databaseUrl.includes("?") ? "&" : "?"}connection_limit=1`
      : databaseUrl;

    super({
      datasources: connectionUrl ? { db: { url: connectionUrl } } : undefined,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = this;
    }
  }

  static getInstance(): PrismaService {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaService();
    }

    return globalForPrisma.prisma;
  }

  async onModuleInit() {
    const timeoutMs = Number(process.env.PRISMA_CONNECT_TIMEOUT_MS ?? 5000);
    try {
      await Promise.race([
        this.$connect(),
        new Promise((_res, rej) => setTimeout(() => rej(new Error(`Prisma connect timeout after ${timeoutMs}ms`)), timeoutMs)),
      ]);
    } catch (err) {
      // Log and rethrow so the platform (Vercel) receives a clear startup error quickly
      // This prevents serverless functions from hanging until the platform-level timeout.
      // The error will be visible in logs.
      // eslint-disable-next-line no-console
      console.error('Prisma connection failed or timed out:', err);
      throw err;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
