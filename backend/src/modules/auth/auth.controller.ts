import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('weapp/login')
  @ApiOperation({ summary: '小程序微信登录' })
  async weappLogin(@Body('code') code: string) {
    return this.authService.weappLogin(code);
  }

  @Post('app/wechat_login')
  @ApiOperation({ summary: 'App 微信登录' })
  async appWechatLogin(@Body('code') code: string) {
    return this.authService.appWechatLogin(code);
  }

  @Post('phone/send_code')
  @ApiOperation({ summary: '发送手机验证码' })
  async sendCode(@Body('phone') phone: string) {
    return this.authService.sendPhoneCode(phone);
  }

  @Post('phone/login')
  @ApiOperation({ summary: '手机号登录' })
  async phoneLogin(@Body('phone') phone: string, @Body('code') code: string) {
    return this.authService.phoneLogin(phone, code);
  }

  @Post('refresh')
  @ApiOperation({ summary: '刷新 Token' })
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户信息' })
  async getProfile(@Request() req: any) {
    return req.user;
  }
}
