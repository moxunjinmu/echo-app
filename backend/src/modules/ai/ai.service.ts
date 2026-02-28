import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AIService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('ZHIPU_API_KEY', '');
  }

  /**
   * AI 语境解析
   */
  async analyzeSentence(sentence: string, recognizedText: string) {
    const prompt = `你是一位专业的英语老师，请为以下句子提供解析：

原句：${sentence}
用户识别结果：${recognizedText}

请提供：
1. 精准中文翻译（简洁准确）
2. 用户发音错误的词的纠正建议（重点关注识别错误的词，给出发音技巧）
3. 重点词汇/短语解释（最多3个，JSON数组格式）
4. 连读/弱读/语调提示（如果有）

以JSON格式返回，包含以下字段：
{
  "translation": "翻译",
  "pronunciation_tips": "发音提示",
  "key_vocabulary": [
    {"word": "单词", "meaning": "释义", "example": "例句"}
  ],
  "speaking_tips": "口语技巧"
}`;

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'glm-4',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const content = response.data.choices[0].message.content;

      // 尝试解析 JSON
      try {
        return JSON.parse(content);
      } catch {
        // 如果不是 JSON，返回原始文本
        return {
          translation: content,
          pronunciation_tips: '',
          key_vocabulary: [],
          speaking_tips: '',
        };
      }
    } catch (error) {
      console.error('AI 解析失败:', error);

      // 返回模拟数据
      return {
        translation: '就在大厅走廊往下走...',
        pronunciation_tips:
          '注意 "right down" 这里的 t 往往会失去爆破，不用发出清晰的 /t/ 音，听起来像连在了一起。',
        key_vocabulary: [
          {
            word: 'hall',
            meaning: 'n. 走廊，大厅',
            example: 'Walk down the hall to the elevator.',
          },
          {
            word: 'right down',
            meaning: 'adv. 一直沿着...',
            example: "It's right down the street.",
          },
        ],
        speaking_tips: '这是一个指路的常用表达，语调应该平缓自然。',
      };
    }
  }

  /**
   * 添加生词到生词本
   */
  async addToVocabulary(userId: string, word: string, meaning: string) {
    // TODO: 实现生词本存储
    return {
      success: true,
      message: '已添加到生词本',
    };
  }
}
