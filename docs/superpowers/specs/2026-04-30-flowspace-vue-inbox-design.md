# FlowSpace ENFP · Vue 重构 + 灵感收件箱（Part 1 of 3）

> Status: Draft v1 · Date: 2026-04-30  
> Supersedes: `2026-04-29-flowspace-enfp-vue-design.md`（旧版 Vue 重构设计）与 `PLAN.md` 中的"文章模块"设计（已被"灵感收件箱"语义替代）

---

## 1. 项目定位与范围

### 1.1 产品定位

FlowSpace 不只是一个仪表盘，它是一个**自我激励装置**，核心价值是"**快速捕获 → 清空脑袋 → 事后复盘**"的闭环：

- **工作台** = 当下专注的执行区（能量状态、并行任务、设计流程、四象限待办、笔记、灵感语录）
- **发现页 = 灵感收件箱**（Kanban 四态看板）= 信息洪流里的安全备份区。刷短视频/知乎/朋友圈看到某个想法想验证，但此刻不方便做——**Ctrl+K 唤起快捕 Dialog**，粘贴链接或一句话摘要，回车入箱，关闭，继续手头的事。脑袋即刻清空。事后有空回到收件箱，把条目在四列看板里拖动：未处理 → 验证中 → 完成（写复盘笔记）或 舍弃。
- **MBTI 主题切换** = 身份叙事层，16 类型每个都有 accent 色联动；ENFP 头像完整，其他 15 类型头像留占位，accent/描述/组别齐全。
- **正反馈系统** = 每一次完成都触发粒子爆炸、卡片脉冲、数字跳变、手绘 checkmark、Mascot 情绪变化、偶发赞美 toast，让多巴胺回路在产品里形成。

### 1.2 Part 1 交付边界

| 在范围内 | 不在范围内（留 Part 2/3） |
|---|---|
| Vue 3 + Vite + Pinia + Router + PrimeVue (unstyled) 工程化脚手架 | 真后端 API / 真 WebSocket |
| 全局快捕 Dialog（Ctrl+K 唤起），任何页面可用 | 链接自动抹标题（第三方 API 或后端代理） |
| Kanban 四态发现页：未处理 / 验证中 / 完成 / 舍弃 | 旧 PLAN.md 中"文章列表 + 精选 + 深读推荐 + 热门"等外部文章推荐功能（已废弃） |
| 灵感条目完整字段：内容、链接、时间、状态、标签、来源、复盘笔记 | v2-2 泡泡鼠标跟随（独立动画系统） |
| 收件箱操作：搜索、标签过滤、排序（时间/来源）、批量选中、批量完成/舍弃、卡片拖动跨列 | v2-5 MBTI 入口重构到发现页（已废弃，因发现页重定位） |
| 16 MBTI 类型配置系统（ENFP 完整，其余 15 留占位但有 accent/描述） | v2-1 右侧空白（Vue 版重新布局后自然解决，不单列任务） |
| 双页面路由（`/` 工作台、`/inbox` 收件箱），Topbar Tab 切换 | 链接标题/封面抓取 |
| 工作台所有模块迁移：Energy、Journal、Threads、DesignFlow、QuadrantTodo、FlashNotes、SyncStatus、DailySpark、Mascot | 导出 JSON/CSV |
| v2 改进顺带融入：v2-3 字体、v2-4 灵感加宽、v2-6 四象限折叠+径向渐变、v2-7 tooltip 延迟隐藏 | 条目与 threads/todos 跨模块联动 |
| 新 `fs1_` 前缀 localStorage，放弃旧 `fp3_` 数据 | 定时提醒、多设备同步 |
| 默认 seed 数据从 `src/mocks/seed.json` 首次启动注入 | 正反馈系统的 8 个扩展机制（见 3.5.5 backlog） |
| 正反馈 6 机制：粒子爆炸、卡片 pulse、数字跳变、checkmark 手绘、Mascot 情绪、每日赞美 | 音效（C3）、reducedMotion 开关 UI（留接口不做界面） |

### 1.3 架构一览

