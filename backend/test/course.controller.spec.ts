import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from '../src/modules/course/course.controller';
import { CourseService } from '../src/modules/course/course.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from '../src/modules/course/course.entity';
import { Sentence } from '../src/modules/course/sentence.entity';
import { Repository } from 'typeorm';

describe('CourseController', () => {
  let controller: CourseController;
  let service: CourseService;

  const mockCourse = {
    course_id: 'test-course-id',
    title: '托福听力校园对话精选',
    description: '攻克新题型，先听后说直觉反射',
    category: 'toefl',
    difficulty: 'advanced',
    cover_url: 'https://example.com/cover.jpg',
    total_sentences: 45,
    estimated_minutes: 30,
    is_vip_only: false,
    created_at: new Date(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockSentenceRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Sentence),
          useValue: mockSentenceRepository,
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('应该返回课程列表', async () => {
      const courses = [mockCourse];
      mockRepository.find.mockResolvedValue(courses);

      const result = await controller.findAll();

      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('list');
      expect(result.list).toHaveLength(1);
    });

    it('应该支持分类筛选', async () => {
      mockRepository.find.mockResolvedValue([mockCourse]);

      const result = await controller.findAll('toefl');

      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { category: 'toefl' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('应该返回课程详情', async () => {
      mockRepository.findOne.mockResolvedValue(mockCourse);

      const result = await controller.findOne('test-course-id');

      expect(result).toEqual(mockCourse);
    });

    it('课程不存在时应该抛出异常', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(controller.findOne('non-existent')).rejects.toThrow();
    });
  });

  describe('getSentences', () => {
    it('应该返回课程的句子列表', async () => {
      const sentences = [
        {
          sentence_id: 'sentence-1',
          course_id: 'test-course-id',
          sentence_index: 1,
          audio_url: 'https://example.com/audio1.mp3',
          text_en: 'Hello world',
          text_cn: '你好世界',
        },
      ];
      mockSentenceRepository.find.mockResolvedValue(sentences);

      const result = await controller.getSentences('test-course-id');

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('sentence_id');
    });
  });
});
