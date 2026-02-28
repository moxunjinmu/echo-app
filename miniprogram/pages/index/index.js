// pages/index/index.js
const app = getApp();
const { getCourseList } = require('../../api/course.js');

Page({
  data: {
    greeting: '早上好',
    userInfo: {},
    currentTab: 'all',
    tabs: [
      { label: '推荐训练', value: 'all' },
      { label: '托福 TPO', value: 'toefl' },
      { label: '雅思剑桥', value: 'ielts' },
      { label: '职场实战', value: 'business' },
    ],
    courses: [],
    loading: true,
  },

  onLoad() {
    this.updateGreeting();
    this.setData({
      userInfo: app.globalData.userInfo || {},
    });
    this.loadCourses();
  },

  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo || {},
    });
  },

  /**
   * 更新问候语
   */
  updateGreeting() {
    const hour = new Date().getHours();
    let greeting = '晚上好';

    if (hour < 12) {
      greeting = '早上好';
    } else if (hour < 18) {
      greeting = '下午好';
    }

    this.setData({ greeting });
  },

  /**
   * 加载课程列表
   */
  async loadCourses() {
    try {
      this.setData({ loading: true });

      const category = this.data.currentTab === 'all' ? null : this.data.currentTab;
      const result = await getCourseList(category);

      this.setData({
        courses: result.list || [],
        loading: false,
      });
    } catch (error) {
      console.error('加载课程失败:', error);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none',
      });
    }
  },

  /**
   * Tab 切换
   */
  handleTabTap(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadCourses();
  },

  /**
   * 课程卡片点击
   */
  handleCourseTap(e) {
    const { course } = e.detail;
    wx.showToast({
      title: '课程详情页开发中',
      icon: 'none',
    });
    // TODO: 跳转到课程详情页
    // wx.navigateTo({
    //   url: `/pages/course-detail/course-detail?id=${course.course_id}`,
    // });
  },
});
