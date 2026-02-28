import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../user/user.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 产品定价
   */
  private readonly pricing: Record<string, { price: number; days: number; original_price: number }> = {
    monthly: { price: 28, days: 30, original_price: 38 },
    quarterly: { price: 69, days: 90, original_price: 114 },
    yearly: { price: 198, days: 365, original_price: 456 },
  };

  /**
   * 创建支付订单
   */
  async createOrder(data: {
    user_id: string;
    product_type: 'monthly' | 'quarterly' | 'yearly';
    payment_method: 'wechat' | 'alipay' | 'apple_iap';
  }) {
    const product = this.pricing[data.product_type];
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const order = this.orderRepository.create({
      order_id: orderId,
      user_id: data.user_id,
      product_type: data.product_type,
      amount: product.price,
      payment_method: data.payment_method,
      status: 'pending',
    });

    await this.orderRepository.save(order);

    // 根据支付方式返回不同的支付参数
    switch (data.payment_method) {
      case 'wechat':
        return this.createWechatPayment(order);
      case 'alipay':
        return this.createAlipayPayment(order);
      case 'apple_iap':
        return this.createApplePayment(order);
      default:
        return { order_id: orderId };
    }
  }

  /**
   * 创建微信支付
   */
  private async createWechatPayment(order: Order) {
    // TODO: 调用微信支付 API
    return {
      order_id: order.order_id,
      // 微信支付参数（需要调用微信API获取）
      appId: 'wx_app_id',
      timeStamp: Math.floor(Date.now() / 1000).toString(),
      nonceStr: Math.random().toString(36).substr(2),
      package: `prepay_id=wx_prepay_id_${order.order_id}`,
      signType: 'MD5',
      paySign: 'mock_sign',
    };
  }

  /**
   * 创建支付宝支付
   */
  private async createAlipayPayment(order: Order) {
    // TODO: 调用支付宝 API
    return {
      order_id: order.order_id,
      // 支付宝支付参数
      orderString: `alipay_order_string_${order.order_id}`,
    };
  }

  /**
   * 创建 Apple IAP 支付
   */
  private async createApplePayment(order: Order) {
    return {
      order_id: order.order_id,
      product_id: `com.echo.vip.${order.product_type}`,
    };
  }

  /**
   * 处理微信小程序支付回调
   */
  async handleWeappNotify(body: any) {
    // TODO: 验证签名
    const orderId = body.out_trade_no;
    const order = await this.orderRepository.findOne({
      where: { order_id: orderId },
    });

    if (order && order.status === 'pending') {
      await this.activateVIP(order);
      return { code: 'SUCCESS', message: '成功' };
    }

    return { code: 'FAIL', message: '订单不存在或已处理' };
  }

  /**
   * 处理微信 App 支付回调
   */
  async handleWechatNotify(body: any) {
    return this.handleWeappNotify(body);
  }

  /**
   * 处理支付宝支付回调
   */
  async handleAlipayNotify(body: any) {
    // TODO: 验证签名
    const orderId = body.out_trade_no;
    const order = await this.orderRepository.findOne({
      where: { order_id: orderId },
    });

    if (order && order.status === 'pending') {
      await this.activateVIP(order);
      return 'success';
    }

    return 'fail';
  }

  /**
   * 处理 Apple IAP 支付回调
   */
  async handleAppleNotify(body: any) {
    // TODO: 验证 Apple 收据
    const orderId = body.order_id;
    const order = await this.orderRepository.findOne({
      where: { order_id: orderId },
    });

    if (order && order.status === 'pending') {
      await this.activateVIP(order);
      return { status: 'success' };
    }

    return { status: 'fail' };
  }

  /**
   * 激活 VIP
   */
  private async activateVIP(order: Order) {
    const product = this.pricing[order.product_type];
    const vipExpireAt = new Date();
    vipExpireAt.setDate(vipExpireAt.getDate() + product.days);

    // 更新订单状态
    order.status = 'success';
    order.paid_at = new Date();
    await this.orderRepository.save(order);

    // 更新用户 VIP 状态
    await this.userRepository.update(order.user_id, {
      vip_expire_at: vipExpireAt,
    });
  }

  /**
   * 获取用户订单列表
   */
  async getUserOrders(userId: string) {
    return this.orderRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * 恢复购买 (iOS)
   */
  async restorePurchase(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { order_id: orderId },
    });

    if (order && order.status === 'success') {
      // 重新激活 VIP
      const product = this.pricing[order.product_type];
      const vipExpireAt = new Date(order.paid_at);
      vipExpireAt.setDate(vipExpireAt.getDate() + product.days);

      await this.userRepository.update(order.user_id, {
        vip_expire_at: vipExpireAt,
      });

      return { success: true, vip_expire_at: vipExpireAt };
    }

    return { success: false, message: '订单不存在或未支付' };
  }
}
