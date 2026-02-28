# Echo 项目心跳监控服务

> **启动时间**: 2026-02-28 12:06  
> **监控间隔**: 30 分钟  
> **状态**: ✅ 运行中

---

## 📊 监控状态

### 当前状态
- ✅ 服务运行中
- 🔄 自动检测: 每 30 分钟
- 📝 日志位置: `docs/heartbeat-monitor.log`
- 📊 报告位置: `docs/heartbeat-reports/`

### 监控内容
每次心跳检测会自动：
1. ✅ 检查 Git 提交次数
2. ✅ 检查后端服务状态
3. ✅ 检查小程序文件数量
4. ✅ 检查 Flutter 项目状态
5. ✅ 计算 TODO 完成进度
6. ✅ 生成健康状态报告
7. ✅ 保存报告到 `docs/heartbeat-reports/`

### 下次检测时间
- **下次检测**: 2026-02-28 12:37 (约 30 分钟后)
- **后续检测**: 每 30 分钟自动执行

---

## 🎛️ 服务管理

### 查看服务状态
```bash
ps aux | grep heartbeat-monitor
# 或
cat /root/project/fofo/.heartbeat.pid
```

### 查看日志
```bash
tail -f /root/project/fofo/docs/heartbeat-monitor.log
```

### 查看最新报告
```bash
ls -lt /root/project/fofo/docs/heartbeat-reports/ | head -5
```

### 手动触发检测
```bash
cd /root/project/fofo
./scripts/heartbeat.sh
```

### 停止监控服务
```bash
cd /root/project/fofo
./scripts/stop-heartbeat.sh
```

### 重启监控服务
```bash
cd /root/project/fofo
./scripts/stop-heartbeat.sh
nohup bash scripts/heartbeat-monitor.sh > /dev/null 2>&1 &
```

---

## 📱 Telegram 通知 (可选)

如果需要将心跳报告发送到 Telegram，配置以下环境变量：

```bash
export TELEGRAM_BOT_TOKEN="your_bot_token"
export TELEGRAM_CHAT_ID="your_chat_id"
```

然后重启监控服务即可。

---

## 📝 历史记录

| 时间 | 状态 | 提交数 | 备注 |
|------|------|--------|------|
| 2026-02-28 12:06 | ✅ | 1 | 服务启动 |
| 2026-02-28 12:37 | ⏰ | - | 下次检测 |

---

## 🔔 提醒机制

心跳监控会自动：
- ✅ 每 30 分钟生成一次报告
- ✅ 记录到日志文件
- ✅ 保存 Markdown 报告
- 📱 (可选) 发送 Telegram 通知

**注意**: 心跳监控是后台服务，即使你关闭对话，它也会持续运行。

---

**当前服务 PID**: 查看 `.heartbeat.pid` 文件
