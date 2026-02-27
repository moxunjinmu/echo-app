# AI 编程开发最佳实践流程

> 版本: v1.0  
> 创建时间: 2026-02-28  
> 适用范围: Echo 项目全栈开发（后端 + 小程序 + Flutter App）

---

## 📋 目录

1. [核心理念](#核心理念)
2. [开发流程](#开发流程)
3. [迭代规范](#迭代规范)
4. [质量保证](#质量保证)
5. [进度管理](#进度管理)
6. [文档规范](#文档规范)

---

## 核心理念

### 1. TDD（测试驱动开发）三阶段循环

基于美团技术团队的最佳实践，严格遵循 **Red-Green-Refactor** 循环：

```
┌─────────────────────────────────────────┐
│                                         │
│  🔴 Red 阶段                            │
│  - 编写失败的测试用例                    │
│  - 明确需求和预期行为                    │
│  - 提交到 Git（标记 WIP）               │
│                                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│                                         │
│  🟢 Green 阶段                          │
│  - 编写最小代码通过测试                  │
│  - 不追求完美，只求通过                  │
│  - 提交到 Git（测试通过）               │
│                                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│                                         │
│  🔵 Refactor 阶段                       │
│  - 优化代码结构                         │
│  - 消除重复代码                         │
│  - 提交到 Git（重构完成）               │
│                                         │
└──────────────┬──────────────────────────┘
               │
               └──────────→ 下一轮循环
```

### 2. 增量迭代原则

- **小步快跑**: 每次迭代不超过 2 小时
- **可验证**: 每个迭代必须有可验证的产出
- **可回滚**: 每个迭代必须能独立回滚
- **可演示**: 每个迭代必须能演示功能

### 3. AI Agent 编程准则

#### 3.1 明确声明阶段
Agent 在每个阶段开始前必须明确声明：
```
【当前阶段】Red - 编写测试用例
【目标】为用户登录 API 编写测试用例
【预期产出】测试文件 + 失败的测试结果
```

#### 3.2 上下文管理
- 每次迭代开始前读取相关文档（TODO.md、PRD、API 文档）
- 每次迭代结束后更新进度文档
- 关键决策记录在 DECISIONS.md

#### 3.3 质量检查点
- [ ] 代码符合规范（ESLint/Prettier/Dart Analyze）
- [ ] 测试覆盖率达标（后端 >80%，前端关键路径 100%）
- [ ] 无 TypeScript/Dart 类型错误
- [ ] API 文档已更新
- [ ] Git commit 信息清晰

---

## 开发流程

### 阶段 1: 需求分析 (15 分钟)

**输入**: PRD 文档、UI 设计稿  
**输出**: 迭代计划文档

```markdown
# 迭代计划 - Sprint X

## 目标
- 实现用户登录功能

## 任务拆解
1. [ ] 后端: 创建用户表 + 认证 API (1h)
2. [ ] 小程序: 登录页面 UI (30m)
3. [ ] 小程序: 登录逻辑实现 (30m)
4. [ ] Flutter: 登录页面 UI (30m)
5. [ ] 集成测试 (30m)

## 验收标准
- [ ] 用户可以通过微信登录
- [ ] 用户可以通过手机号登录
- [ ] 登录状态持久化
- [ ] Token 自动刷新
```

### 阶段 2: 后端开发 (TDD)

#### 2.1 Red 阶段 - 编写测试
```bash
# 创建测试文件
touch backend/test/auth.test.ts

# 编写测试用例
# - 测试微信登录
# - 测试手机号登录
# - 测试 Token 刷新

# 运行测试（预期失败）
pnpm test

# 提交 WIP
git add .
git commit -m "test(auth): add auth API tests [WIP]"
```

#### 2.2 Green 阶段 - 实现功能
```bash
# 创建 API 路由
touch backend/src/modules/auth/auth.controller.ts

# 实现最小可用代码
# - 连接微信 API
# - 生成 JWT Token

# 运行测试（预期通过）
pnpm test

# 提交
git add .
git commit -m "feat(auth): implement auth API"
```

#### 2.3 Refactor 阶段 - 优化代码
```bash
# 优化代码结构
# - 提取公共方法
# - 添加错误处理
# - 添加日志

# 运行测试（确保仍通过）
pnpm test

# 提交
git add .
git commit -m "refactor(auth): optimize code structure"
```

### 阶段 3: 前端开发

#### 3.1 小程序开发
```bash
# 创建页面
miniprogram/pages/login/

# Red: 编写页面测试（使用 miniprogram-automator）
# Green: 实现页面 UI 和逻辑
# Refactor: 优化组件和样式

# 提交
git add .
git commit -m "feat(miniprogram): add login page"
```

#### 3.2 Flutter 开发
```bash
# 创建页面
lib/pages/login_page.dart

# Red: 编写 Widget 测试
# Green: 实现 Widget UI 和逻辑
# Refactor: 优化性能和代码结构

# 提交
git add .
git commit -m "feat(flutter): add login page"
```

### 阶段 4: 集成测试

```bash
# 运行完整测试套件
pnpm test:all

# 运行 E2E 测试
pnpm test:e2e

# 生成测试报告
pnpm test:report
```

### 阶段 5: 文档更新

```bash
# 更新 API 文档
# 更新进度文档
# 更新 CHANGELOG

git add .
git commit -m "docs: update API docs and progress"
```

---

## 迭代规范

### 迭代周期

- **微型迭代**: 30 分钟（单个功能点）
- **小型迭代**: 2 小时（单个模块）
- **中型迭代**: 1 天（单个特性）
- **大型迭代**: 1 周（完整功能）

### 迭代文档模板

每次迭代创建文档: `docs/iterations/sprint-YYYY-MM-DD-HHMM.md`

```markdown
# Sprint - [迭代名称]

**时间**: 2026-02-28 10:00 - 12:00  
**类型**: 小型迭代  
**负责人**: AI Agent (moma)

## 目标
实现用户认证模块

## 任务清单
- [x] 后端: 用户表设计
- [x] 后端: 认证 API 实现
- [x] 小程序: 登录页面
- [x] Flutter: 登录页面
- [ ] 集成测试

## 产出
- 代码: backend/src/modules/auth/
- 代码: miniprogram/pages/login/
- 代码: lib/pages/login_page.dart
- 文档: docs/api/auth.md

## 测试结果
- 单元测试: ✅ 15/15 passed
- 集成测试: ⏸️ 未开始
- 覆盖率: 85%

## 问题与解决
1. **问题**: 微信登录 code 获取失败
   **解决**: 需要先调用 wx.login()，确保用户授权

## 下一步
- 完成集成测试
- 开始课程列表模块开发

## Commit 记录
- `abc1234` test(auth): add auth API tests [WIP]
- `def5678` feat(auth): implement auth API
- `ghi9012` refactor(auth): optimize code structure
- `jkl3456` feat(miniprogram): add login page
- `mno7890` feat(flutter): add login page
```

---

## 质量保证

### 代码规范

#### 后端 (Node.js/TypeScript)
```json
// .eslintrc.json
{
  "extends": ["@nestjs/eslint-config"],
  "rules": {
    "no-console": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

#### 小程序 (JavaScript)
```json
// .eslintrc.json
{
  "extends": ["eslint:recommended"],
  "env": {
    "es6": true,
    "node": true
  }
}
```

#### Flutter (Dart)
```yaml
# analysis_options.yaml
include: package:flutter_lints/flutter.yaml
linter:
  rules:
    - avoid_print
    - prefer_const_constructors
    - require_trailing_commas
```

### 测试覆盖率要求

| 模块 | 最低覆盖率 | 目标覆盖率 |
|------|-----------|-----------|
| 后端 API | 80% | 90% |
| 工具函数 | 90% | 100% |
| 前端组件 | 60% | 80% |
| 关键路径 | 100% | 100% |

### CI/CD 检查项

每次提交自动运行：
- [ ] ESLint/Prettier 检查
- [ ] TypeScript/Dart 类型检查
- [ ] 单元测试
- [ ] 测试覆盖率报告
- [ ] 构建（后端/小程序/Flutter）

---

## 进度管理

### 心跳检测机制

每 30 分钟自动检测进度，生成报告：

```bash
# 心跳检测脚本
./scripts/heartbeat.sh
```

**检测内容**：
1. Git 提交次数（最近 30 分钟）
2. 测试通过率
3. 文档更新状态
4. 当前迭代进度
5. 阻塞问题

**输出示例**：
```
=== Echo 项目心跳检测 ===
时间: 2026-02-28 10:30:00
上次检测: 2026-02-28 10:00:00

【进度概览】
- 提交次数: 3
- 测试通过: 15/15 ✅
- 文档更新: ✅
- 当前阶段: Green (认证 API 实现)

【健康状态】
✅ 开发进度正常
✅ 测试覆盖达标
⚠️ 文档更新滞后

【建议行动】
- 继续完成 Green 阶段
- 准备进入 Refactor 阶段
- 更新 API 文档

【下次检测】
2026-02-28 11:00:00
```

### 进度同步

每次迭代结束，自动更新：
1. `TODO.md` - 任务完成状态
2. `TODO-CHECKLIST.md` - 进度百分比
3. `CHANGELOG.md` - 变更日志
4. `README.md` - 项目状态

---

## 文档规范

### 文档结构

```
docs/
├── api/              # API 文档
│   ├── auth.md
│   ├── courses.md
│   └── training.md
├── architecture/     # 架构文档
│   ├── backend.md
│   ├── database.md
│   └── frontend.md
├── iterations/       # 迭代记录
│   ├── sprint-2026-02-28-1000.md
│   └── sprint-2026-02-28-1200.md
├── decisions/        # 技术决策
│   └── adr-001-asr-service.md
└── guides/           # 开发指南
    ├── setup.md
    ├── testing.md
    └── deployment.md
```

### ADR (Architecture Decision Records)

重大技术决策记录：

```markdown
# ADR-001: ASR 服务选型

## 状态
已采纳

## 背景
需要为语音识别功能选择 ASR 服务提供商

## 决策
选择腾讯云 ASR 作为主力服务

## 理由
1. 与微信小程序同区域，延迟低
2. 价格适中，有免费额度
3. 支持实时流式识别
4. 中文识别准确率高

## 后果
- 需要申请腾讯云账号
- 需要配置密钥管理
- 后续可切换为自建 Whisper
```

---

## 工具与脚本

### 1. 迭代创建脚本

```bash
#!/bin/bash
# scripts/new-iteration.sh

ITERATION_NAME=$1
TIMESTAMP=$(date +%Y-%m-%d-%H%M)
FILENAME="docs/iterations/sprint-${TIMESTAMP}.md"

cat > $FILENAME << EOF
# Sprint - ${ITERATION_NAME}

**时间**: $(date '+%Y-%m-%d %H:%M')  
**类型**: 微型迭代  
**负责人**: AI Agent (moma)

## 目标
[填写迭代目标]

## 任务清单
- [ ] [任务1]
- [ ] [任务2]

## 产出
[待填写]

## 测试结果
[待填写]

## 问题与解决
[待填写]

## 下一步
[待填写]

## Commit 记录
[待填写]
EOF

echo "✅ 创建迭代文档: $FILENAME"
```

### 2. 心跳检测脚本

```bash
#!/bin/bash
# scripts/heartbeat.sh

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LAST_HEARTBEAT=$(cat .heartbeat 2>/dev/null || echo "0")
CURRENT_TIME=$(date +%s)
TIME_DIFF=$((CURRENT_TIME - LAST_HEARTBEAT))

echo "=== Echo 项目心跳检测 ==="
echo "时间: $TIMESTAMP"
echo "距上次检测: ${TIME_DIFF}秒"

# 检测 Git 提交
COMMITS=$(git log --since="${TIME_DIFF} seconds ago" --oneline | wc -l)
echo ""
echo "【进度概览】"
echo "- 提交次数: $COMMITS"

# 检测测试状态
if [ -f "backend/package.json" ]; then
  cd backend
  TEST_RESULT=$(pnpm test 2>&1 | tail -5)
  echo "- 测试状态:"
  echo "$TEST_RESULT"
  cd ..
fi

# 更新心跳时间
echo $CURRENT_TIME > .heartbeat

echo ""
echo "【下次检测】"
NEXT_TIME=$(date -d "+30 minutes" '+%Y-%m-%d %H:%M:%S')
echo "$NEXT_TIME"
```

### 3. 进度同步脚本

```bash
#!/bin/bash
# scripts/sync-progress.sh

# 更新 TODO.md 完成状态
# 更新 TODO-CHECKLIST.md 进度百分比
# 更新 CHANGELOG.md

echo "🔄 同步开发进度..."

# 统计完成的任务
COMPLETED=$(grep -c "\[x\]" TODO.md)
TOTAL=$(grep -c "\[ \]" TODO.md || echo "0")
PERCENT=$((COMPLETED * 100 / (COMPLETED + TOTAL)))

echo "✅ 任务完成: $COMPLETED/$((COMPLETED + TOTAL)) ($PERCENT%)"

# 更新进度到文档
# ... (具体实现)
```

---

## 总结

### 核心原则

1. **TDD 驱动**: 先写测试，再写代码
2. **小步快跑**: 每次迭代不超过 2 小时
3. **文档同步**: 代码和文档同步更新
4. **持续验证**: 每 30 分钟心跳检测
5. **Git 驱动**: 每个阶段都有提交记录

### 成功指标

- 测试覆盖率 > 80%
- 每日提交 > 5 次
- 文档完整度 = 100%
- 迭代按时完成率 > 90%

---

**最后更新**: 2026-02-28  
**下次审查**: 每周一次
