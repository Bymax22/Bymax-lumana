import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaService;
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
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
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
