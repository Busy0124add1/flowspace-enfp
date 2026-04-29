# FlowSpace ENFP Vue 工作站 · 实施计划

> 目标：将现有 `dashboard.html` 重构为 Vue 3 + Vite 工程化项目
> 参考：`dashboard.html`（现有 ENFP 工作站）+ `PLAN.md`（设计计划）

---

## 1. 项目概述

### 1.1 项目信息

| 项目 | 值 |
|------|-----|
| 项目名称 | flowspace-enfp-vue |
| 默认 MBTI | ENFP |
| 架构 | Vue 3 SPA |
| 构建工具 | Vite 5 |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| UI 组件 | Headless UI（无样式） |
| 样式方案 | 原生 CSS + CSS 变量 |

### 1.2 目标

- 建立 Vue 3 工程化项目结构
- 继承现有 ENFP 设计系统（暗色主题、CSS 变量）
- 预留 MBTI 扩展性（16 类型配置化）
- 接入 WebSocket 实时服务层

---

## 2. 技术栈

| 依赖 | 版本 | 用途 |
|------|------|------|
| vue | ^3.4 | 框架 |
| vue-router | ^4 | 路由 |
| pinia | ^2 | 状态管理 |
| @headlessui/vue | ^2 | 无样式 UI 组件 |
| vite | ^5 | 构建工具 |

---

## 3. 项目结构

```
flowspace-enfp-vue/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.js              # 入口
│   ├── App.vue              # 根组件
│   ├── router/
│   │   └── index.js         # 路由配置
│   ├── assets/
│   │   └── main.css         # 全局样式 + CSS 变量
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Topbar.vue       # 顶部栏
│   │   │   └── Sidebar.vue      # 侧边栏
│   │   ├── mbti/
│   │   │   └── MbtiSwitcher.vue # MBTI 切换（Headless Menu）
│   │   ├── tabs/
│   │   │   └── PageTabs.vue     # 页面导航（Headless Tab）
│   │   ├── dashboard/
│   │   │   ├── EnergyPanel.vue      # 今日状态
│   │   │   ├── JournalPanel.vue     # 随笔
│   │   │   ├── ThreadsPanel.vue     # 并行任务线
│   │   │   └── DesignFlowPanel.vue  # 设计流程
│   │   ├── todo/
│   │   │   ├── QuadrantTodo.vue  # 四象限待办
│   │   │   └── TodoItem.vue      # 待办项
│   │   ├── modal/
│   │   │   └── NewProjectModal.vue # 新项目弹窗（Headless Dialog）
│   │   └── common/
│   │       ├── SparkLine.vue     # 每日灵感
│   │       └── SyncStatus.vue    # 同步状态
│   ├── views/
│   │   ├── DashboardView.vue     # 工作台页面
│   │   └── DiscoverView.vue      # 发现页面
│   ├── stores/
│   │   ├── app.js                # MBTI 类型、主题
│   │   ├── todos.js              # 四象限待办
│   │   ├── threads.js            # 并行任务线
│   │   ├── projects.js           # 设计项目
│   │   ├── journal.js            # 随笔
│   │   └── sync.js               # 同步状态
│   ├── services/
│   │   ├── websocket.js          # WebSocket 连接管理
│   │   ├── api.js                # REST API 封装
│   │   └── storage.js            # localStorage 封装
│   ├── config/
│   │   └── mbti.config.js        # MBTI 类型配置
│   └── utils/
│       └── index.js              # 工具函数
└── public/
    └── icons/
        └── enfp-icon.png
```

---

## 4. MBTI 扩展性设计

### 4.1 配置文件结构

