import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/modules/user/user.entity';
import { Repository } from 'typeorm';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUser = {
    user_id: 'test-user-id',
    wechat_unionid: 'test-unionid',
    nickname: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
    vip_expire_at: null,
  };

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-access-token'),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('weappLogin', () => {
    it('应该成功登录并返回 access_token', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await controller.weappLogin('test-code');

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.access_token).toBe('mock-access-token');
    });

    it('新用户应该自动创建账号', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await controller.weappLogin('new-user-code');

      expect(mockRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('access_token');
    });
  });

  describe('phoneLogin', () => {
    it('应该成功通过手机号登录', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await controller.phoneLogin('13800138000', '123456');

      expect(result).toHaveProperty('access_token');
    });

    it('错误的验证码应该抛出异常', async () => {
      await expect(controller.phoneLogin('13800138000', 'wrong-code')).rejects.toThrow();
    });
  });

  describe('getProfile', () => {
    it('应该返回用户信息', async () => {
      const req = { user: mockUser };
      const result = await controller.getProfile(req);
      expect(result).toEqual(mockUser);
    });
  });
});