```
┌────────────────────────────────────────────────┐
│  TopBar  [ENFP▼]  [工作台 | 收件箱]        16:42│
├────────────────────────────────────────────────┤
│ DashboardView (/)                              │
│ ┌──────────────────────┬─────────────────────┐ │
│ │ EnergyPanel          │ QuadrantTodo        │ │
│ │ JournalPanel         │ (v2-6 可折叠)       │ │
│ │ ThreadsPanel         │ FlashNotes          │ │
│ │ (v2-3 新字体)        │ SyncStatus          │ │
│ │ DesignFlowPanel      │ DailySpark (v2-4)   │ │
│ └──────────────────────┴─────────────────────┘ │
│                                                │
│ InboxView (/inbox)                             │
│ ┌─────────────────────────────────────────────┐│
│ │ 收件箱   [搜索] [标签▾] [+ 新灵感]          ││
│ │ 批量: [全选] [批量完成] [批量舍弃]            ││
│ │ ┌─────┬─────┬─────┬─────┐                   ││
│ │ │未处理│验证中│完成 │舍弃 │                   ││
│ │ └─────┴─────┴─────┴─────┘                   ││
│ └─────────────────────────────────────────────┘│
│                                                │
│ 全局叠层：                                       │
│  - #burst-layer（粒子）                          │
│  - Toast 容器                                   │
│  - QuickCaptureDialog（Ctrl+K 唤起）             │
└────────────────────────────────────────────────┘

 数据流：
  Component ↔ Pinia Store ↔ storage.js ↔ localStorage(fs1_*)
                              ↑
                首次启动读 mocks/seed.json 注入

 主题流：
  useMbti.setType('INTJ')
    → document.documentElement.dataset.mbti = 'INTJ'
    → [data-mbti="INTJ"] { --accent: #9b6dff; }
    → PrimeVue 组件（unstyled）通过 PassThrough 的 class 响应
```

### 1.4 技术栈

| 依赖 | 版本 | 用途 |
|---|---|---|
| vue | ^3.4 | 框架 |
| vue-router | ^4 | 路由 |
| pinia | ^2 | 状态管理 |
| primevue | ^4.5 | Headless 组件（unstyled 模式） |
| vite | ^5 | 构建 |

CDN 保留：Google Fonts (Outfit)、Font Awesome 6.5。

---

## 2. 灵感收件箱：数据模型与交互

### 2.1 数据模型

```typescript
interface InboxItem {
  id: string              // uuid v4
  content: string         // 必填，纯文本，支持换行
  url?: string            // 从 content auto-detect 的第一个 http(s) URL，或手动编辑
  status: 'pending' | 'verifying' | 'done' | 'archived'
  createdAt: number
  updatedAt: number
  tags: string[]          // 用户自定义，[]为默认
  source?: string         // 来源标签：'douyin' | 'zhihu' | 'xhs' | 'wechat' | 'other' | undefined
  review?: string         // 复盘笔记，转 done/archived 时可补写
}

interface InboxState {
  items: InboxItem[]      // 持久化
  // UI 状态（不持久化）
  search: string
  filterTags: string[]
  sortBy: 'createdAt' | 'updatedAt' | 'source'
  sortOrder: 'asc' | 'desc'
  selectedIds: Set<string>
}
```

**持久化**：`items` 数组写入 `localStorage` key = `fs1_inbox_items`（整体序列化）。其余 UI 状态不持久化。

### 2.2 快捕 Dialog

**触发**：
- **Ctrl+K (Win/Linux) 或 Cmd+K (Mac)**，全局监听
- 工作台 FlashNotes 旁小按钮「新灵感 ⌘K」
- 发现页顶部「+ 新灵感」按钮

**UI**（PrimeVue `Dialog` modal）：

```
┌─────────────────────────────────────────────┐
│  💡 新灵感                              Esc ⌫│
├─────────────────────────────────────────────┤
│  [ textarea autofocus, 4 行,                 │
│    placeholder: "粘贴链接或记下想法…" ]       │
│                                             │
│  (若 textarea 里 detect 到 URL)              │
│  🔗 已识别链接: https://…                    │
│                                             │
├─────────────────────────────────────────────┤
│  Enter 保存 · Esc 取消 · Shift+Enter 换行    │
└─────────────────────────────────────────────┘
```

**行为**：
- Dialog 打开时 textarea autofocus
- Enter（未按 Shift）保存并关闭；非空内容才允许保存
- Shift+Enter 换行
- Esc 取消
- 保存逻辑：正则 `/(https?:\/\/\S+)/` 抽第一个 URL 为 `url`（不做 HEAD 请求，不抹标题），`status: 'pending'`，tags/source/review 空
- 保存后关闭 Dialog，右下角 toast "已入箱 · 去看看"，点 toast 跳 `/inbox`
- 若当前已在 `/inbox`，新卡片直接在"未处理"列顶部出现

