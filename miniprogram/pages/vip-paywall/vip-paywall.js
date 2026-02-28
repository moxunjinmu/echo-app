// miniprogram/pages/vip-paywall/vip-paywall.js
const app = getApp();

Page({
  data: {
    selectedPlan: 'yearly', // 默认选择年度
  },

  selectPlan(e) {
    const { plan } = e.currentTarget.dataset;
    this.setData({ selectedPlan: plan });
  },

  async handlePay() {
    const { selectedPlan } = this.data;

    try {
      wx.showLoading({ title: '创建订单...' });

      // 创建订单
      const res = await app.request({
        url: '/payment/create',
        method: 'POST',
        data: {
          user_id: app.globalData.userInfo.user_id,
          product_type: selectedPlan,
          payment_method: 'wechat',
        },
      });

      wx.hideLoading();

      // 调用微信支付
      await wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
      });

      // 支付成功
      wx.showToast({
        title: '支付成功',
        icon: 'success',
      });

      // 刷新用户信息
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/profile/profile',
        });
      }, 1500);
    } catch (error) {
      wx.hideLoading();

      if (error.errMsg.includes('cancel')) {
        wx.showToast({
          title: '已取消支付',
          icon: 'none',
        });
      } else {
        wx.showToast({
          title: '支付失败',
          icon: 'none',
        });
      }
    }
  },
});
