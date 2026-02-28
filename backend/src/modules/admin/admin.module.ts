import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [CourseModule],
  controllers: [AdminController],
  providers: [AdminGuard],
})
export class AdminModule {}
