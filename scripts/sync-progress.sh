#!/bin/bash
# 同步开发进度到文档

echo "🔄 同步开发进度..."

# 统计 TODO 完成情况
if [ -f "TODO.md" ]; then
    COMPLETED=$(grep -c "^\- \[x\]" TODO.md 2>/dev/null || echo "0")
    TOTAL=$(grep -c "^\- \[ \]" TODO.md 2>/dev/null || echo "0")
    
    if [ $((COMPLETED + TOTAL)) -gt 0 ]; then
        PERCENT=$((COMPLETED * 100 / (COMPLETED + TOTAL)))
        echo "📊 任务完成: $COMPLETED/$((COMPLETED + TOTAL)) ($PERCENT%)"
        
        # 更新 TODO-CHECKLIST.md
        if [ -f "TODO-CHECKLIST.md" ]; then
            sed -i.bak "s/后端 API | [0-9]*%/后端 API | ${PERCENT}%/" TODO-CHECKLIST.md
            sed -i.bak "s/微信小程序 | [0-9]*%/微信小程序 | ${PERCENT}%/" TODO-CHECKLIST.md
            sed -i.bak "s/Flutter App | [0-9]*%/Flutter App | ${PERCENT}%/" TODO-CHECKLIST.md
            echo "✅ 进度已同步到 TODO-CHECKLIST.md"
        fi
    fi
fi

# 更新 CHANGELOG
LAST_COMMIT=$(git log -1 --oneline 2>/dev/null)
if [ ! -z "$LAST_COMMIT" ]; then
    echo "📝 最新提交: $LAST_COMMIT"
fi

echo "✅ 进度同步完成"
