import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { PrismaModule } from './prisma';
import { AuthModule } from './auth';
import { ProductsModule } from './products';
import { CategoriesModule } from './categories';
import { OrdersModule } from './orders';
import { AiModule } from './ai';
import { PaymentsModule } from './payments';
import { StorageModule } from './storage';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    AiModule,
    PaymentsModule,
    StorageModule,
    AddressesModule,
  ],
})
export class AppModule { }
