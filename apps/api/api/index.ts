import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import serverless = require('serverless-http');
import { AppModule } from '../src/app.module';

let server: any;

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
    server = await bootstrap();
  }

  return server(req, res);
}
