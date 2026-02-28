// miniprogram/pages/weakness/weakness.js
const app = getApp();

Page({
  data: {
    currentTab: 'wrong',
    weaknessList: [],
    vocabularyList: [],
  },

  onLoad() {
    this.loadData();
  },

  async loadData() {
    if (this.data.currentTab === 'wrong') {
      await this.loadWeakness();
    } else {
      await this.loadVocabulary();
    }
  },

  async loadWeakness() {
    try {
      const res = await app.request({
        url: `/training/weakness/${app.globalData.userInfo.user_id}`,
      });
      this.setData({ weaknessList: res.data });
    } catch (error) {
      console.error('加载弱项失败:', error);
    }
  },

  async loadVocabulary() {
    // TODO: 实现生词本API
    this.setData({
      vocabularyList: [
        {
          word_id: '1',
          word: 'hall',
          meaning: 'n. 走廊，大厅',
          example: 'Walk down the hall.',
        },
      ],
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadData();
  },

  playAudio(e) {
    const { url } = e.currentTarget.dataset;
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = url;
    innerAudioContext.play();
  },

  showAnalysis(e) {
    const { id } = e.currentTarget.dataset;
    wx.showToast({ title: 'AI 解析开发中', icon: 'none' });
  },

  async removeWeakness(e) {
    const { id } = e.currentTarget.dataset;
    // TODO: 调用标记已掌握API
    wx.showToast({ title: '已标记为掌握', icon: 'success' });
    await this.loadWeakness();
  },

  deleteWord(e) {
    const { id } = e.currentTarget.dataset;
    // TODO: 调用删除生词API
    wx.showToast({ title: '已删除', icon: 'success' });
  },

  batchTrain() {
    wx.showToast({ title: '批量训练开发中', icon: 'none' });
  },
});
