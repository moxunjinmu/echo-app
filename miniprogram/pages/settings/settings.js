// miniprogram/pages/settings/settings.js
const app = getApp();

Page({
  data: {
    settings: {
      playbackSpeed: '1.0',
      autoPlay: true,
      showChinese: true,
      repeatCount: 1,
    },
    speedOptions: ['0.8', '1.0', '1.2', '1.5'],
  },

  onLoad() {
    this.loadSettings();
  },

  loadSettings() {
    const settings = wx.getStorageSync('settings') || this.data.settings;
    this.setData({ settings });
  },

  saveSettings() {
    wx.setStorageSync('settings', this.data.settings);
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  onSpeedChange(e) {
    const index = e.detail.value;
    this.setData({
      'settings.playbackSpeed': this.data.speedOptions[index],
    });
    this.saveSettings();
  },

  onAutoPlayChange(e) {
    this.setData({
      'settings.autoPlay': e.detail.value,
    });
    this.saveSettings();
  },

  onShowChineseChange(e) {
    this.setData({
      'settings.showChinese': e.detail.value,
    });
    this.saveSettings();
  },

  onRepeatCountChange(e) {
    this.setData({
      'settings.repeatCount': parseInt(e.detail.value) || 1,
    });
    this.saveSettings();
  },

  onClearCache() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({ title: '已清除', icon: 'success' });
          setTimeout(() => {
            wx.reLaunch({ url: '/pages/login/login' });
          }, 1500);
        }
      },
    });
  },

  onLogout() {
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