### 2.3 Kanban 看板

**布局**（`/inbox`）：

```
┌─────────────────────────────────────────────────┐
│ 灵感收件箱          [搜索…] [标签▾] [+ 新灵感]   │
│ 批量: [全选] [批量完成] [批量舍弃]  共 24，已选 0  │
├─────────────────────────────────────────────────┤
│ ┌──────┬──────┬──────┬──────┐                   │
│ │未处理 │验证中 │ 完成 │ 舍弃 │                   │
│ │  12  │   3  │   8  │   1  │                   │
│ ├──────┼──────┼──────┼──────┤                   │
│ │ Card │ Card │ Card │ Card │                   │
│ │ Card │ Card │ Card │      │                   │
│ │ ...  │      │ ...  │      │                   │
│ └──────┴──────┴──────┴──────┘                   │
└─────────────────────────────────────────────────┘
```

**卡片折叠态**：
```
┌────────────────────────────┐
│ ☑ 💭 我要试试这个想法…       │
│   🔗 douyin.com/v/12345    │
│   2d ago · #副业 · 抖音      │
└────────────────────────────┘
```

- 左上复选框（批量选中）
- 内容前 2 行截断
- URL 图标 + 域名（点击新窗口打开）
- 底部：相对时间 + 标签 + 来源

**卡片展开**：
- 点击弹出 PrimeVue `Dialog`
- 显示完整 content、URL、可编辑字段：tags、source、review
- 状态切换按钮（4 选一）
- 删除按钮（走 ConfirmDialog）

**拖拽**：HTML5 原生 draggable + dragstart/dragover/drop，不引第三方库。

### 2.4 搜索 / 过滤 / 排序

- **搜索**：`content + url + tags + source + review` 拼字符串子串匹配（lowercase），~500ms debounce
- **标签过滤**：多选，OR 逻辑
- **排序**：下拉，默认 `createdAt 倒序` / 可选 `updatedAt 倒序` / `source 字母序`
- 三者独立组合，纯前端内存操作

### 2.5 批量操作

工具栏"全选"勾选当前可见（通过过滤/搜索后的）全部条目。批量操作按钮：

- **「批量完成」**：选中项 status 统一置 `done`
- **「批量舍弃」**：选中项 status 统一置 `archived`

**状态语义再强调**：四个 status 值互斥，Kanban 第 3 列显示 `done`，第 4 列显示 `archived`。不做合并。"done = 验证后的成功"与"archived = 决定不再跟进"是用户产品认知上的互斥分类。

---

## 3. MBTI 16 类型配置系统

### 3.1 配置文件

位置：`src/config/mbti.js`

```javascript
export const MBTI_GROUPS = {
  analysts: { label: '分析家', color: '#9b6dff' },
  diplomats: { label: '外交家', color: '#3ecfcf' },
  sentinels: { label: '守护者', color: '#4ade80' },
  explorers: { label: '探险家', color: '#f5a623' },
}

export const MBTI_TYPES = {
  ENFP: {
    code: 'ENFP', name: '竞选者', group: 'diplomats', accent: '#f0537a',
    description: '富有想象力的探索者',
    traits: ['E','N','F','P'],
    avatar: '/avatars/enfp.png',
    greeting: { morning: '早上好 ☀️', afternoon: '下午好 🌤️', evening: '晚上好 🌙' },
    particles: ['🥚','🌈','⭐','✨','💥','🎯','🔥','💫','🎉','🌟'],
  },
  INTJ: { code:'INTJ', name:'建筑师',   group:'analysts',  description:'战略性的思考者' },
  INTP: { code:'INTP', name:'逻辑学家', group:'analysts',  description:'创新的发明家' },
  ENTJ: { code:'ENTJ', name:'指挥官',   group:'analysts',  description:'大胆的领导者' },
  ENTP: { code:'ENTP', name:'辩论家',   group:'analysts',  description:'机智的思考者' },
  INFJ: { code:'INFJ', name:'提倡者',   group:'diplomats', description:'安静的理想主义者' },
  INFP: { code:'INFP', name:'调停者',   group:'diplomats', description:'诗意的理想主义者' },
  ENFJ: { code:'ENFJ', name:'主人公',   group:'diplomats', description:'富有魅力的领导者' },
  ISTJ: { code:'ISTJ', name:'物流师',   group:'sentinels', description:'可靠的实干家' },
  ISFJ: { code:'ISFJ', name:'守卫者',   group:'sentinels', description:'温暖的守护者' },
  ESTJ: { code:'ESTJ', name:'总经理',   group:'sentinels', description:'高效的管理者' },
  ESFJ: { code:'ESFJ', name:'执政官',   group:'sentinels', description:'关怀的协调者' },
  ISTP: { code:'ISTP', name:'鉴赏家',   group:'explorers', description:'大胆的实验家' },
  ISFP: { code:'ISFP', name:'探险家',   group:'explorers', description:'灵活的艺术家' },
  ESTP: { code:'ESTP', name:'企业家',   group:'explorers', description:'精力充沛的行动派' },
  ESFP: { code:'ESFP', name:'表演者',   group:'explorers', description:'自发的享乐主义者' },
}

export const DEFAULT_TYPE = 'ENFP'
const DEFAULT_GREETING = { morning:'早上好', afternoon:'下午好', evening:'晚上好' }
const DEFAULT_PARTICLES = ['✨','⭐','💫','🌟']

export function resolveType(code) {
  const t = MBTI_TYPES[code] || MBTI_TYPES[DEFAULT_TYPE]
  const group = MBTI_GROUPS[t.group]
  return {
    ...t,
    accent: t.accent ?? group.color,
    traits: t.traits ?? code.split(''),
    avatar: t.avatar ?? null,
    greeting: t.greeting ?? DEFAULT_GREETING,
    particles: t.particles ?? DEFAULT_PARTICLES,
    groupMeta: group,
  }
}
```

