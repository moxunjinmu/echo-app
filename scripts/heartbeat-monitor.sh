#!/bin/bash
# 心跳监控服务 - 每30分钟自动检测

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
    OLD_PID=$(cat "$PID_FILE")
    if ps -p "$OLD_PID" > /dev/null 2>&1; then
        echo "❌ 心跳监控已在运行 (PID: $OLD_PID)"
        echo "如需重启，请运行: kill $OLD_PID && rm $PID_FILE"
        exit 1
    fi
fi

# 写入 PID
echo $$ > "$PID_FILE"

log "💓 Echo 项目心跳监控服务启动"
log "📁 项目目录: $PROJECT_DIR"
log "⏰ 检测间隔: 30 分钟"
log "📝 日志文件: $LOG_FILE"
log "🔍 PID: $$"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 循环监控
while true; do
    log ""
    log "⏰ 开始心跳检测..."
    
    cd "$PROJECT_DIR"
    
    # 运行心跳脚本
    if [ -f "$PROJECT_DIR/scripts/heartbeat.sh" ]; then
        bash "$PROJECT_DIR/scripts/heartbeat.sh" >> "$LOG_FILE" 2>&1
        
        # 同时发送通知到 Telegram（如果配置了）
        if [ ! -z "$TELEGRAM_BOT_TOKEN" ] && [ ! -z "$TELEGRAM_CHAT_ID" ]; then
            # 读取最新的心跳报告
            LATEST_REPORT=$(ls -t $PROJECT_DIR/docs/heartbeat-reports/*.md 2>/dev/null | head -1)
            if [ -f "$LATEST_REPORT" ]; then
                REPORT_CONTENT=$(cat "$LATEST_REPORT")
                
                # 发送到 Telegram
                curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
                    -d chat_id="$TELEGRAM_CHAT_ID" \
                    -d text="$REPORT_CONTENT" \
                    -d parse_mode="Markdown" > /dev/null 2>&1
            fi
        fi
    else
        log "❌ 心跳脚本不存在: $PROJECT_DIR/scripts/heartbeat.sh"
    fi
    
    log "✅ 心跳检测完成"
    log "💤 等待 30 分钟..."
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # 等待 30 分钟 (1800 秒)
    sleep 1800
done
