#!/bin/bash
# 停止心跳监控服务

PID_FILE="/root/project/fofo/.heartbeat.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "❌ 心跳监控未运行"
    exit 0
fi

PID=$(cat "$PID_FILE")

if ps -p "$PID" > /dev/null 2>&1; then
    echo "🛑 停止心跳监控 (PID: $PID)..."
    kill "$PID"
    rm "$PID_FILE"
    echo "✅ 心跳监控已停止"
else
    echo "⚠️ 进程不存在，清理 PID 文件"
    rm "$PID_FILE"
fi
