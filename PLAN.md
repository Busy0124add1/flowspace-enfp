# FlowSpace MBTI 工作站 · 设计计划

> 目标：在现有 ENFP Dashboard 基础上，整合文章/内容模块，构建双页面 MBTI 个人工作站。
> 参考原型：`8966393.htm`（FlowSpace ENFP Dashboard）+ 截图2（深读文章详情）+ 截图3（文章列表）

---

## 1. 设计系统（继承 + 扩展）

### 1.1 色彩（ENFP 默认）

继承现有变量，新增文章模块专用色：

| 变量 | 值 | 用途 |
|------|-----|------|
| `--bg` | `#0c0d10` | 页面底色 |
| `--surf` | `#13141a` | 次级表面 |
| `--card` | `#191b23` | 卡片背景 |
| `--line` | `#252730` | 边框/分割线 |
| `--t1` | `#eeeef2` | 主文字 |
| `--t2` | `#8a8b99` | 次文字 |
| `--t3` | `#4a4b58` | 弱文字 |
| `--pink` | `#f0537a` | ENFP 主 accent |
| `--cyan` | `#3ecfcf` | 辅助色 |
| `--lime` | `#9de84b` | 辅助色 |
| `--violet` | `#9b6dff` | 辅助色 |
| `--amber` | `#f5a623` | 辅助色 |
| `--article-cover-overlay` | `rgba(0,0,0,0.45)` | 文章封面遮罩 |
| `--article-tag-bg` | `rgba(240,83,122,0.12)` | 文章标签背景 |

### 1.2 MBTI 16 类型配色映射

| 类型组 | 成员 | Accent 色 | 文章卡片渐变 |
|--------|------|-----------|-------------|
| 分析家 Analysts | INTJ/INTP/ENTJ/ENTP | `#9b6dff` 紫 | 紫 -> 深紫 |
| 外交家 Diplomats | INFJ/INFP/ENFJ/ENFP | `#3ecfcf` 青（ENFP 用 `#f0537a` 粉） | 青 -> 深青 |
| 守卫者 Sentinels | ISTJ/ISFJ/ESTJ/ESFJ | `#4ade80` 绿 | 绿 -> 深绿 |
| 探险家 Explorers | ISTP/ISFP/ESTP/ESFP | `#f5a623` 琥珀 | 琥珀 -> 深琥珀 |

切换类型时，`--accent` 变量联动更新，所有文章卡片的 accent 色跟随变化。

### 1.3 字体

- Display: Outfit（已有）
- Body: Outfit（已有）
- 中文正文: system-ui fallback（已有）

### 1.4 图标

- Font Awesome 6.5（已有）
- Remix Icon（新增，用于文章模块的社交/阅读图标）

---

## 2. 页面结构

### 2.1 全局布局

```
+---------------------------------------------------+
|  Topbar (品牌 + MBTI 切换 + 导航 Tab + 时钟等)     |
+---------------------------------------------------+
|  Main Content Area                                |
|  +-----------------------------+----------------+ |
|  |  Left Panel (scrollable)    | Right Sidebar  | |
|  |  - Dashboard 模块           | - 待办清单     | |
|  |  - 文章模块                 | - 同步状态     | |
|  |  或                        | - 快捷笔记     | |
|  |  - 文章列表页               | - 热门排行     | |
|  +-----------------------------+----------------+ |
+---------------------------------------------------+
```

Topbar 新增导航 Tab：
- 「工作台」-> Dashboard 页
- 「发现」-> 文章列表页

两个页面通过 JS 切换显示，不跳转（SPA 风格）。

### 2.2 页面 1：Dashboard（增强版）

在现有模块基础上，Left Panel 尾部新增两个文章模块：

