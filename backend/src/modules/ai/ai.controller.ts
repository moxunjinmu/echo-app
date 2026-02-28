import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'AI 语境解析' })
  async analyze(
    @Body()
    body: {
      sentence: string;
      recognized_text: string;
    },
  ) {
    return this.aiService.analyzeSentence(
      body.sentence,
      body.recognized_text,
    );
  }

  @Post('vocabulary/add')
  @ApiOperation({ summary: '添加生词到生词本' })
  async addVocabulary(
    @Body()
    body: {
      user_id: string;
      word: string;
      meaning: string;
    },
  ) {
    return this.aiService.addToVocabulary(
      body.user_id,
      body.word,
      body.meaning,
    );
  }
}