```javascript
// config/mbti.config.js
export const MBTI_TYPES = {
  ENFP: {
    id: 'ENFP',
    group: 'diplomats',
    accent: '#f0537a',
    icon: '/icons/enfp-icon.png',
    avatar: {
      bounce: 'msc-bounce',
      celebrate: 'msc-celebrate',
      idle: 'msc-wobble',
      vibe: 'msc-vibe'
    },
    particles: ['🥚', '🌈', '⭐', '✨', '💥', '🎯', '🔥', '💫', '🎉', '🌟'],
    greeting: {
      morning: '早上好 ☀️',
      afternoon: '下午好 🌤️',
      evening: '晚上好 🌙'
    },
    description: '竞选者 · 富有想象力',
    traits: ['外向', '直觉', '情感', '知觉']
  },
  // 未来扩展：只需在此添加新类型
  // INTJ: { ... },
  // INFJ: { ... },
}

export const MBTI_GROUPS = {
  analysts: { name: '分析家', color: '#9b6dff' },
  diplomats: { name: '外交家', color: '#3ecfcf' },
  sentinels: { name: '守护者', color: '#4ade80' },
  explorers: { name: '探险家', color: '#f5a623' }
}

export const DEFAULT_TYPE = 'ENFP'
```

### 4.2 扩展清单

| 扩展项 | 当前状态 | 预留方式 |
|--------|---------|---------|
| 新增 MBTI 类型 | 只需在 `mbti.config.js` 添加配置 | 配置驱动 |
| 新增头像 | 只需在 `public/icons/` 添加图片 | 资源目录 |
| 新增 accent 色 | 只需改配置文件 | CSS 变量 |
| 新增粒子效果 | 只需改 `particles` 数组 | 配置数组 |
| 新增问候语 | 只需改 `greeting` 对象 | 配置对象 |
| 后端动态配置 | API 返回格式匹配本地配置 | 自动合并 |

---

## 5. Headless UI 组件映射

| 功能需求 | Headless UI 组件 | 用途 |
|---------|-----------------|------|
| MBTI 切换下拉 | `Menu` + `MenuButton` + `MenuItems` | 类型选择器 |
| 页面 Tab 导航 | `Tab` + `TabGroup` + `TabList` | 工作台/发现页切换 |
| 新项目弹窗 | `Dialog` + `DialogPanel` | 新建项目模态框 |
| 确认对话框 | `Dialog` | 删除/完成确认 |

---

## 6. WebSocket 服务层

```javascript
// services/websocket.js
class WSService {
  constructor() {
    this.ws = null
    this.listeners = new Map()
    this.reconnectDelay = 1000
    this.maxReconnectDelay = 30000
  }

  connect(url) {
    this.ws = new WebSocket(url)
    this.ws.onopen = () => {
      this.reconnectDelay = 1000
    }
    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      this.emit(data.type, data.payload)
    }
    this.ws.onclose = () => this.reconnect(url)
  }

  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, [])
    this.listeners.get(event).push(callback)
  }

  emit(event, data) {
    this.listeners.get(event)?.forEach(cb => cb(data))
  }

  send(type, payload) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    }
  }

  reconnect(url) {
    setTimeout(() => {
      this.connect(url)
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay)
    }, this.reconnectDelay)
  }
}
```

---

## 7. 实施步骤

### Phase 1: 项目脚手架

| 任务 | 操作 | 验证 |
|------|------|------|
| 1.1 | 初始化 Vite + Vue 项目 | `npm create vite@latest flowspace-enfp-vue -- --template vue` |
| 1.2 | 安装依赖（vue-router, pinia, @headlessui/vue） | `npm install vue-router pinia @headlessui/vue` |
| 1.3 | 配置 Vite 别名（`@/` 指向 `src/`） | 修改 `vite.config.js` |
| 1.4 | 清理默认文件 | 删除 `HelloWorld.vue`, `style.css` 等 |

### Phase 2: 全局样式系统

| 任务 | 操作 | 验证 |
|------|------|------|
| 2.1 | 创建 `src/assets/main.css` | 继承 `dashboard.html` CSS 变量 |
| 2.2 | 定义 `:root` CSS 变量 | `--bg`, `--surf`, `--card`, `--accent` 等 |
| 2.3 | 导入 Google Fonts（Outfit） | 字体加载正常 |
| 2.4 | 导入 Font Awesome 6.5 | 图标渲染正常 |

