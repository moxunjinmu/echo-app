import {
  WebSocketGateway,
  SubscribeMessage,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/asr',
})
export class ASRGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ASRGateway.name);
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('ZHIPU_API_KEY', '');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('audio')
  async handleAudio(client: Socket, payload: { data: string }): Promise<WsResponse<any>> {
    try {
      // 解码 base64 音频数据
      const audioBuffer = Buffer.from(payload.data, 'base64');

      // TODO: 调用腾讯云/阿里云 ASR API
      // 当前返回模拟结果
      const result = await this.mockASR(audioBuffer);

      return {
        event: 'result',
        data: result,
      };
    } catch (error) {
      this.logger.error('ASR error:', error);
      return {
        event: 'error',
        data: { message: '识别失败' },
      };
    }
  }

  /**
   * 模拟 ASR 识别（开发环境）
   */
  private async mockASR(audioBuffer: Buffer): Promise<any> {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 返回模拟识别结果
    return {
      text: 'Hello world',
      confidence: 0.95,
      is_final: true,
      timestamp: Date.now(),
    };
  }

  /**
   * 真实 ASR 识别（腾讯云）
   * TODO: 实现真实的 ASR 调用
   */
  private async realASR(audioBuffer: Buffer): Promise<any> {
    // 腾讯云 ASR API 调用
    // const response = await axios.post('https://asr.tencentcloudapi.com/', {
    //   // 请求参数
    // });

    // return response.data;
  }
}
