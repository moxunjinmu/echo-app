# Echo 微信小程序

## 开发说明

### 环境准备
1. 下载微信开发者工具：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. 导入项目：选择 `miniprogram` 目录
3. AppID：使用测试号或申请正式AppID

### 配置后端地址
在 `app.js` 中修改 `apiBase`：
```javascript
globalData: {
  apiBase: 'http://localhost:3000/api/v1', // 开发环境
  // apiBase: 'https://api.echo.com/api/v1', // 生产环境
}
```

### 功能模块
- [x] 登录页面（微信登录 + 手机号登录）
- [x] 首页（课程列表占位）
- [x] 个人中心（用户信息 + 退出登录）
- [ ] 课程详情页
- [ ] 训练器页面
- [ ] 学习进度页

### 登录测试
- 微信登录：使用开发者工具的"编译模式"测试
- 手机号登录：开发环境验证码固定为 `123456`

### 图标资源
TabBar 图标暂时缺失，需要设计师提供或使用 iconfont
