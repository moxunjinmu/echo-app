#!/bin/bash
# 智能心跳监控 - 自动继续开发

PROJECT_DIR="/root/project/fofo"
LOG_FILE="$PROJECT_DIR/docs/heartbeat-monitor.log"
PID_FILE="$PROJECT_DIR/.heartbeat.pid"

# 记录日志
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 检查是否已经在运行
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE" 2>/dev/null)
    if ps -p "$OLD_PID" > /dev/null 2>&1; then
        log "❌ 心跳监控已在运行 (PID: $OLD_PID)"
        exit 1
    fi
fi

# 写入 PID
echo $$ > "$PID_FILE"

log "💓 Echo 项目智能心跳监控启动"
log "📁 项目目录: $PROJECT_DIR"
log "⏰ 检测间隔: 30 分钟"
log "🎯 自动继续开发: 启用"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 主循环
while true; do
    log ""
    log "⏰ 开始心跳检测..."
    
    cd "$PROJECT_DIR"
    
    # 1. 运行心跳检测
    if [ -f "$PROJECT_DIR/scripts/heartbeat.sh" ]; then
        bash "$PROJECT_DIR/scripts/heartbeat.sh" >> "$LOG_FILE" 2>&1
    fi
    
    log "✅ 心跳检测完成"
    
    # 2. 检查未完成任务并继续开发
    log ""
    log "🎯 检查未完成任务..."
    
    # 发送通知到主进程继续开发
    log "📤 发送开发指令..."
    
    # 创建开发任务标记文件
    echo "continue_development" > "$PROJECT_DIR/.dev-trigger"
    
    log "💤 等待 30 分钟..."
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # 等待 30 分钟
    sleep 1800
done
