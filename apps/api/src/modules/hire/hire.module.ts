import { Module } from '@nestjs/common';
import { HireService } from './hire.service';
import { HireController } from './hire.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HireController],
  providers: [HireService],
  exports: [HireService],
})
export class HireModule {}
