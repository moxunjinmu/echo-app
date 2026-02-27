// app.js
App({
  globalData: {
    userInfo: null,
    token: null,
    apiBase: 'http://localhost:3000/api/v1',
  },

  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus();
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');

    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;

      // 验证 Token 是否有效
      this.verifyToken(token);
    }
  },

  /**
   * 验证 Token
   */
  async verifyToken(token) {
    try {
      const res = await this.request({
        url: '/auth/profile',
        header: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.statusCode === 200) {
        // Token 有效
        this.globalData.userInfo = res.data;
      } else {
        // Token 无效，清除登录状态
        this.logout();
      }
    } catch (error) {
      console.error('Token 验证失败:', error);
    }
  },

  /**
   * 登录成功
   */
  login(token, userInfo) {
    this.globalData.token = token;
    this.globalData.userInfo = userInfo;

    wx.setStorageSync('token', token);
    wx.setStorageSync('userInfo', userInfo);
  },

  /**
   * 登出
   */
  logout() {
    this.globalData.token = null;
    this.globalData.userInfo = null;

    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');

    // 跳转到登录页
    wx.redirectTo({
      url: '/pages/login/login',
    });
  },

  /**
   * 封装请求方法
   */
  request(options) {
    const { url, method = 'GET', data, header = {} } = options;

    // 添加 Token
    if (this.globalData.token) {
      header.Authorization = `Bearer ${this.globalData.token}`;
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.apiBase}${url}`,
        method,
        data,
        header,
        success: (res) => {
          if (res.statusCode === 401) {
            // Token 过期，跳转登录
            this.logout();
            reject(new Error('Unauthorized'));
          } else {
            resolve(res);
          }
        },
        fail: (error) => {
          reject(error);
        },
      });
    });
  },
});