### 3.2 主题注入

`src/stores/useMbti.js`：

```javascript
export const useMbti = defineStore('mbti', {
  state: () => ({
    code: localStorage.getItem('fs1_mbti') || DEFAULT_TYPE,
  }),
  getters: {
    current: (s) => resolveType(s.code),
  },
  actions: {
    setType(code) {
      this.code = code
      localStorage.setItem('fs1_mbti', code)
      applyTheme(resolveType(code))
    },
    init() { applyTheme(resolveType(this.code)) },
  },
})

function applyTheme(type) {
  const root = document.documentElement
  root.dataset.mbti = type.code
  root.style.setProperty('--accent', type.accent)
  root.style.setProperty('--group-color', type.groupMeta.color)
}
```

CSS 端：
```css
:root { --accent: #f0537a; --group-color: #3ecfcf; }
```

### 3.3 头像 fallback

`AvatarBlock.vue`：

```vue
<template>
  <img v-if="type.avatar" :src="type.avatar" class="avatar" alt="" />
  <div v-else class="avatar avatar-fallback"
       :style="{ background: type.accent }">
    {{ type.code }}
  </div>
</template>
```

ENFP 显示 `/avatars/enfp.png`，其他 15 类型显示 accent 色方块 + 类型字母。

### 3.4 MBTI 切换器 UI

`MbtiSwitcher.vue` 使用 PrimeVue `Select` + `option-group`，按 4 大 group 分组显示。选中项前 ✓，每项左侧小色块用 `group.color`。

---

## 3.5 正反馈系统

### 3.5.1 6 机制清单

| 层级 | 机制 | 触发场景 |
|---|---|---|
| 视觉微反馈 | A1 粒子爆炸 | 所有完成类动作 |
| 视觉微反馈 | A2 卡片 pulse | 同上，作为陪衬 |
| 数据反馈 | A3 数字跳变 | 进度百分比、计数变化 |
| 视觉微反馈 | A4 checkmark 手绘 | 勾选类完成 |
| 叙事反馈 | C1 Mascot 情绪 | 工作台头像，根据 energy + 今日完成数 |
| 叙事反馈 | C2 每日赞美 | Inbox 完成条目时 30% 概率弹 toast |

### 3.5.2 统一 composable

`src/composables/useReward.js`：

```javascript
import { useMbti } from '@/stores/useMbti'

export function useReward() {
  const mbti = useMbti()

  function celebrate(origin /* {x,y} */, options = {}) {
    const {
      burstCount = 10,
      pulseEl = null,
      checkEl = null,
      praise = false,
    } = options
    fireBurst(origin, burstCount, mbti.current.particles)
    if (pulseEl) firePulse(pulseEl)
    if (checkEl) fireCheckmark(checkEl)
    if (praise && Math.random() < 0.3) firePraise()
  }

  function countUp(el, from, to, duration = 600) { /* rAF 缓动 */ }

  return { celebrate, countUp }
}
```

