import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CourseService } from '../course/course.service';
import { AdminGuard } from './admin.guard';

@ApiTags('管理后台')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly courseService: CourseService) {}

  // 课程管理
  @Get('courses')
  @ApiOperation({ summary: '获取所有课程（管理）' })
  async getAllCourses() {
    return this.courseService.findAll();
  }

  @Post('courses')
  @ApiOperation({ summary: '创建课程' })
  async createCourse(
    @Body()
    body: {
      title: string;
      description: string;
      category: string;
      difficulty: string;
      cover_url: string;
      is_vip_only: boolean;
    },
  ) {
    return this.courseService.createCourse(body);
  }

  @Put('courses/:id')
  @ApiOperation({ summary: '更新课程' })
  async updateCourse(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.courseService.updateCourse(id, body);
  }

  @Delete('courses/:id')
  @ApiOperation({ summary: '删除课程' })
  async deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }

  // 数据统计
  @Get('stats/overview')
  @ApiOperation({ summary: '获取概览数据' })
  async getOverview() {
    return {
      total_users: 1250,
      active_users_today: 89,
      total_training_minutes: 15680,
      revenue_today: 1280,
    };
  }

  @Get('stats/users')
  @ApiOperation({ summary: '获取用户统计' })
  async getUserStats() {
    return {
      growth_trend: [
        { date: '2026-02-22', count: 45 },
        { date: '2026-02-23', count: 52 },
        { date: '2026-02-24', count: 38 },
        { date: '2026-02-25', count: 61 },
        { date: '2026-02-26', count: 55 },
        { date: '2026-02-27', count: 48 },
        { date: '2026-02-28', count: 89 },
      ],
      retention: {
        day1: 68,
        day7: 42,
        day30: 25,
      },
    };
  }

  @Get('stats/courses')
  @ApiOperation({ summary: '获取课程统计' })
  async getCourseStats() {
    return {
      hot_courses: [
        { title: '托福听力校园对话', learners: 456 },
        { title: '日常实用口语50句', learners: 389 },
        { title: '外企高频会议实战', learners: 267 },
      ],
      completion_rate: 58,
    };
  }

  @Get('stats/revenue')
  @ApiOperation({ summary: '获取收入统计' })
  async getRevenueStats() {
    return {
      trend: [
        { date: '2026-02-22', amount: 890 },
        { date: '2026-02-23', amount: 1250 },
        { date: '2026-02-24', amount: 780 },
        { date: '2026-02-25', amount: 1560 },
        { date: '2026-02-26', amount: 980 },
        { date: '2026-02-27', amount: 1120 },
        { date: '2026-02-28', amount: 1280 },
      ],
      conversion_rate: 8.5,
      arpu: 28.6,
    };
  }
}
