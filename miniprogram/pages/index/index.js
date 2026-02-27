// pages/index/index.js
const app = getApp();

Page({
  data: {
    greeting: '早上好',
    userInfo: {},
    courses: [],
  },

  onLoad() {
    this.updateGreeting();
    this.setData({
      userInfo: app.globalData.userInfo || {},
    });
  },

  onShow() {
    // 刷新用户信息
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
});