全局在 `App.vue` 挂 `<div id="burst-layer" />`，`position: fixed; inset: 0; pointer-events: none;`。

### 3.5.3 子机制实现要点

| 机制 | 实现 |
|---|---|
| A1 粒子 | MBTI particles 数组取样，CSS keyframe 飞出 + 渐隐，1000–1400ms 生命周期 |
| A2 pulse | 目标元素加 `.is-celebrating`，CSS transition `box-shadow: 0 0 0 var(--accent)` 扩散 800ms |
| A3 数字跳变 | `requestAnimationFrame` + 600ms ease-out 插值，写 `el.textContent` |
| A4 checkmark | SVG `<path stroke-dasharray=20 stroke-dashoffset=20>`，class 切换触发 400ms 动画 |
| C1 Mascot | ENFP 头像 watch `energy + todayDone` 切 class：`msc-bounce`（高能量）/ `msc-vibe`（中）/ `msc-wobble`（低）/ `msc-celebrate`（刚 celebrate 后 2s 内）。非 ENFP 降级为 accent 色方块的微动画 |
| C2 赞美 | 内置 30 句 ENFP 风格肯定（`src/config/praises.js`），30% 概率 toast 2s |

### 3.5.4 触发点映射

| 行为 | celebrate 参数 |
|---|---|
| Inbox 卡片任意状态跳转 | `burstCount: 12, pulseEl: card` |
| Inbox 卡片 → 完成列 | `burstCount: 15, pulseEl: card, checkEl: status-icon, praise: true` |
| Inbox 卡片 → 舍弃列 | `burstCount: 6`（低调） |
| Thread 子步骤勾选 | `burstCount: 8, pulseEl: step, checkEl: step-check` |
| Thread 100% 完成 | `burstCount: 20, pulseEl: thread-card, praise: true` |
| QuadrantTodo dot ✓ | `burstCount: 8, checkEl: dot` |
| DesignFlow 阶段推进 | `burstCount: 10, pulseEl: stage-node` |
| 计数/进度数字变化 | 单独调 `countUp(el, from, to)` |
| Mood/Energy 变化 | 刷新 Mascot class（不走 celebrate） |

### 3.5.5 性能约束

- 单次 burst 最多 20 粒子
- 同时最多 60 DOM 节点，超过强制清理最老 burst
- 纯 CSS keyframe 动画，不用 rAF
- `fs1_prefs.reducedMotion` key 预留（Part 2 做 UI），true 时机制全部降级为即时无动画

### 3.5.6 Part 2/3 backlog（不在本 Part 实施）

A5 爆裂消失 · B1 进度涟漪 · B2 连胜徽章 · B3 环形计数盘 · B4 解锁弹窗 · C3 完成音效 · C4 色彩情绪 · D1 每日回顾 · D3 转化统计

---

## 4. 工程结构

### 4.1 目录结构

```
flowspace-enfp/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   ├── favicon.svg
│   └── avatars/enfp.png
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router.js
│   ├── styles/
│   │   ├── base.css         reset + 字体 + 工具 class
│   │   └── tokens.css       :root + [data-mbti=...]
│   ├── config/
│   │   ├── mbti.js
│   │   └── praises.js
│   ├── stores/
│   │   ├── useMbti.js
│   │   ├── useWorkspace.js  合并 energy/journal/threads/projects/todos/notes/sync/streak
│   │   └── useInbox.js
│   ├── services/
│   │   └── storage.js       localStorage fs1_* 封装
│   ├── composables/
│   │   ├── useReward.js     celebrate() + countUp()
│   │   ├── useHotkey.js     Ctrl+K 绑定
│   │   └── useDraggable.js  Kanban 拖拽封装
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopBar.vue
│   │   │   └── RightSidebar.vue
│   │   ├── mbti/
│   │   │   ├── MbtiSwitcher.vue
│   │   │   └── AvatarBlock.vue
│   │   ├── workspace/
│   │   │   ├── EnergyPanel.vue
│   │   │   ├── JournalPanel.vue
│   │   │   ├── ThreadsPanel.vue       (v2-3 字体)
│   │   │   ├── DesignFlowPanel.vue
│   │   │   ├── QuadrantTodo.vue       (v2-6 折叠 + v2-7 tooltip)
│   │   │   ├── FlashNotes.vue
│   │   │   ├── SyncStatus.vue
│   │   │   ├── DailySpark.vue         (v2-4 加宽)
│   │   │   └── MascotAvatar.vue       (C1)
│   │   ├── inbox/
│   │   │   ├── InboxBoard.vue         Kanban 主体 + 工具栏
│   │   │   ├── InboxColumn.vue
│   │   │   ├── InboxCard.vue
│   │   │   ├── InboxEditDialog.vue
│   │   │   └── QuickCaptureDialog.vue
│   │   └── common/
│   │       ├── BurstLayer.vue
│   │       ├── PraiseToast.vue
│   │       ├── CountUp.vue
│   │       └── CheckmarkSvg.vue
│   ├── views/
│   │   ├── DashboardView.vue
│   │   └── InboxView.vue
│   └── mocks/
│       └── seed.json
```

