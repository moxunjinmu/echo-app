// miniprogram/pages/progress/progress.js
const app = getApp();

Page({
  data: {
    weekCheckin: [],
    todayProgress: {},
    inProgressCourses: [],
  },

  onLoad() {
    this.loadStudyData();
  },

  async loadStudyData() {
    try {
      wx.showLoading({ title: '加载中...' });

      const [summary, courses] = await Promise.all([
        app.request({ url: '/user/study_summary' }),
        app.request({ url: '/user/courses/in_progress' }),
      ]);

      this.setData({
        weekCheckin: summary.data.week_checkin,
        todayProgress: {
          completed: summary.data.today_completed_minutes,
          target: summary.data.today_target_minutes,
          percent: Math.round(
            (summary.data.today_completed_minutes /
              summary.data.today_target_minutes) *
              100,
          ),
        },
        inProgressCourses: courses.data,
      });

      wx.hideLoading();
    } catch (error) {
      console.error('加载失败:', error);
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  onContinueTap(e) {
    const { courseId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/training/training?courseId=${courseId}`,
    });
  },
});
