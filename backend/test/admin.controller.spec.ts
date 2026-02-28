import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../src/modules/admin/admin.controller';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const mockCourseService = {
      findAll: jest.fn().mockResolvedValue([]),
      createCourse: jest.fn().mockResolvedValue({ course_id: 'test' }),
      updateCourse: jest.fn().mockResolvedValue({ course_id: 'test' }),
      deleteCourse: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: 'CourseService',
          useValue: mockCourseService,
        },
        {
          provide: 'AdminGuard',
          useValue: { canActivate: () => true },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOverview', () => {
    it('应该返回概览数据', async () => {
      const result = await controller.getOverview();
      expect(result).toHaveProperty('total_users');
      expect(result).toHaveProperty('active_users_today');
    });
  });

  describe('getUserStats', () => {
    it('应该返回用户统计', async () => {
      const result = await controller.getUserStats();
      expect(result).toHaveProperty('growth_trend');
      expect(result).toHaveProperty('retention');
    });
  });

  describe('getCourseStats', () => {
    it('应该返回课程统计', async () => {
      const result = await controller.getCourseStats();
      expect(result).toHaveProperty('hot_courses');
      expect(result).toHaveProperty('completion_rate');
    });
  });

  describe('getRevenueStats', () => {
    it('应该返回收入统计', async () => {
      const result = await controller.getRevenueStats();
      expect(result).toHaveProperty('trend');
      expect(result).toHaveProperty('conversion_rate');
    });
  });
});
