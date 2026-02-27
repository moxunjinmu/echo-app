import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('健康检查应该返回 ok 状态', () => {
      const result = appController.getHealth();
      expect(result.status).toBe('ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
    });

    it('获取服务信息应该返回正确信息', () => {
      const result = appController.getInfo();
      expect(result.name).toBe('Echo API');
      expect(result.version).toBe('0.1.0');
      expect(result.documentation).toBe('/api/docs');
    });
  });
});
