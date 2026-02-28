import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // TODO: 实现真正的管理员验证逻辑
    // 临时：检查 user_id 是否在管理员列表中
    const adminUsers = ['admin_user_id'];

    if (!user || !adminUsers.includes(user.user_id)) {
      throw new UnauthorizedException('需要管理员权限');
    }

    return true;
  }
}