```
Left Panel:
  +-- 今日状态（Energy/Journal）     <- 保留
  +-- 并行任务线（Threads）          <- 保留
  +-- 设计流程（Design Flow）        <- 保留
  +-- -- 新增 --                    |
  +-- 精选文章                       | 3-4 张小卡片横排
  |   +-- [封面] 标题 . 标签         | 封面图 + 标题 + 分类标签
  |   +-- [封面] 标题 . 标签         | 点击可展开详情
  |   +-- [封面] 标题 . 标签         |
  +-- -- 新增 --                    |
  +-- 深读推荐                       | 1 张大卡片
      +-- [暗色头图]                 | 参考截图2
          TECHNOLOGY . BUSINESS      |
          洞见标题                    |

Right Sidebar:
  +-- 待办清单                       <- 保留
  +-- 同步状态                       <- 保留
  +-- 快捷笔记（Flash Notes）        <- 保留
  +-- 每日灵感（Daily Spark）        <- 保留
  +-- -- 新增 --
      +-- 热门排行                   | 5 条热门文章标题
          +-- 1. 文章标题
          +-- 2. 文章标题
          +-- ...
```

### 2.3 页面 2：文章/资源列表页（新增）

```
Left Panel:
  +-- 分类标签导航（水平滚动）
  |   +-- 全部 . MBTI . 职场 . 创意 . 人际 . 成长
  |   +-- 当前高亮分类
  +-- 文章卡片网格（2 列）
  |   +-- +----------+ +----------+
  |   |   | [封面图]  | | [封面图]  |
  |   |   | 标题      | | 标题      |
  |   |   | 摘要...   | | 摘要...   |
  |   |   | 作者 1.2k | | 作者 890  |
  |   |   +----------+ +----------+
  |   +-- ... 更多卡片
  +-- 加载更多

Right Sidebar:
  +-- 热门文章（排行 1-5）
  +-- 标签云
  +-- 本周趋势
```

### 2.4 文章详情（展开模式）

点击文章卡片后，主区域切换为文章详情视图：

```
+---------------------------------------------+
|  <- 返回列表    分类标签                      |
+---------------------------------------------+
|  +-----------------------------------------+|
|  |     暗色渐变头图（参考截图2）              ||
|  |     TECHNOLOGY . BUSINESS . INNOVATION   ||
|  |     文章大标题                            ||
|  |     作者 . 日期 . 阅读量                  ||
|  +-----------------------------------------+|
|                                             |
|  正文内容区域                                |
|  段落文字...                                 |
|  引用块...                                   |
|  段落文字...                                 |
|                                             |
|  -- 相关推荐 --                             |
|  [卡片] [卡片] [卡片]                        |
+---------------------------------------------+
```

---

## 3. 数据结构

### 3.1 文章数据

```javascript
const ARTICLES = [
  {
    id: 1,
    title: 'ENFP 的创意爆发力：如何在工作中发挥你的 Ne 优势',
    excerpt: '作为 MBTI 中最具创造力的类型之一...',
    category: 'growth',
    tags: ['ENFP', '创意', '认知功能'],
    author: '小面',
    date: '2026-04-28',
    views: 1240,
    cover: null, // 用 CSS 渐变 + 类型色模拟封面
    featured: true,
    deepRead: false,
  },
  // ... 更多文章
];
```

### 3.2 分类数据

```javascript
const CATEGORIES = [
  { id: 'all', label: '全部', icon: 'fa-layer-group' },
  { id: 'mbti', label: 'MBTI', icon: 'fa-brain' },
  { id: 'career', label: '职场', icon: 'fa-briefcase' },
  { id: 'creative', label: '创意', icon: 'fa-palette' },
  { id: 'social', label: '人际', icon: 'fa-users' },
  { id: 'growth', label: '成长', icon: 'fa-seedling' },
];
```

---

## 4. 技术方案

### 4.1 架构

- 单文件 HTML（`dashboard.html` 原地扩展）
- 纯 CSS + Vanilla JS，无框架
- Remix Icon CDN 新增引入
- localStorage 持久化（文章阅读状态、分类偏好）

### 4.2 页面切换

