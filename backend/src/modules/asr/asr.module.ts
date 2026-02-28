import { Module } from '@nestjs/common';
import { ASRGateway } from './asr.gateway';

@Module({
  providers: [ASRGateway],
  exports: [ASRGateway],
})
export class ASRModule {}