### Phase 3: MBTI 配置系统

| 任务 | 操作 | 验证 |
|------|------|------|
| 3.1 | 创建 `src/config/mbti.config.js` | 16 类型配置（当前只实现 ENFP） |
| 3.2 | 创建 `src/stores/app.js` | MBTI 类型状态管理 |
| 3.3 | 实现 `setMbti()` 方法 | localStorage 持久化 |
| 3.4 | 实现 `cssVars` getter | 动态更新 CSS 变量 |

### Phase 4: 布局组件

| 任务 | 操作 | 验证 |
|------|------|------|
| 4.1 | 创建 `Topbar.vue` | 顶部栏布局正确 |
| 4.2 | 创建 `MbtiSwitcher.vue`（Headless Menu） | 下拉切换正常 |
| 4.3 | 创建 `PageTabs.vue`（Headless Tab） | Tab 切换正常 |
| 4.4 | 创建 `Sidebar.vue` | 侧边栏布局正确 |
| 4.5 | 创建 `App.vue` 路由布局 | 页面结构正确 |

### Phase 5: 工作台页面

| 任务 | 操作 | 验证 |
|------|------|------|
| 5.1 | 创建 `EnergyPanel.vue` | 情绪/专注/创意滑块正常 |
| 5.2 | 创建 `JournalPanel.vue` | 随笔编辑+保存正常 |
| 5.3 | 创建 `ThreadsPanel.vue` | 并行任务线渲染正常 |
| 5.4 | 创建 `DesignFlowPanel.vue` | 设计流程阶段切换正常 |
| 5.5 | 创建 `DashboardView.vue` | 工作台页面完整 |

### Phase 6: 发现页面

| 任务 | 操作 | 验证 |
|------|------|------|
| 6.1 | 创建分类导航组件 | 分类切换正常 |
| 6.2 | 创建文章卡片组件 | 文章列表渲染正常 |
| 6.3 | 创建 `DiscoverView.vue` | 发现页面完整 |

### Phase 7: WebSocket 服务层

| 任务 | 操作 | 验证 |
|------|------|------|
| 7.1 | 实现 `WSService` 类 | 连接/断开/重连正常 |
| 7.2 | 实现事件订阅机制 | 事件监听正常 |
| 7.3 | 集成到 Pinia Store | 实时状态同步 |

### Phase 8: 剩余模块迁移

| 任务 | 操作 | 验证 |
|------|------|------|
| 8.1 | 创建 `QuadrantTodo.vue` | 四象限拖拽正常 |
| 8.2 | 创建 `SyncStatus.vue` | 同步状态显示正常 |
| 8.3 | 创建 `SparkLine.vue` | 每日灵感动画正常 |
| 8.4 | 创建 `NewProjectModal.vue`（Headless Dialog） | 弹窗正常 |

---

## 8. 验证清单

- [ ] `npm run dev` 启动成功
- [ ] 页面无 console 错误
- [ ] MBTI 切换正常（localStorage 持久化）
- [ ] CSS 变量正确更新（accent 色变化）
- [ ] Headless UI 组件交互正常
- [ ] WebSocket 连接成功
- [ ] 移动端布局正常

---

## 9. 风险与应对

| 风险 | 应对 |
|------|------|
| Headless UI 与现有样式冲突 | 使用 scoped CSS + CSS 变量隔离 |
| WebSocket 断线重连 | 实现指数退避重连机制 |
| 性能问题 | 使用 `v-memo` / `shallowRef` 优化 |

---

## 10. 后续扩展

- [ ] 实现剩余 15 个 MBTI 类型配置
- [ ] 添加后端 API 集成
- [ ] 添加 PWA 支持
- [ ] 添加暗色/亮色主题切换
