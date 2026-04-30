#!/usr/bin/env bash
# 批量创建 47 个 GitHub issue，按 Batch 1/2/3 分配到 milestone 1/2/3
# 每个 issue 标题为 "Task N: <原标题>"，body 指向 plan 文件对应行号
set -euo pipefail

REPO="Busy0124add1/flowspace-enfp"
PLAN_PATH="docs/superpowers/plans/2026-04-30-flowspace-vue-inbox-plan.md"
PLAN_BLOB_BASE="https://github.com/${REPO}/blob/main/${PLAN_PATH}"

# 每行格式: 任务号|milestone 号|行号|标题
ITEMS=$(cat <<'EOF'
1|1|32|初始化 Vite + Vue 3 项目
2|1|166|接入 Pinia 和 PrimeVue (unstyled)
3|1|206|创建全局样式基础（base.css + tokens.css）
4|1|349|MBTI 配置文件
5|1|481|storage.js 服务 + 测试
6|1|576|useMbti Pinia store
7|1|688|AvatarBlock 组件
8|1|821|Vue Router 配置
9|1|1000|TopBar 组件（含 MbtiSwitcher 和 PageTabs）
10|2|1313|useWorkspace store + seed.json（含 TDD）
11|2|1578|相对时间格式化工具（含 TDD）
12|2|1658|DashboardView 两列布局 + RightSidebar 空壳
13|2|1763|EnergyPanel.vue
14|2|1933|JournalPanel.vue
15|2|2046|ThreadsPanel.vue（含 v2-3 字体改进）
16|2|2279|DesignFlowPanel.vue
17|2|2433|QuadrantTodo.vue 主体（含 v2-6b 径向渐变）
18|2|2868|QuadrantTodo 折叠能力（v2-6a）
19|2|2969|QuadrantTodo Tooltip + 延迟隐藏（v2-7）
20|2|3130|FlashNotes.vue
21|2|3288|SyncStatus.vue
22|2|3384|DailySpark.vue（含 v2-4 加宽）
23|2|3544|MascotAvatar.vue 基础版
24|2|3665|P4 视觉回归
25|2|3707|useInbox store（含 TDD）
26|2|4018|URL 抽取 + 来源 guess 纯函数（含 TDD）
27|2|4191|InboxCard.vue 折叠态
28|2|4445|InboxColumn.vue（含 drop 支持）
29|2|4596|InboxBoard.vue 四列布局 + 工具栏壳
30|2|4771|搜索框 + debounce
31|2|4862|标签过滤（PrimeVue MultiSelect）
32|2|4946|排序下拉
33|2|5013|批量操作工具栏
34|2|5097|P5 联合目测回归 + 拖拽浏览器交叉验证
35|3|5150|useHotkey composable（含 TDD）
36|3|5246|QuickCaptureDialog 组件
37|3|5556|浏览器热键冲突验证 + README 补说明
38|3|5640|InboxEditDialog 组件
39|3|6092|P7 联合目测
40|3|6125|praises.js + useReward composable（含 TDD）
41|3|6369|BurstLayer 组件 + 粒子 CSS
42|3|6461|PraiseToast 组件
43|3|6576|接入 Inbox 状态切换 celebrate
44|3|6683|接入 Workspace 模块 celebrate
45|3|6800|数字跳变 CountUp 接入
46|3|6850|Mascot celebrate class 联动
47|3|6933|P8 最终回归 + 全量测试
EOF
)

while IFS='|' read -r task_num milestone_num line_num title; do
  [ -z "$task_num" ] && continue
  issue_title="Task ${task_num}: ${title}"
  issue_body=$(cat <<EOB
**Plan 锚点**：[${PLAN_PATH}#L${line_num}](${PLAN_BLOB_BASE}#L${line_num})

**Batch**：${milestone_num}

**完成标准**：Plan 文件中该 Task 下的所有 \`- [ ] Step N\` 都完成，最后一步是 commit。子代理完成后应在本 issue 下评论，内容包括：
- 实际 commit hash
- 涉及的新增/修改文件
- 若有测试：通过的测试数量
- 遇到的偏离（如有）及原因

详见 plan 文件对应行号处的完整任务卡片。
EOB
)
  echo ">>> Creating issue ${task_num} (milestone ${milestone_num})..."
  gh issue create \
    --repo "$REPO" \
    --title "$issue_title" \
    --body "$issue_body" \
    --milestone "$(gh api repos/${REPO}/milestones/${milestone_num} --jq .title)" \
    >/dev/null
done <<< "$ITEMS"

echo ""
echo "=== Done. Counting issues ==="
gh issue list --repo "$REPO" --milestone "Batch 1 · P1-P3 脚手架 + 样式 + 路由" --limit 50 --state all --json number | python -c "import json,sys; print('Batch 1:', len(json.load(sys.stdin)))"
gh issue list --repo "$REPO" --milestone "Batch 2 · P4-P5 工作台迁移 + 收件箱核心" --limit 50 --state all --json number | python -c "import json,sys; print('Batch 2:', len(json.load(sys.stdin)))"
gh issue list --repo "$REPO" --milestone "Batch 3 · P6-P8 快捕 + 编辑 + 正反馈" --limit 50 --state all --json number | python -c "import json,sys; print('Batch 3:', len(json.load(sys.stdin)))"
