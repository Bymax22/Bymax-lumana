import { Module } from '@nestjs/common';
import { HireService } from './hire.service';
import { HireController } from './hire.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [PrismaModule, AdminModule],
  controllers: [HireController],
  providers: [HireService],
  exports: [HireService],
})
export class HireModule {}