组件统计：layout 2 + mbti 2 + workspace 9 + inbox 5 + common 4 + views 2 = **24 个 .vue 文件**

### 4.2 Pinia Store 职责

| Store | 管辖 | localStorage key |
|---|---|---|
| useMbti | 当前 MBTI code | `fs1_mbti` |
| useWorkspace | energy / journal / threads / projects / todos / notes / sync / streak | `fs1_workspace`（单 key 整体序列化） |
| useInbox | items + UI 状态（UI 不持久化） | `fs1_inbox_items`（只持久化 items） |

### 4.3 关键数据流

**启动流**：
```
main.js
  → createPinia()
  → useMbti.init() (读 fs1_mbti, applyTheme)
  → useWorkspace.hydrate() (读 fs1_workspace；若无读 seed.json 注入)
  → useInbox.hydrate() (读 fs1_inbox_items；若无空数组)
  → mount App
```

**快捕流**：
```
Ctrl+K → useHotkey 切换 QuickCaptureDialog.open
  → 用户输入 + Enter
  → useInbox.addItem({ content, url })
    - auto-detect URL
    - 写 fs1_inbox_items
  → 关闭 Dialog + toast "已入箱"
```

**Inbox 状态跳转流**：
```
拖拽/状态按钮
  → useInbox.updateStatus(id, newStatus)
  → 持久化
  → useReward.celebrate(origin, {...})
  → 重新渲染列
```

**MBTI 切换流**：
```
MbtiSwitcher 选新类型
  → useMbti.setType(code)
  → [data-mbti=code] CSS 变量生效
  → MascotAvatar watch 切 src/fallback
  → 下次 celebrate 时粒子数组已切换
```

### 4.4 PrimeVue 组件清单

| 用途 | PrimeVue 组件 | 位置 |
|---|---|---|
| 快捕 Dialog | `Dialog` (modal, closable) | QuickCaptureDialog.vue |
| Inbox 卡片编辑 | `Dialog` | InboxEditDialog.vue |
| 四象限 dot tooltip | `v-tooltip` directive（如需带箭头用 `Popover`） | QuadrantTodo.vue |
| MBTI 切换 | `Select` (option-group) | MbtiSwitcher.vue |
| 页面 Tab | `Tabs` + `TabList` + `Tab` | TopBar.vue |
| Energy 三滑块 | `Slider` | EnergyPanel.vue |
| 赞美 / 入箱提示 | `Toast` + `useToast()` | App.vue + PraiseToast.vue |
| 删除确认 | `ConfirmDialog` + `useConfirm()` | App.vue 全局挂一个 |

**main.js 配置**：
```javascript
import PrimeVue from 'primevue/config'
app.use(PrimeVue, { unstyled: true })
```

全局不注入任何 PrimeVue 预设 CSS。所有视觉 = 自己写的 CSS + PassThrough className。

### 4.5 样式分层

```
styles/base.css    跨组件的 reset + 工具 class (.text-t1, .flex-row 等)
styles/tokens.css  :root 变量 + [data-mbti=XXX] 覆盖块
component .vue     <style scoped>，color 用 var(--accent)
```

### 4.6 反 AI slop 约束（从 PLAN.md 继承）

- 不用紫色渐变堆砌
- 不用 Material 圆角卡片 + 左 border accent
- 不用 emoji 当按钮图标（Font Awesome + Remix Icon；**emoji 仅用于粒子和赞美 toast**）
- 不用 SVG 画人
- 文案用「」（中文排印规范）

---

## 5. 实施计划

### 5.1 Phase 划分（8 个，共 ~13.5 天）

