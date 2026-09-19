import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async check() {
    try {
      const brandCount = await Promise.race([
        this.prisma.brand.count(),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Health query timed out after 15 seconds')), 15_000);
        }),
      ]);

      return {
        status: 'ok',
        database: 'connected',
        brandCount,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          status: 'error',
          database: 'unavailable',
          error: message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
