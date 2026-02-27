import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async weappLogin(code: string) {
    // TODO: 调用微信 API 获取 openid 和 unionid
    // 开发环境使用模拟数据
    const mockUnionid = `weapp_unionid_${code}`;
    const mockOpenid = `weapp_openid_${code}`;

    let user = await this.userRepository.findOne({
      where: { wechat_unionid: mockUnionid },
    });

    if (!user) {
      user = this.userRepository.create({
        wechat_unionid: mockUnionid,
        wechat_openid_weapp: mockOpenid,
        nickname: '新用户',
      });
      await this.userRepository.save(user);
    }

    return this.generateUserResponse(user);
  }

  /**
   * 生成用户响应对象
   */
  private generateUserResponse(user: User) {
    const payload = { user_id: user.user_id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        user_id: user.user_id,
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        vip_expire_at: user.vip_expire_at,
      },
    };
  }

  async appWechatLogin(code: string) {
    // TODO: 调用微信开放平台 API
    const mockUnionid = `app_unionid_${code}`;
    const mockOpenid = `app_openid_${code}`;

    let user = await this.userRepository.findOne({
      where: { wechat_unionid: mockUnionid },
    });

    if (!user) {
      user = this.userRepository.create({
        wechat_unionid: mockUnionid,
        wechat_openid_app: mockOpenid,
        nickname: '新用户',
      });
      await this.userRepository.save(user);
    }

    return this.generateUserResponse(user);
  }

  async sendPhoneCode(phone: string) {
    // TODO: 调用短信服务发送验证码
    console.log(`发送验证码到手机: ${phone}`);
    return {
      message: '验证码已发送',
      // 开发环境返回验证码
      ...(process.env.NODE_ENV === 'development' && { code: '123456' }),
    };
  }

  async phoneLogin(phone: string, code: string) {
    // TODO: 验证验证码（从Redis读取）
    const isValidCode = await this.verifyPhoneCode(phone, code);
    if (!isValidCode) {
      throw new UnauthorizedException('验证码错误或已过期');
    }

    let user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      user = this.userRepository.create({
        phone,
        nickname: '新用户',
      });
      await this.userRepository.save(user);
    }

    return this.generateUserResponse(user);
  }

  /**
   * 验证手机验证码
   */
  private async verifyPhoneCode(phone: string, code: string): Promise<boolean> {
    // TODO: 从 Redis 读取验证码进行验证
    // 开发环境固定为 123456
    return code === '123456';
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({
        where: { user_id: payload.user_id },
      });

      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      const newPayload = { user_id: user.user_id };
      const access_token = this.jwtService.sign(newPayload);

      return { access_token };
    } catch (error) {
      throw new UnauthorizedException('Token 无效或已过期');
    }
  }
}