| # | Phase | 交付 | 验证 | 估时 |
|---|---|---|---|---|
| P1 | 脚手架 | Vite+Vue3+Pinia+Router+PrimeVue(unstyled) 空项目 | `npm run dev` 无报错 | 0.5d |
| P2 | 样式 + MBTI 配置 | base.css + tokens.css + config/mbti.js + useMbti + AvatarBlock | 切换 dataset.mbti devtools 能看 --accent 变化 | 1d |
| P3 | 布局 + 双页路由 | App.vue + TopBar + 两个空 View + router | 点 Tab 切 URL，前进/后退有效 | 1d |
| P4 | 工作台迁移 | 9 个 workspace 组件 + useWorkspace + seed.json | 工作台视觉 ≈ dashboard.html；v2-3/4/6/7 内置 | 4d |
| P5 | 收件箱核心 | useInbox + InboxBoard/Column/Card + 拖拽 + 搜索/过滤/排序 | 可拖、可搜、可批量 | 3d |
| P6 | 快捕 Dialog + 热键 | QuickCaptureDialog + useHotkey + URL detect + toast | 任意页 Ctrl+K → Enter 入箱 | 1d |
| P7 | 卡片编辑 + 状态流转 | InboxEditDialog + 状态按钮 + 复盘/标签/来源编辑 | 点卡片改所有字段，状态切换保存 | 1d |
| P8 | 正反馈系统 | useReward + BurstLayer + CountUp + Checkmark + Praise + Mascot | 所有触发点粒子+pulse+check；Mascot 切表情 | 2d |

### 5.2 依赖图

```
P1
 └→ P2
    ├→ P3
    │   ├→ P4 (可与 P5 并行)
    │   └→ P5
    │      ├→ P6
    │      └→ P7
    └→ P8 (必须在 P4+P5 后)
```

### 5.3 验证策略

每个 Phase 的肉眼可见验证标准：

- **P1**：`npm run dev` 成功 + 页面标题 "FlowSpace ENFP" + 无控制台 error/warn
- **P2**：devtools 看 `<html data-mbti="ENFP">`；切换 store 后 `--accent` 实时变化
- **P3**：点 TopBar Tab → URL 切换 `/` ↔ `/inbox`；浏览器前进/后退有效
- **P4**：跟 dashboard.html 浏览器并排对比，工作台 8 个模块视觉一致且功能等价。v2 回归：
  - v2-3：Thread 标题 14px/800，描述 font-weight 500 色 `--t2`
  - v2-4：DailySpark 左右比 dashboard.html 宽 ≥20px，padding 18/28
  - v2-6：折叠按钮切 `.collapsed` class；`.q-tint` 是径向渐变
  - v2-7：鼠标从 dot 移到 tooltip 不消失
- **P5**：创建 3 条不同状态 inbox → 拖到另一列 → 刷新数据保留；搜索关键词正确过滤；批量选中 2 条"舍弃"→ 全部进 archived 列
- **P6**：任意页 Ctrl+K → Dialog autofocus → 粘 URL 文本 → Enter → Dialog 关闭 → toast 显示 → `/inbox` 未处理列新卡片
- **P7**：点开卡片改 tags/source/review → 状态切"完成" → 关闭 → 数据更新；删除走 ConfirmDialog
- **P8**：每个触发点肉眼验证粒子 + pulse + checkmark + 数字跳变；Inbox 完成偶发赞美 toast；Mascot 切 class

### 5.4 写 plan 时的任务粒度

按 `writing-plans` skill 要求 2–5 分钟粒度，预估 **60–80 个实现任务**。

### 5.5 风险登记册

| 风险 | 影响 | 应对 |
|---|---|---|
| PrimeVue PassThrough 在复杂组件（如 Select option-group）行为偏差 | 少数组件样式错位 | 出现时用自定义组件替代该场景 |
| HTML5 原生拖拽不支持移动端 | Kanban 手机拖不动 | Part 1 限桌面；Part 2 加 touch events |
| 粒子 DOM 泄漏 | 内存上涨 | 60 个节点上限，超出清理最老 |
| localStorage 单 key 过大（Inbox ≥1000 条近 5MB） | 写入失败 | Part 1 容忍；Part 2 上 IndexedDB |
| 从 dashboard.html 迁移时边界行为漏（如 egg burst 的 seeded random） | 视觉微差 | P4 末做并排浏览器回归；允许微小差异 |
| Ctrl+K 与浏览器自带冲突（Chrome 地址栏搜索） | 焦点在地址栏无反应 | event.preventDefault()；焦点在页面内则生效（可接受） |
| 非 ENFP 类型头像缺失 | Mascot 情绪反馈弱 | AvatarBlock fallback 方块加 CSS 动画（bounce/wobble 仍生效） |

