import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('用户')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('study_summary')
  @ApiOperation({ summary: '获取学习总结' })
  async getStudySummary() {
    return this.userService.getStudySummary();
  }

  @Get('courses/in_progress')
  @ApiOperation({ summary: '获取在学课程列表' })
  async getInProgressCourses() {
    return this.userService.getInProgressCourses();
  }
}
