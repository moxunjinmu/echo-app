#!/bin/bash
# 心跳检测脚本

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
HEARTBEAT_FILE=".heartbeat"
REPORT_FILE="docs/heartbeat-reports/heartbeat-$(date +%Y%m%d-%H%M).md"

# 创建报告目录
mkdir -p docs/heartbeat-reports

# 读取上次心跳时间
if [ -f "$HEARTBEAT_FILE" ]; then
    LAST_HEARTBEAT=$(cat $HEARTBEAT_FILE)
    TIME_DIFF=$(( $(date +%s) - LAST_HEARTBEAT ))
    MINUTES=$(( TIME_DIFF / 60 ))
else
    MINUTES=0
fi

# 生成报告
cat > $REPORT_FILE << EOF
# Echo 项目心跳检测报告

**检测时间**: $TIMESTAMP  
**距上次检测**: ${MINUTES} 分钟

---

## 【进度概览】

EOF

# 检测 Git 提交
if [ -d ".git" ]; then
    COMMIT_COUNT=$(git log --since="${MINUTES} minutes ago" --oneline 2>/dev/null | wc -l)
    echo "### Git 提交" >> $REPORT_FILE
    echo "- 最近 ${MINUTES} 分钟提交次数: **$COMMIT_COUNT**" >> $REPORT_FILE
    echo "" >> $REPORT_FILE
    
    if [ $COMMIT_COUNT -gt 0 ]; then
        echo "#### 提交列表" >> $REPORT_FILE
        echo "\`\`\`" >> $REPORT_FILE
        git log --since="${MINUTES} minutes ago" --oneline >> $REPORT_FILE
        echo "\`\`\`" >> $REPORT_FILE
        echo "" >> $REPORT_FILE
    fi
fi

# 检测后端
if [ -f "backend/package.json" ]; then
    echo "### 后端状态" >> $REPORT_FILE
    cd backend
    if [ -d "node_modules" ]; then
        echo "- ✅ 依赖已安装" >> $REPORT_FILE
        # 检查是否有测试
        if grep -q '"test"' package.json; then
            TEST_RESULT=$(pnpm test 2>&1 | tail -10)
            TEST_STATUS=$?
            echo "- 测试状态: $([ $TEST_STATUS -eq 0 ] && echo '✅ 通过' || echo '❌ 失败')" >> $REPORT_FILE
        fi
    else
        echo "- ⚠️ 依赖未安装" >> $REPORT_FILE
    fi
    cd ..
    echo "" >> $REPORT_FILE
fi

# 检测小程序
if [ -d "miniprogram" ]; then
    echo "### 小程序状态" >> $REPORT_FILE
    FILE_COUNT=$(find miniprogram -name "*.js" -o -name "*.wxml" -o -name "*.wxss" 2>/dev/null | wc -l)
    echo "- 文件数量: $FILE_COUNT" >> $REPORT_FILE
    echo "" >> $REPORT_FILE
fi

# 检测 Flutter
if [ -d "flutter_app" ]; then
    echo "### Flutter 状态" >> $REPORT_FILE
    cd flutter_app
    if [ -f "pubspec.yaml" ]; then
        if [ -d ".dart_tool" ]; then
            echo "- ✅ 依赖已安装" >> $REPORT_FILE
            ANALYZE_RESULT=$(flutter analyze 2>&1 | tail -5)
            echo "- 静态分析: " >> $REPORT_FILE
            echo "\`\`\`" >> $REPORT_FILE
            echo "$ANALYZE_RESULT" >> $REPORT_FILE
            echo "\`\`\`" >> $REPORT_FILE
        else
            echo "- ⚠️ 依赖未安装" >> $REPORT_FILE
        fi
    fi
    cd ..
    echo "" >> $REPORT_FILE
fi

# 计算进度
if [ -f "TODO.md" ]; then
    COMPLETED=$(grep -c "^\- \[x\]" TODO.md 2>/dev/null || echo "0")
    TOTAL=$(grep -c "^\- \[ \]" TODO.md 2>/dev/null || echo "0")
    if [ $((COMPLETED + TOTAL)) -gt 0 ]; then
        PERCENT=$((COMPLETED * 100 / (COMPLETED + TOTAL)))
        echo "### TODO 进度" >> $REPORT_FILE
        echo "- 已完成: $COMPLETED" >> $REPORT_FILE
        echo "- 待完成: $TOTAL" >> $REPORT_FILE
        echo "- 完成率: **${PERCENT}%**" >> $REPORT_FILE
        echo "" >> $REPORT_FILE
    fi
fi

# 健康状态评估
echo "---" >> $REPORT_FILE
echo "" >> $REPORT_FILE
echo "## 【健康状态】" >> $REPORT_FILE
echo "" >> $REPORT_FILE

if [ $COMMIT_COUNT -gt 0 ]; then
    echo "✅ 开发活动正常" >> $REPORT_FILE
else
    echo "⚠️ 最近 ${MINUTES} 分钟无提交记录" >> $REPORT_FILE
fi

# 更新心跳时间
date +%s > $HEARTBEAT_FILE

echo "" >> $REPORT_FILE
echo "---" >> $REPORT_FILE
echo "" >> $REPORT_FILE
echo "## 【下次检测】" >> $REPORT_FILE
echo "" >> $REPORT_FILE
NEXT_TIME=$(date -d "+30 minutes" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || date -v+30M '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo "30分钟后")
echo "**$NEXT_TIME**" >> $REPORT_FILE

# 输出报告
cat $REPORT_FILE

echo ""
echo "✅ 心跳检测报告已生成: $REPORT_FILE"