```javascript
function showPage(page) {
  // page: 'dashboard' | 'articles' | 'article-detail'
  document.getElementById('page-dashboard').style.display =
    page === 'dashboard' ? '' : 'none';
  document.getElementById('page-articles').style.display =
    page === 'articles' ? '' : 'none';
  document.getElementById('page-article-detail').style.display =
    page === 'article-detail' ? '' : 'none';
  // 更新 topbar tab 高亮
}
```

### 4.3 MBTI 切换联动

现有 MBTI 切换逻辑保留，新增：
- 切换类型时，`--accent` CSS 变量更新
- 文章卡片的 accent 色、封面渐变跟随变化
- 精选/深读推荐内容按类型过滤

---

## 5. 实施步骤

| # | 步骤 | 验证 |
|---|------|------|
| 1 | 扩展 CSS：新增文章卡片、分类导航、文章详情样式 | 样式不与现有冲突 |
| 2 | Topbar 新增「工作台/发现」导航 Tab | Tab 切换正常 |
| 3 | Dashboard 页新增「精选文章」模块（3-4 张小卡片） | 卡片渲染正确 |
| 4 | Dashboard 页新增「深读推荐」模块（1 张大卡片） | 头图 + 标题显示 |
| 5 | Right Sidebar 新增「热门排行」模块 | 排行列表渲染 |
| 6 | 创建「发现」页面（文章列表 + 分类导航 + 卡片网格） | 页面切换 + 卡片显示 |
| 7 | 实现文章详情展开视图 | 点击卡片 -> 详情显示 |
| 8 | MBTI 切换联动文章 accent 色 | 切换类型 -> 色彩变化 |
| 9 | Playwright 截图验证 | 无 console 错误 |

---

## 6. 反 AI slop 检查清单

- [x] 不用紫色渐变（ENFP 用粉色，按类型组分配）
- [x] 不用 emoji 做图标（用 Font Awesome / Remix Icon）
- [x] 不用圆角卡片 + 左 border accent（用封面图 + 底部渐变遮罩）
- [x] 不编造假数据（文章内容基于 MBTI 真实主题）
- [x] 不用 SVG 画人（无头像需求时用文字标签）
- [x] 文案用「」引号（中文排印规范）

---

## 7. 素材需求

| 素材 | 状态 | 处理 |
|------|------|------|
| 文章封面图 | 无真实图片 | 用 CSS 渐变 + 类型色模拟封面（诚实 placeholder） |
| MBTI 类型图标 | 已有 ENFP 图标 URL | 其他 15 类型用首字母缩写 + 类型色圆角方块 |
| 文章内容 | 需要模拟数据 | 基于 MBTI 真实主题撰写 8-10 篇示例文章 |

---
---
---

# FlowSpace ENFP · 迭代计划 v2

> 基于现有 `dashboard.html`（~1860行）的 7 项优化任务
> 参考图片：`微信图片_20260428113154_2485_788.png`（卡片式列表风格）

---

## 任务总览

| # | 任务 | 类型 | 难度 |
|---|------|------|------|
| 1 | 删除最右边空白区域 | 布局 | ★☆☆ |
| 2 | 并行任务线添加跟随鼠标的运动泡泡 | 交互 | ★★★ |
| 3 | 并行任务线字体/粗细参考截图修改 | 样式 | ★★☆ |
| 4 | 今日灵感引导框加宽 | 样式 | ★☆☆ |
| 5 | 设置/MBTI测试移到顶部「发现」导航中 | 布局 | ★★☆ |
| 6 | 四象限待办可隐藏/显示 + 修复紧急框背景 | 交互+样式 | ★★☆ |
| 7 | 修复事件气泡完成按钮消失的 bug | Bug 修复 | ★★☆ |

---

## v2-1. 删除最右边空白区域

**问题**：当前 `.main` 使用 `grid-template-columns: 1fr 360px`，右侧面板固定 360px。当窗口较宽时，右侧可能留有空白。但更可能的问题是右侧面板内的某些模块下方留白，或 `.page-container` 的 `grid-template-columns: 1fr 360px` 导致右侧列未填满。

