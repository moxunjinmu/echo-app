import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('默认')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '健康检查', description: '检查服务是否正常运行' })
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('info')
  @ApiOperation({ summary: '获取服务信息', description: '获取 API 服务的基本信息' })
  getInfo() {
    return this.appService.getInfo();
  }
}
