# FlowSpace ENFP

个人生产力仪表盘，支持 16 MBTI 类型切换，核心由「工作台 + 灵感收件箱」组成。

## 运行

```bash
npm install
npm run dev
```

## 快捷键

- **Ctrl/Cmd + K**：任意页面唤起「快捕 Dialog」，粘贴链接或写一句话，回车入箱

> 注意：当浏览器焦点在地址栏时，Chrome 会吞掉 Ctrl+K（作为 site search 快捷键），这是浏览器原生行为。将焦点移到页面内（点一下页面空白）即可正常触发。

## 目录

```
src/
├── components/    # Vue 组件（按 layout / mbti / workspace / inbox / common 分组）
├── stores/        # Pinia store（useMbti / useWorkspace / useInbox）
├── services/      # storage.js 等基础设施
├── config/        # mbti.js / sparks.js / praises.js
├── utils/         # time / urlDetect
├── composables/   # useReward / useHotkey / useDraggable
├── views/         # DashboardView / InboxView
├── styles/        # base.css / tokens.css
└── mocks/         # seed.json
```

## 测试

```bash
npx vitest run
```

## 设计文档

- Spec：`docs/superpowers/specs/2026-04-30-flowspace-vue-inbox-design.md`
- Plan：`docs/superpowers/plans/2026-04-30-flowspace-vue-inbox-plan.md`

## 数据持久化

所有数据存 localStorage，key 以 `fs1_` 开头：

- `fs1_mbti`：当前 MBTI 类型
- `fs1_workspace`：工作台所有模块数据（single key 整体序列化）
- `fs1_inbox_items`：灵感收件箱条目
- `fs1_inbox_seeded`：首次 seed 迁移哨兵
- `fs1_todo_collapsed`：四象限是否折叠
- `fs1_daily_spark`：当日灵感语录索引
