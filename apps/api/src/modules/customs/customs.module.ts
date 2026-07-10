import { Module } from '@nestjs/common';
import { CustomsService } from './customs.service';
import { CustomsController } from './customs.controller';

@Module({
  controllers: [CustomsController],
  providers: [CustomsService],
})
export class CustomsModule {}
