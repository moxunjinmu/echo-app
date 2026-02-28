#!/bin/bash
# 自动继续开发脚本

PROJECT_DIR="/root/project/fofo"
TODO_FILE="$PROJECT_DIR/TODO.md"

echo "🔍 检查未完成任务..."

# 提取下一个优先任务
NEXT_TASK=$(grep -E "^\- \[ \]" "$TODO_FILE" | head -1)

if [ -z "$NEXT_TASK" ]; then
    echo "✅ 所有任务已完成！"
    exit 0
fi

echo ""
echo "📋 下一个任务："
echo "$NEXT_TASK"
echo ""

# 这里可以调用实际的开发逻辑
# 目前只是标记，需要人工或 AI Agent 继续开发
echo "💡 建议继续开发：根据 TODO.md 中的任务列表"
