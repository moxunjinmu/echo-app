import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('支付')
@Controller('payment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @ApiOperation({ summary: '创建支付订单' })
  async createOrder(
    @Body()
    body: {
      user_id: string;
      product_type: 'monthly' | 'quarterly' | 'yearly';
      payment_method: 'wechat' | 'alipay' | 'apple_iap';
    },
  ) {
    return this.paymentService.createOrder(body);
  }

  @Post('weapp/notify')
  @ApiOperation({ summary: '微信小程序支付回调' })
  async weappNotify(@Body() body: any) {
    return this.paymentService.handleWeappNotify(body);
  }

  @Post('wechat/notify')
  @ApiOperation({ summary: '微信 App 支付回调' })
  async wechatNotify(@Body() body: any) {
    return this.paymentService.handleWechatNotify(body);
  }

  @Post('alipay/notify')
  @ApiOperation({ summary: '支付宝支付回调' })
  async alipayNotify(@Body() body: any) {
    return this.paymentService.handleAlipayNotify(body);
  }

  @Post('apple/notify')
  @ApiOperation({ summary: 'Apple IAP 支付回调' })
  async appleNotify(@Body() body: any) {
    return this.paymentService.handleAppleNotify(body);
  }

  @Get('orders/:user_id')
  @ApiOperation({ summary: '获取用户订单列表' })
  async getOrders(@Param('user_id') userId: string) {
    return this.paymentService.getUserOrders(userId);
  }

  @Post('restore/:order_id')
  @ApiOperation({ summary: '恢复购买 (iOS)' })
  async restorePurchase(@Param('order_id') orderId: string) {
    return this.paymentService.restorePurchase(orderId);
  }
}
