import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaService;
};

function withRuntimeTimeouts(databaseUrl: string) {
  const separator = databaseUrl.includes('?') ? '&' : '?';
  return `${databaseUrl}${separator}connection_limit=1&connect_timeout=10&pool_timeout=10&socket_timeout=15&statement_timeout=15000`;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
    const connectionUrl = databaseUrl ? withRuntimeTimeouts(databaseUrl) : databaseUrl;

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

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
