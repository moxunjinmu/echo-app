import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TrainingService } from './training.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('训练')
@Controller('training')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post('submit')
  @ApiOperation({ summary: '提交训练结果' })
  async submitTraining(
    @Body()
    body: {
      course_id: string;
      sentence_id: string;
      recognized_text: string;
      accuracy_score: number;
      client_type: string;
    },
  ) {
    return this.trainingService.submitTraining(body);
  }

  @Post('asr/recognize')
  @ApiOperation({ summary: '语音识别' })
  async recognizeSpeech(@Body() body: { audio_data: string }) {
    return this.trainingService.recognizeSpeech(body.audio_data);
  }

  @Get('weakness/:user_id')
  @ApiOperation({ summary: '获取用户弱项列表' })
  async getWeakness(@Param('user_id') userId: string) {
    return this.trainingService.getUserWeakness(userId);
  }
}
