// pages/profile/profile.js
const app = getApp();

Page({
  data: {
    userInfo: {},
  },

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo || {},
    });
  },

  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo || {},
    });
  },

  /**
   * 菜单项点击
   */
  handleMenuTap(e) {
    const type = e.currentTarget.dataset.type;
    wx.showToast({
      title: '功能开发中',
      icon: 'none',
    });
  },

  /**
   * 退出登录
   */
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout();
        }
      },
    });
  },
});
