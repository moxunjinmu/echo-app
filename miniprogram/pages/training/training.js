// miniprogram/pages/training/training.js
const app = getApp();
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();

Page({
  data: {
    sentence: null,
    currentIndex: 0,
    totalSentences: 0,
    isPlaying: false,
    isRecording: false,
    recognizedText: '',
    accuracyScore: 0,
    showResult: false,
    words: [],
  },

  onLoad(options) {
    const { courseId, sentenceId } = options;
    this.loadSentence(courseId, sentenceId);
    this.initRecorder();
  },

  /**
   * 加载句子数据
   */
  async loadSentence(courseId, sentenceId) {
    try {
      const res = await app.request({
        url: `/courses/${courseId}/sentences`,
      });

      const sentences = res.data;
      const currentIndex = sentences.findIndex(
        (s) => s.sentence_id === sentenceId,
      );

      this.setData({
        sentence: sentences[currentIndex],
        currentIndex: currentIndex + 1,
        totalSentences: sentences.length,
      });
    } catch (error) {
      console.error('加载句子失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  /**
   * 初始化录音管理器
   */
  initRecorder() {
    recorderManager.onStart(() => {
      this.setData({ isRecording: true });
    });

    recorderManager.onStop((res) => {
      this.setData({ isRecording: false });
      this.uploadAndRecognize(res.tempFilePath);
    });

    recorderManager.onError((error) => {
      console.error('录音错误:', error);
      this.setData({ isRecording: false });
      wx.showToast({ title: '录音失败', icon: 'none' });
    });
  },

  /**
   * 播放原音
   */
  playAudio() {
    if (!this.data.sentence) return;

    innerAudioContext.src = this.data.sentence.audio_url;
    innerAudioContext.play();

    this.setData({ isPlaying: true });

    innerAudioContext.onEnded(() => {
      this.setData({ isPlaying: false });
    });
  },

  /**
   * 开始/停止录音
   */
  toggleRecord() {
    if (this.data.isRecording) {
      recorderManager.stop();
    } else {
      recorderManager.start({
        format: 'mp3',
        sampleRate: 16000,
      });
    }
  },

  /**
   * 上传并识别
   */
  async uploadAndRecognize(tempFilePath) {
    wx.showLoading({ title: '识别中...' });

    try {
      // 上传音频文件
      const uploadRes = await wx.uploadFile({
        url: `${app.globalData.apiBase}/training/asr/recognize`,
        filePath: tempFilePath,
        name: 'audio',
      });

      const result = JSON.parse(uploadRes.data);

      // 计算准确度
      const accuracy = this.calculateAccuracy(
        result.text,
        this.data.sentence.text_en,
      );

      // 对比单词
      const words = this.compareWords(
        result.text,
        this.data.sentence.text_en,
      );

      this.setData({
        recognizedText: result.text,
        accuracyScore: accuracy,
        showResult: true,
        words,
      });

      // 提交训练结果
      await this.submitTrainingResult(result.text, accuracy);

      wx.hideLoading();
    } catch (error) {
      console.error('识别失败:', error);
      wx.hideLoading();
      wx.showToast({ title: '识别失败', icon: 'none' });
    }
  },

  /**
   * 计算准确度
   */
  calculateAccuracy(recognized, original) {
    const recognizedWords = recognized.toLowerCase().split(' ');
    const originalWords = original.toLowerCase().split(' ');

    let correctCount = 0;
    recognizedWords.forEach((word) => {
      if (originalWords.includes(word)) {
        correctCount++;
      }
    });

    return Math.round((correctCount / originalWords.length) * 100);
  },

  /**
   * 对比单词
   */
  compareWords(recognized, original) {
    const recognizedWords = recognized.toLowerCase().split(' ');
    const originalWords = original.toLowerCase().split(' ');

    return originalWords.map((word) => {
      const isCorrect = recognizedWords.includes(word);
      return {
        text: word,
        status: isCorrect ? 'correct' : 'wrong',
      };
    });
  },

  /**
   * 提交训练结果
   */
  async submitTrainingResult(recognizedText, accuracyScore) {
    try {
      await app.request({
        url: '/training/submit',
        method: 'POST',
        data: {
          course_id: this.data.sentence.course_id,
          sentence_id: this.data.sentence.sentence_id,
          recognized_text: recognizedText,
          accuracy_score: accuracyScore,
          client_type: 'weapp',
        },
      });
    } catch (error) {
      console.error('提交失败:', error);
    }
  },

  /**
   * 下一句
   */
  nextSentence() {
    // TODO: 加载下一句
    this.setData({
      showResult: false,
      recognizedText: '',
      accuracyScore: 0,
      words: [],
    });
  },

  /**
   * 重试
   */
  retry() {
    this.setData({
      showResult: false,
      recognizedText: '',
      accuracyScore: 0,
      words: [],
    });
    this.playAudio();
  },
});
