import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../src/modules/payment/payment.controller';
import { PaymentService } from '../src/modules/payment/payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../src/modules/payment/order.entity';
import { User } from '../src/modules/user/user.entity';
import { Repository } from 'typeorm';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;

  const mockOrder = {
    order_id: 'test-order-id',
    user_id: 'test-user-id',
    product_type: 'monthly',
    amount: 28,
    payment_method: 'wechat',
    status: 'pending',
  };

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockUserRepository = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('应该成功创建订单', async () => {
      mockOrderRepository.create.mockReturnValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);

      const result = await controller.createOrder({
        user_id: 'test-user-id',
        product_type: 'monthly',
        payment_method: 'wechat',
      });

      expect(result).toHaveProperty('order_id');
    });
  });
});
