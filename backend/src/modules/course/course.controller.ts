import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CourseService } from './course.service';

@ApiTags('课程')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @ApiOperation({ summary: '获取课程列表' })
  @ApiQuery({ name: 'category', required: false, description: '课程分类' })
  async findAll(@Query('category') category?: string) {
    const courses = await this.courseService.findAll(category);
    return {
      total: courses.length,
      list: courses,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '获取课程详情' })
  async findOne(@Param('id') id: string) {
    const course = await this.courseService.findOne(id);
    if (!course) {
      throw new NotFoundException('课程不存在');
    }
    return course;
  }

  @Get(':id/sentences')
  @ApiOperation({ summary: '获取课程句子列表' })
  async getSentences(@Param('id') id: string) {
    return this.courseService.getSentences(id);
  }
}