**方案**：
- 检查 `.page-container.active` 的 `grid-template-columns` 是否正确占满
- 确认 `.right` 的 `background: var(--surf)` 是否延伸到视口底部
- 如果是右侧面板底部空余，给 `.right` 加 `padding-bottom` 减少或加 `flex-grow` 内容推满
- 如果是整体 grid 有多余 margin/padding，检查 `.app` 和 `.main` 的尺寸

**验证**：浏览器全屏观察右侧是否有非预期空白

---

## v2-2. 并行任务线添加运动泡泡（鼠标跟随）

**目标**：在 `.threads-grid` 区域内添加漂浮的半透明泡泡元素，鼠标移入该区域时泡泡跟随鼠标移动，营造活泼的 ENFP 氛围。

**方案**：
- 在 `.threads-grid` 外包一层 `.threads-bubble-zone`（position: relative; overflow: hidden）
- 用 JS 创建 6-8 个泡泡 `<div>`，CSS 圆形 + 半透明 + 模糊背景
- 泡泡初始随机位置，用 `requestAnimationFrame` 做漂浮动画（正弦波缓动）
- 监听 `.threads-bubble-zone` 的 `mousemove`，当鼠标进入时：
  - 最近的 2-3 个泡泡平滑 lerp 到鼠标位置附近（带偏移，不完全贴合鼠标）
  - 其余泡泡继续漂浮但速度减慢
- 鼠标离开后泡泡恢复自由漂浮
- 泡泡颜色取对应任务线的颜色（`threads[].color`），opacity 0.08-0.15
- 泡泡大小 40-80px，border-radius: 50%，backdrop-filter: blur(4px)

**CSS 关键**：
```css
.thread-bubble {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.12;
  filter: blur(2px);
  transition: transform 0.8s cubic-bezier(.25,1,.5,1);
}
```

**JS 关键**：
- `mouseInZone` 标记鼠标是否在区域内
- `lerp(a, b, t)` 线性插值函数
- `requestAnimationFrame` 循环更新泡泡位置
- 鼠标进入时吸引泡泡，离开时泡泡散开

**验证**：鼠标移入任务线区域，泡泡跟随移动；移出后泡泡恢复漂浮

---

## v2-3. 并行任务线字体和粗细调整

**参考图片分析**：
- 标题文字较大、较粗（font-weight: 700-800）
- 副标题/描述文字较细（font-weight: 400-500）
- 整体风格：emoji 图标 + 粗标题 + 细描述，左右排列

**当前状态**：
- `.thread-name`：`font-size: 13px; font-weight: 700`
- `.thread-desc`：`font-size: 11px; color: var(--t3)`
- `.thread-pct-big`：`font-size: 28px; font-weight: 900`

**调整方案**：
- `.thread-name`：增大到 `14px`，`font-weight: 800`，增加 `letter-spacing: -0.2px`
- `.thread-desc`：保持 `11px`，`font-weight: 500`，颜色调整为 `var(--t2)`（比当前 t3 更亮一点）
- `.thread-pct-big`：保持 `28px`，微调 `letter-spacing: -1.5px`
- 步骤文字 `.thread-step`：`font-size: 11.5px`，`font-weight: 500`

**验证**：与参考图片对比字体粗细和层次感

---

## v2-4. 今日灵感引导框加宽

**当前状态**：`.daily-spark-wrap` 在 `.left` 列内，受列宽限制。

**方案**：
- 给 `.daily-spark-wrap` 增加负 margin 撑满（`margin: 0 -4px`）或直接用 `width: calc(100% + 8px)`
- 增加 `padding: 18px 24px`（当前是 `14px 18px`）
- 如果还不够宽，考虑把每日灵感放到 topbar 下方全宽区域（跨两列）
- 文字区域增加 `max-width: none` 确保不限宽

**更优方案**：将「今日灵感引导」从 `.left` 中移出，放到 `.main` 上方作为全宽横幅，这样可以跨左右两列：

