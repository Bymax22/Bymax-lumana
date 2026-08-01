import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CloudinaryService } from './services/cloudinary.service';
import { AdminVehicleController } from './controllers/admin-vehicle.controller';
import { AdminAuctionController } from './controllers/admin-auction.controller';
import { AdminBrandController } from './controllers/admin-brand.controller';
import { AdminCategoryController } from './controllers/admin-category.controller';
import { AdminBlogController } from './controllers/admin-blog.controller';
import { AdminUserController } from './controllers/admin-user.controller';
import { AdminSupportController } from './controllers/admin-support.controller';
import { AdminPageController } from './controllers/admin-page.controller';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminVehicleService } from './services/admin-vehicle.service';
import { AdminAuctionService } from './services/admin-auction.service';
import { AdminBrandService } from './services/admin-brand.service';
import { AdminCategoryService } from './services/admin-category.service';
import { AdminBlogService } from './services/admin-blog.service';
import { AdminUserService } from './services/admin-user.service';
import { AdminSupportService } from './services/admin-support.service';
import { AdminPageService } from './services/admin-page.service';
import { AdminDashboardService } from './services/admin-dashboard.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    AdminVehicleController,
    AdminAuctionController,
    AdminBrandController,
    AdminCategoryController,
    AdminBlogController,
    AdminUserController,
    AdminSupportController,
    AdminPageController,
    AdminDashboardController,
  ],
  providers: [
    CloudinaryService,
    AdminVehicleService,
    AdminAuctionService,
    AdminBrandService,
    AdminCategoryService,
    AdminBlogService,
    AdminUserService,
    AdminSupportService,
    AdminPageService,
    AdminDashboardService,
  ],
  exports: [CloudinaryService],
})
export class AdminModule {}
