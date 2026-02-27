import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1 (GET)', () => {
    it('健康检查应该返回 200', () => {
      return request(app.getHttpServer())
        .get('/api/v1')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
        });
    });
  });

  describe('/api/v1/info (GET)', () => {
    it('获取服务信息应该返回 200', () => {
      return request(app.getHttpServer())
        .get('/api/v1/info')
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Echo API');
        });
    });
  });

  describe('/api/v1/auth/weapp/login (POST)', () => {
    it('微信小程序登录应该返回 token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/weapp/login')
        .send({ code: 'test-code' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
        });
    });
  });

  describe('/api/v1/auth/phone/login (POST)', () => {
    it('手机号登录应该返回 token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/phone/login')
        .send({ phone: '13800138000', code: '123456' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it('错误验证码应该返回 401', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/phone/login')
        .send({ phone: '13800138000', code: 'wrong' })
        .expect(401);
    });
  });
});