```css
.daily-spark-wrap {
  grid-column: 1 / -1; /* 跨越整个 grid */
  margin: 0;
  padding: 18px 28px;
}
```

**验证**：灵感引导框明显宽于之前，文字不换行挤压

---

## v2-5. 设置/MBTI 测试移到顶部「发现」导航中

**当前状态**：
- MBTI 切换按钮在 topbar 左侧（品牌名旁边）
- 「发现」是 page-tab，切换到文章列表页

**方案**：将 MBTI 测试入口整合到「发现」页面中：

**选项 A（推荐）**：在「发现」页面顶部添加 MBTI 测试卡片
- 在 `#page-articles` 的 `.left` 最上方加一个 `.mbti-discover-card`
- 卡片内容：当前 MBTI 类型 + 快速切换 + 「了解你的类型」链接
- 保留 topbar 的 MBTI 按钮作为快捷切换（不变）

**选项 B**：在「发现」页面的右侧 sidebar 添加 MBTI 区块
- 在 `#page-articles` 的 `.right` 最上方加 MBTI 测试入口
- 显示当前类型、类型描述、切换按钮

**选项 C**：在「发现」页面的分类导航中加「MBTI 测试」tab
- 在 `CATEGORIES` 数组中添加 `{ id: 'test', label: 'MBTI 测试', icon: 'fa-brain' }`
- 点击后显示 MBTI 测试/切换界面

**推荐方案 A + C 组合**：
1. 在分类导航中加「MBTI 测试」分类
2. 点击后显示 MBTI 类型介绍 + 16 类型切换网格
3. topbar 的 MBTI 按钮保留作为快捷入口

**验证**：点击「发现」→ 可以看到 MBTI 测试入口 → 点击可切换类型

---

## v2-6. 四象限待办可隐藏/显示 + 修复紧急框背景

### 6a. 可隐藏/显示

**方案**：
- 在 `.s-label` 的「四象限待办」旁添加一个折叠按钮（箭头图标）
- 点击后 `.q-matrix-wrap` 和 `.todo-add-row` 和 `.todo-stats` 收起/展开
- 用 `max-height` + `overflow: hidden` + `transition` 做平滑动画
- 状态存 `localStorage('fp3_todo_collapsed')`

```css
.todo-section-body {
  max-height: 600px;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(.25,1,.5,1);
}
.todo-section-body.collapsed {
  max-height: 0;
}
```

### 6b. 修复紧急框长方体背景

**问题**：「紧急重要」象限（ui quadrant）的 `.q-tint.ui` 可能显示为长方形色块而非预期的柔和渐变。

**当前 CSS**：
```css
.q-tint.ui {
  top: 0; left: 0; width: 50%; height: 50%;
  background: color-mix(in srgb, var(--pink) 5%, transparent);
}
```

**问题分析**：`color-mix(in srgb, var(--pink) 5%, transparent)` 生成的是纯色半透明块，边界硬朗。应该用渐变让边缘柔和过渡。

**修复方案**：
```css
.q-tint.ui {
  top: 0; left: 0; width: 50%; height: 50%;
  background: radial-gradient(
    ellipse at 30% 30%,
    color-mix(in srgb, var(--pink) 8%, transparent),
    transparent 70%
  );
}
```

同理修改 `.q-tint.si` 和 `.q-tint.un`，让三个象限的色块都是柔和的径向渐变，而非硬边长方体。

**验证**：
- 四象限待办区域可折叠/展开，动画平滑
- 紧急框无硬边长方体背景，改为柔和渐变

---

## v2-7. 修复事件气泡完成按钮消失的 bug

**问题**：鼠标移到原点上显示 tooltip，但当鼠标从原点移到 tooltip 上准备点「完成」按钮时，tooltip 消失了。

**根因分析**：

