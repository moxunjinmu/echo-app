// pages/login/login.js
const app = getApp();

Page({
  data: {
    phone: '',
    code: '',
    agreed: false,
    canSendCode: false,
    codeButtonText: '发送验证码',
    countdown: 0,
  },

  /**
   * 手机号输入
   */
  onPhoneInput(e) {
    const phone = e.detail.value;
    this.setData({
      phone,
      canSendCode: this.validatePhone(phone) && this.data.countdown === 0,
    });
  },

  /**
   * 验证码输入
   */
  onCodeInput(e) {
    this.setData({
      code: e.detail.value,
    });
  },

  /**
   * 用户协议勾选
   */
  onAgreementChange(e) {
    this.setData({
      agreed: e.detail.value.length > 0,
    });
  },

  /**
   * 验证手机号格式
   */
  validatePhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone);
  },

  /**
   * 发送验证码
   */
  async handleSendCode() {
    if (!this.data.canSendCode) return;

    if (!this.data.agreed) {
      wx.showToast({
        title: '请先同意用户协议',
        icon: 'none',
      });
      return;
    }

    try {
      wx.showLoading({ title: '发送中...' });

      const res = await app.request({
        url: '/auth/phone/send_code',
        method: 'POST',
        data: { phone: this.data.phone },
      });

      wx.hideLoading();

      if (res.statusCode === 200) {
        wx.showToast({
          title: '验证码已发送',
          icon: 'success',
        });

        // 开发环境显示验证码
        if (res.data.code) {
          console.log('验证码:', res.data.code);
          wx.showModal({
            title: '开发环境',
            content: `验证码: ${res.data.code}`,
            showCancel: false,
          });
        }

        // 开始倒计时
        this.startCountdown();
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '发送失败',
        icon: 'none',
      });
      console.error('发送验证码失败:', error);
    }
  },

  /**
   * 开始倒计时
   */
  startCountdown() {
    let countdown = 60;
    this.setData({ countdown, canSendCode: false });

    const timer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(timer);
        this.setData({
          countdown: 0,
          canSendCode: this.validatePhone(this.data.phone),
          codeButtonText: '重新发送',
        });
      } else {
        this.setData({
          countdown,
          codeButtonText: `${countdown}s`,
        });
      }
    }, 1000);
  },

  /**
   * 手机号登录
   */
  async handlePhoneLogin() {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请先同意用户协议',
        icon: 'none',
      });
      return;
    }

    if (!this.validatePhone(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
      });
      return;
    }

    if (!this.data.code || this.data.code.length !== 6) {
      wx.showToast({
        title: '请输入6位验证码',
        icon: 'none',
      });
      return;
    }

    try {
      wx.showLoading({ title: '登录中...' });

      const res = await app.request({
        url: '/auth/phone/login',
        method: 'POST',
        data: {
          phone: this.data.phone,
          code: this.data.code,
        },
      });

      wx.hideLoading();

      if (res.statusCode === 201 && res.data.access_token) {
        // 登录成功
        app.login(res.data.access_token, res.data.user);

        wx.showToast({
          title: '登录成功',
          icon: 'success',
        });

        // 跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index',
          });
        }, 1500);
      } else {
        wx.showToast({
          title: res.data.message || '登录失败',
          icon: 'none',
        });
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '登录失败',
        icon: 'none',
      });
      console.error('手机号登录失败:', error);
    }
  },

  /**
   * 微信一键登录
   */
  async handleWechatLogin() {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请先同意用户协议',
        icon: 'none',
      });
      return;
    }

    try {
      wx.showLoading({ title: '登录中...' });

      // 获取微信 code
      const { code } = await wx.login();

      // 发送到后端验证
      const res = await app.request({
        url: '/auth/weapp/login',
        method: 'POST',
        data: { code },
      });

      wx.hideLoading();

      if (res.statusCode === 201 && res.data.access_token) {
        // 登录成功
        app.login(res.data.access_token, res.data.user);

        wx.showToast({
          title: '登录成功',
          icon: 'success',
        });

        // 跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index',
          });
        }, 1500);
      } else {
        wx.showToast({
          title: res.data.message || '登录失败',
          icon: 'none',
        });
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '登录失败',
        icon: 'none',
      });
      console.error('微信登录失败:', error);
    }
  },

  /**
   * 查看用户协议
   */
  handleViewAgreement(e) {
    const type = e.currentTarget.dataset.type;
    // TODO: 跳转到协议页面
    wx.showToast({
      title: '协议页面待开发',
      icon: 'none',
    });
  },
});