### 5.6 退出门（Definition of Done）

Part 1 完成的硬标准：
- [ ] 8 个 Phase 全部完成
- [ ] `npm run build` 通过，输出可部署 dist/
- [ ] 无控制台 error / warning
- [ ] 5.3 节所有验证点肉眼通过
- [ ] `localStorage.fs1_*` 键和结构与本 spec 一致
- [ ] MBTI 16 类型都能切换，ENFP 完整，15 fallback 正确
- [ ] Ctrl+K 热键在两个页面都生效
- [ ] 拖拽跨列在 Chrome/Firefox/Edge 一致

### 5.7 超出范围事项（Part 2/3 backlog）

**Part 2 候选**：
- v2-1 布局定案 / v2-2 泡泡鼠标跟随 / v2-5 MBTI 入口整合
- 真 WebSocket 服务层
- Inbox 链接元信息抓取（标题 + 封面）
- reducedMotion 开关 UI
- Mascot 情绪精细化（15 类型资源）
- 正反馈扩展 8 机制（A5/B1-4/C3-4/D1/D3）
- 导出 JSON / CSV
- 移动端适配

**Part 3 候选**：
- 文章/阅读模块真实数据（如仍需外部推荐）
- 多设备同步 + 账号系统
- 导出到 Obsidian / Notion

---

## 附录 A：关键决策记录

| 决策 | 取舍理由 |
|---|---|
| 用 PrimeVue unstyled 而非 Reka UI | 你明确选择；PrimeVue 自带 Toast/Confirm composable 省搭建成本；代价是 bundle 大一倍（35-50KB vs 15-25KB），���接受 |
| 发现页 = 灵感收件箱（非文章推荐） | 你澄清的核心场景是"刷到想法快速记下清空脑袋"，原 PLAN.md 的"文章列表推荐"偏向内容消费，方向错位已废弃 |
| 四态 Kanban 而非 Trello 式自定义列 | 你选四态语义互斥；比自定义列简单且强制用户做出"完成 vs 舍弃"的价值判断 |
| 快捕字段简化至"内容 + 链接" | 你强调"快速录入不被打断"；标签/来源/复盘留到事后编辑 |
| 16 MBTI ENFP 完整其他留占位 | 资源约束（其他 15 头像未准备）；fallback 方块策略保留视觉一致性 |
| 新 fs1_ 前缀放弃旧 fp3_ 数据 | 你选择；旧数据 schema 不匹配新结构，保留成本 > 价值 |
| 6 反馈机制而非 13 | 你选全要（除音效）；但 25-30 天超单 spec 合理窗口，收缩到 6 个高性价比最零侵入的 |
| 发现页路由 /inbox 而非 /discover | 命名反映新定位（收件箱）而非旧定位（发现） |

## 附录 B：Phase P4 工作台模块迁移明细

每个工作台模块的迁移要点：

| 组件 | 新增/变化（相对 dashboard.html） |
|---|---|
| EnergyPanel | 用 PrimeVue `Slider` 替代原生 input range；状态存 useWorkspace.energy |
| JournalPanel | textarea + 自动保存 debounce；状态存 useWorkspace.journal |
| ThreadsPanel | v2-3 字体：title 14/800、desc 11/500/`--t2`；步骤勾选接 useReward.celebrate；进度跳 countUp |
| DesignFlowPanel | 阶段切换接 useReward.celebrate |
| QuadrantTodo | v2-6 整体包 `.todo-section-body` 可折叠；`.q-tint` 改径向渐变；v2-7 tooltip 监听 mouseenter/leave + 300ms setTimeout 延迟隐藏 |
| FlashNotes | 简单 textarea + Ctrl+Enter 保存 |
| SyncStatus | 复用原 mock 数据，UI 等价 |
| DailySpark | v2-4：`grid-column: 1 / -1` 跨两列 + padding 18/28；typewriter 动画保留，onBeforeUnmount 清 interval（已在旧代码修复） |
| MascotAvatar | useMbti.current.avatar 或 AvatarBlock fallback；watch useWorkspace 算出 mood 切 class |
