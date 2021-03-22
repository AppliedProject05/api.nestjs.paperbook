import { Module } from '@nestjs/common'

import { OrderService } from './services/order.service'

import { OrderController } from './controllers/order.controller'

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
