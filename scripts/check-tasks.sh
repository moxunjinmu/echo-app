#!/bin/bash
# 智能心跳检测 - 返回未完成任务

PROJECT_DIR="/root/project/fofo"
TODO_FILE="$PROJECT_DIR/TODO.md"

echo "# 未完成任务检测"
echo "**时间**: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 提取未完成的任务
echo "## 🔴 待完成任务"
grep -E "^\- \[ \]" "$TODO_FILE" | head -20

echo ""
echo "## ✅ 已完成任务统计"
COMPLETED=$(grep -c "^\- \[x\]" "$TODO_FILE" 2>/dev/null || echo "0")
TOTAL=$(grep -c "^\- \[ \]" "$TODO_FILE" 2>/dev/null || echo "0")
echo "已完成: $COMPLETED"
echo "待完成: $TOTAL"

# 返回最重要的未完成任务
echo ""
echo "## 🎯 优先任务（下一步）"
echo "根据 TODO.md，最优先的任务是："
grep -E "^\- \[ \]" "$TODO_FILE" | head -5
