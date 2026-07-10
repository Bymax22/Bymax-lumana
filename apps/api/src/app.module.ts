import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { VehicleModule } from "./modules/vehicle/vehicle.module";
import { AuctionModule } from "./modules/auction/auction.module";
import { DealerModule } from "./modules/dealer/dealer.module";
import { FinanceModule } from "./modules/finance/finance.module";
import { LogisticsModule } from "./modules/logistics/logistics.module";
import { CustomsModule } from "./modules/customs/customs.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { ReportingModule } from "./modules/reporting/reporting.module";
import { AdminModule } from "./modules/admin/admin.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    VehicleModule,
    AuctionModule,
    DealerModule,
    FinanceModule,
    LogisticsModule,
    CustomsModule,
    PaymentModule,
    NotificationModule,
    ReportingModule,
    AdminModule
  ]
})
export class AppModule {}

