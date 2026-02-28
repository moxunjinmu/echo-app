# Echo Flutter App

## 环境要求
- Flutter SDK >= 3.0.0
- Dart >= 3.0.0

## 开发说明

### 安装依赖
```bash
flutter pub get
```

### 运行应用
```bash
flutter run
```

### 构建应用
```bash
# Android
flutter build apk

# iOS
flutter build ios
```

## 项目结构
```
lib/
├── main.dart              # 应用入口
├── router/                # 路由配置
├── pages/                 # 页面
│   ├── login/            # 登录页
│   ├── home/             # 首页
│   └── profile/          # 个人中心
├── providers/             # 状态管理
├── services/              # 服务层
├── models/                # 数据模型
├── utils/                 # 工具类
└── widgets/               # 公共组件
```

## 功能模块
- [x] 登录页面 UI
- [x] 状态管理 (Riverpod)
- [x] 路由配置 (go_router)
- [ ] 微信 SDK 集成
- [ ] 课程列表页
- [ ] 训练器页面

## 配置后端地址
在 `lib/services/auth_service.dart` 中修改 `baseUrl`：
```dart
baseUrl: 'http://your-server:3000/api/v1',
```