当前代码（行 1132-1133）：
```javascript
dot.addEventListener('mouseenter', () => { tip.style.display='block'; ... });
dot.addEventListener('mouseleave', () => { if(activeDotId!==todo.id){tip.style.display='none'; ...} });
```

`mouseleave` 在鼠标离开 dot 时立即触发，但此时鼠标可能正在往 tooltip 移动。tooltip 是独立的 div，和 dot 之间有间隙，导致：
1. 鼠标离开 dot → `mouseleave` 触发 → tooltip 隐藏
2. 鼠标还没到达 tooltip → tooltip 已经没了

**修复方案（延迟隐藏 + 区域检测）**：

```javascript
let tooltipHideTimer = null;
let activeTooltipTodoId = null;

dot.addEventListener('mouseenter', () => {
  clearTimeout(tooltipHideTimer);
  // 隐藏其他 tooltip
  $('qMatrix').querySelectorAll('.q-tooltip').forEach(t => t.style.display = 'none');
  $('qMatrix').querySelectorAll('.q-dot').forEach(d => d.classList.remove('hover'));

  tip.style.display = 'block';
  dot.classList.add('hover');
  activeTooltipTodoId = todo.id;
});

dot.addEventListener('mouseleave', () => {
  // 延迟隐藏，给鼠标移动到 tooltip 的时间
  tooltipHideTimer = setTimeout(() => {
    if (activeTooltipTodoId === todo.id) {
      tip.style.display = 'none';
      dot.classList.remove('hover');
      activeTooltipTodoId = null;
    }
  }, 300);
});

// tooltip 自身的 mouseenter/mouseleave
tip.addEventListener('mouseenter', () => {
  clearTimeout(tooltipHideTimer); // 鼠标进入 tooltip，取消隐藏
});

tip.addEventListener('mouseleave', () => {
  tooltipHideTimer = setTimeout(() => {
    tip.style.display = 'none';
    dot.classList.remove('hover');
    activeTooltipTodoId = null;
  }, 200);
});
```

**关键改动**：
1. `mouseleave` 不再立即隐藏，改为 `setTimeout` 延迟 300ms
2. tooltip 自身监听 `mouseenter`（取消隐藏定时器）和 `mouseleave`（触发隐藏）
3. 这样鼠标从 dot → tooltip 的路径中，tooltip 不会消失

**验证**：
- 鼠标移到原点 → tooltip 出现
- 鼠标从原点移到 tooltip → tooltip 不消失
- 点击「完成」按钮 → 事件正常完成
- 鼠标移出 tooltip → tooltip 消失

---

## v2 实施顺序

| 顺序 | 任务 | 理由 |
|------|------|------|
| 1 | v2-7 修复 tooltip bug | 交互 bug，影响基本使用 |
| 2 | v2-6 四象限折叠 + 修复背景 | 样式 bug + 功能增强 |
| 3 | v2-3 字体粗细调整 | 纯样式，快速完成 |
| 4 | v2-4 灵感引导框加宽 | 纯样式，快速完成 |
| 5 | v2-1 删除右侧空白 | 布局调整 |
| 6 | v2-5 MBTI 移到发现页 | 结构调整，涉及较多代码 |
| 7 | v2-2 泡泡鼠标跟随 | 最复杂，需要新增动画系统 |

---

## v2 反 AI slop 检查

- [x] 泡泡动画不用 emoji（用 CSS 圆形 + 半透明色）
- [x] 不用紫色渐变（用任务线自身的颜色）
- [x] 字体调整基于参考图片，不凭空选
- [x] 折叠动画用 cubic-bezier 缓动，不用生硬的 display toggle
- [x] tooltip 修复用延迟隐藏，不用 hack

---

## v2 技术备注

- 所有修改都在 `dashboard.html` 单文件内完成
- CSS 变量系统不变，新增样式用现有变量
- localStorage key 保持 `fp3_` 前缀
- 泡泡动画用 `requestAnimationFrame`，不用 `setInterval`（性能更好）
- tooltip 修复不改变 DOM 结构，只改事件逻辑
