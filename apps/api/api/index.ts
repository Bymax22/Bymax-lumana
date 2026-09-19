import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import serverless = require('serverless-http');
import { AppModule } from '../src/app.module';

const globalForServer = globalThis as typeof globalThis & {
  __lumanaServer?: any;
};

let server: any;

function withTimeout<T>(operation: Promise<T>, timeoutMs: number, label: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return Promise.race([
    operation,
    new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`${label} timed out after ${timeoutMs}ms`)),
        timeoutMs,
      );
    }),
  ]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

function normalizeApiPrefix(req: any, _res: any, next: any) {
  if (req?.url?.startsWith('/api')) {
    req.url = req.url.replace(/^\/api(?=\/|$|\?)/, '') || '/';
  }

  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false, cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(normalizeApiPrefix);

  return serverless(expressApp);
}

export default async function handler(req: any, res: any) {
  if (!server) {
    try {
      server = globalForServer.__lumanaServer ?? (globalForServer.__lumanaServer = await withTimeout(
        bootstrap(),
        20_000,
        'API bootstrap',
      ));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database unavailable';
      res.statusCode = 503;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ statusCode: 503, message: 'API unavailable', detail: message }));
      return;
    }
  }

  return server(req, res);
}
