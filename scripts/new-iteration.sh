#!/bin/bash
# 创建新迭代文档

ITERATION_NAME=$1

if [ -z "$ITERATION_NAME" ]; then
    echo "用法: ./scripts/new-iteration.sh <迭代名称>"
    echo "示例: ./scripts/new-iteration.sh 用户认证模块"
    exit 1
fi

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
- [ ] [任务3]

## 产出
- 代码: [待填写]
- 文档: [待填写]

## 测试结果
- 单元测试: [待填写]
- 集成测试: [待填写]
- 覆盖率: [待填写]

## 问题与解决
[待填写]

## 下一步
[待填写]

## Commit 记录
[待填写]
EOF

echo "✅ 创建迭代文档: $FILENAME"
echo "📝 请编辑文档填写迭代内容"
