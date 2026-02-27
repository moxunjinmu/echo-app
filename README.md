# Echo - 盲听复说英语训练 App

> **项目代号**: Echo  
> **版本**: v0.1.0 (开发中)  
> **目标上线**: 2026 年 Q2

## 项目简介

Echo 是一款专注于英语听力与口语能力提升的移动训练工具，通过 "盲听 + 实时复说 + 智能反馈" 的核心机制，帮助用户建立直接的听说反射链路。

## 技术栈

### 后端
- Node.js + NestJS
- MySQL + Redis
- 腾讯云 ASR + 智谱 GLM-4

### 前端
- 微信小程序（原生）
- Flutter App（iOS + Android）

## 项目结构

```
fofo/
├── backend/              # NestJS 后端
├── miniprogram/          # 微信小程序
├── flutter_app/          # Flutter App
├── docs/                 # 文档
│   ├── api/             # API 文档
│   ├── architecture/    # 架构文档
│   ├── iterations/      # 迭代记录
│   └── decisions/       # 技术决策
├── scripts/              # 工具脚本
├── TODO.md               # 开发任务列表
├── TODO-CHECKLIST.md     # 进度追踪
├── AI-DEV-WORKFLOW.md    # 开发流程规范
└── CHANGELOG.md          # 变更日志
```

## 快速开始

### 后端开发
```bash
cd backend
pnpm install
pnpm run dev
```

### 小程序开发
```bash
cd miniprogram
# 使用微信开发者工具打开
```

### Flutter 开发
```bash
cd flutter_app
flutter pub get
flutter run
```

## 开发进度

- [x] 项目初始化
- [x] 开发流程文档
- [ ] 后端基础架构
- [ ] 核心功能开发
- [ ] 测试与优化
- [ ] 上线部署

详细进度见 [TODO-CHECKLIST.md](./TODO-CHECKLIST.md)

## 文档

- [产品需求文档 (PRD)](./Momo%20Echo%20PRD%20V1.pdf)
- [前端开发 PRD](./Echo%20前端开发%20PRD.pdf)
- [架构设计文档](./多端同步架构设计文档.pdf)
- [开发流程规范](./AI-DEV-WORKFLOW.md)

## 团队

- **产品**: 莫循瑾木
- **开发**: AI Agent (moma)

## License

Copyright © 2026 Echo Team
