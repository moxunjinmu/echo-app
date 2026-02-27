import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  getInfo() {
    return {
      name: 'Echo API',
      version: '0.1.0',
      description: '盲听复说英语训练 App 后端服务',
      author: 'moma (AI Agent)',
      documentation: '/api/docs',
    };
  }
}
