import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async check() {
    try {
      await this.prisma.$connect();
      const brandCount = await this.prisma.brand.count();

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
