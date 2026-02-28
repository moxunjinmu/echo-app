// miniprogram/pages/course-detail/course-detail.js
const app = getApp();
const { getCourseDetail, getCourseSentences } = require('../../api/course.js');

Page({
  data: {
    course: null,
    sentences: [],
    userProgress: 0,
    loading: true,
  },

  onLoad(options) {
    const { courseId } = options;
    this.loadCourseDetail(courseId);
  },

  async loadCourseDetail(courseId) {
    try {
      wx.showLoading({ title: '加载中...' });

      const [courseRes, sentencesRes] = await Promise.all([
        getCourseDetail(courseId),
        getCourseSentences(courseId),
      ]);

      // 计算用户进度
      const completedCount = sentencesRes.data.filter(
        (s) => s.completed,
      ).length;
      const progress = Math.round(
        (completedCount / sentencesRes.data.length) * 100,
      );

      this.setData({
        course: courseRes,
        sentences: sentencesRes.data,
        userProgress: progress,
        loading: false,
      });

      wx.hideLoading();
    } catch (error) {
      console.error('加载课程详情失败:', error);
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  onStartTraining() {
    const { course, sentences } = this.data;

    // 找到第一个未完成的句子
    const nextSentence = sentences.find((s) => !s.completed) || sentences[0];

    wx.navigateTo({
      url: `/pages/training/training?courseId=${course.course_id}&sentenceId=${nextSentence.sentence_id}`,
    });
  },

  onSentenceTap(e) {
    const { index } = e.currentTarget.dataset;
    const { sentences, course } = this.data;
    const sentence = sentences[index];

    if (sentence.locked) {
      wx.showToast({
        title: '请先完成前面的句子',
        icon: 'none',
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/training/training?courseId=${course.course_id}&sentenceId=${sentence.sentence_id}`,
    });
  },
});
