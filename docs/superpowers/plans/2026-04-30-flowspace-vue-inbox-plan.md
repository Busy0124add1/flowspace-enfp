# FlowSpace ENFP Vue 重构 + 灵感收件箱 · Implementation Plan (Part 1 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `dashboard.html` 单文件 ENFP 工作站重构为 Vue 3 + Vite + Pinia + PrimeVue(unstyled) 工程，同时构建「灵感收件箱」Kanban、16 MBTI 类型配置系统、正反馈系统（粒子/pulse/countup/checkmark/mascot/praise）。

**Architecture:** 双页面 SPA，工作台 + 收件箱通过 Vue Router 切换。所有数据通过 Pinia 3 个 store 管理（useMbti / useWorkspace / useInbox），前端 localStorage 持久化（`fs1_*` 前缀）。PrimeVue 以 unstyled 模式运行，所有视觉由项目 CSS 用 CSS 变量驱动，MBTI 主题切换通过修改 `:root` 的 `--accent` 实现。

**Tech Stack:** Vue 3.4 · Vite 5 · Pinia 2 · Vue Router 4 · PrimeVue 4.5 (unstyled) · Vitest (关键逻辑测试) · 原生 CSS + CSS 变量 · localStorage

**Testing Approach:** 务实 TDD——关键逻辑（storage、stores、composables 算法）先写测试再实现；UI 组件用目测验证（dev server 可视化对比）。

**Spec Reference:** `docs/superpowers/specs/2026-04-30-flowspace-vue-inbox-design.md`

---

## 前置说明

- **工作目录**：项目根 `C:\Users\huangbingzhang\Desktop\flowspace-enfp`
- **旧 dashboard.html 保留不动**：作为迁移参考，最后再决定是否删除
- **新 Vue 项目放在根目录下的 `src/` + `public/` + `index.html`**，覆盖 Vite 默认位置
- **包管理器**：npm（已装）
- **Node 版本**：≥ 18（假设已满足）
- **浏览器验证**：以 Chrome 为主，Firefox/Edge 为辅

每个任务的"提交"步骤保持小而频繁（feat/chore/style 前缀 + 中文说明）。

---

# Phase 1 · 脚手架

## Task 1: 初始化 Vite + Vue 3 项目

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/App.vue`
- Create: `.gitignore`（追加 node_modules / dist）

- [ ] **Step 1: 创建 package.json**

Write `package.json`:
```json
{
  "name": "flowspace-enfp",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  }
}
```

- [ ] **Step 2: 安装生产依赖**

Run: `npm install vue@^3.4 vue-router@^4 pinia@^2 primevue@^4.5`
Expected: 无 error，node_modules/ 下有 vue / pinia / primevue / vue-router 四个目录

- [ ] **Step 3: 安装开发依赖**

Run: `npm install -D vite@^5 @vitejs/plugin-vue vitest @vue/test-utils jsdom`
Expected: 无 error

- [ ] **Step 4: 创建 vite.config.js**

Write `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 5: 创建 index.html**

Write `index.html`:
```html
<!DOCTYPE html>
<html lang="zh-CN" data-mbti="ENFP">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    <title>FlowSpace ENFP</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 6: 创建最小 App.vue 和 main.js**

Write `src/App.vue`:
```vue
<template>
  <div>FlowSpace ENFP — Vite Running</div>
</template>

<script setup></script>
```

Write `src/main.js`:
```javascript
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
```

- [ ] **Step 7: 更新 .gitignore**

Read existing `.gitignore` first, then append these lines (don't duplicate if already present):
```
node_modules/
dist/
*.local
```

- [ ] **Step 8: 放一个占位 favicon.svg**

Write `public/favicon.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#f0537a"/></svg>
```

- [ ] **Step 9: 启动验证**

Run: `npm run dev`
Expected: 控制台输出 `VITE v5.x.x  ready in XXX ms` 和 `Local: http://localhost:5173/`
打开浏览器访问，页面显示 `FlowSpace ENFP — Vite Running`。无控制台 error/warning。按 Ctrl+C 停止。

- [ ] **Step 10: Commit**

```bash
git add package.json vite.config.js index.html src/main.js src/App.vue .gitignore public/favicon.svg package-lock.json
git commit -m "feat(P1): scaffold Vite + Vue 3 project"
```

---

## Task 2: 接入 Pinia 和 PrimeVue (unstyled)

**Files:**
- Modify: `src/main.js`

- [ ] **Step 1: 修改 main.js 注册 Pinia 和 PrimeVue**

Overwrite `src/main.js`:
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(PrimeVue, { unstyled: true })
app.use(ToastService)
app.use(ConfirmationService)
app.mount('#app')
```

- [ ] **Step 2: 启动验证**

Run: `npm run dev`
Expected: 页面正常显示，控制台无任何 PrimeVue 相关 warning。

- [ ] **Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat(P1): wire up Pinia + PrimeVue unstyled"
```

---

# Phase 2 · 全局样式 + MBTI 配置系统

## Task 3: 创建全局样式基础（base.css + tokens.css）

**Files:**
- Create: `src/styles/base.css`
- Create: `src/styles/tokens.css`
- Modify: `src/main.js`（引入样式）

- [ ] **Step 1: 创建 tokens.css**

Write `src/styles/tokens.css`:
```css
/* CSS 变量定义：基础色 + MBTI 主题覆盖 */
:root {
  /* 基础色（不随 MBTI 变化） */
  --bg: #0c0d10;
  --surf: #13141a;
  --card: #191b23;
  --line: #252730;

  /* 文字色 */
  --t1: #eeeef2;
  --t2: #8a8b99;
  --t3: #4a4b58;

  /* MBTI 辅色池（dashboard.html 继承） */
  --pink: #f0537a;
  --cyan: #3ecfcf;
  --lime: #9de84b;
  --violet: #9b6dff;
  --amber: #f5a623;

  /* 圆角 */
  --r: 8px;
  --r2: 12px;

  /* MBTI 主题（applyTheme 会动态覆盖这两个） */
  --accent: var(--pink);
  --group-color: var(--cyan);
}

/* MBTI 类型的默认静态覆盖（以防 JS 未运行时 SSR/首屏） */
[data-mbti="ENFP"] { --accent: #f0537a; --group-color: #3ecfcf; }
[data-mbti="INTJ"] { --accent: #9b6dff; --group-color: #9b6dff; }
[data-mbti="INTP"] { --accent: #9b6dff; --group-color: #9b6dff; }
[data-mbti="ENTJ"] { --accent: #9b6dff; --group-color: #9b6dff; }
[data-mbti="ENTP"] { --accent: #9b6dff; --group-color: #9b6dff; }
[data-mbti="INFJ"] { --accent: #3ecfcf; --group-color: #3ecfcf; }
[data-mbti="INFP"] { --accent: #3ecfcf; --group-color: #3ecfcf; }
[data-mbti="ENFJ"] { --accent: #3ecfcf; --group-color: #3ecfcf; }
[data-mbti="ISTJ"] { --accent: #4ade80; --group-color: #4ade80; }
[data-mbti="ISFJ"] { --accent: #4ade80; --group-color: #4ade80; }
[data-mbti="ESTJ"] { --accent: #4ade80; --group-color: #4ade80; }
[data-mbti="ESFJ"] { --accent: #4ade80; --group-color: #4ade80; }
[data-mbti="ISTP"] { --accent: #f5a623; --group-color: #f5a623; }
[data-mbti="ISFP"] { --accent: #f5a623; --group-color: #f5a623; }
[data-mbti="ESTP"] { --accent: #f5a623; --group-color: #f5a623; }
[data-mbti="ESFP"] { --accent: #f5a623; --group-color: #f5a623; }
```

- [ ] **Step 2: 创建 base.css**

Write `src/styles/base.css`:
```css
/* Reset + 字体 + 工具 class */
*, *::before, *::after { box-sizing: border-box; }

html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  background: var(--bg);
  color: var(--t1);
}

body {
  font-family: "Outfit", system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

button { font-family: inherit; cursor: pointer; }
input, textarea, select { font-family: inherit; }
a { color: var(--accent); text-decoration: none; }

/* 工具 class */
.text-t1 { color: var(--t1); }
.text-t2 { color: var(--t2); }
.text-t3 { color: var(--t3); }
.text-accent { color: var(--accent); }
.flex-row { display: flex; flex-direction: row; }
.flex-col { display: flex; flex-direction: column; }
.flex-gap-4 { gap: 4px; }
.flex-gap-8 { gap: 8px; }
.flex-gap-12 { gap: 12px; }

/* 滚动条 */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb { background: var(--line); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--t3); }
```

- [ ] **Step 3: 在 main.js 引入样式**

Modify `src/main.js` — 在顶部 import 区域加两行（在 createApp 之前）:
```javascript
import './styles/tokens.css'
import './styles/base.css'
```

完整 main.js 应为：
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import App from './App.vue'
import './styles/tokens.css'
import './styles/base.css'

const app = createApp(App)
app.use(createPinia())
app.use(PrimeVue, { unstyled: true })
app.use(ToastService)
app.use(ConfirmationService)
app.mount('#app')
```

- [ ] **Step 4: 验证**

Run: `npm run dev`
Expected: 页面背景变成深色 `#0c0d10`，文字变成浅色 `#eeeef2`，字体为 Outfit。devtools 检查 `<html>` 有 `data-mbti="ENFP"` 属性，computed style 的 `--accent` 是 `#f0537a`。

- [ ] **Step 5: Commit**

```bash
git add src/styles/base.css src/styles/tokens.css src/main.js
git commit -m "feat(P2): global CSS tokens + base reset with MBTI theme hooks"
```

---

## Task 4: MBTI 配置文件

**Files:**
- Create: `src/config/mbti.js`
- Create: `tests/config/mbti.test.js`

- [ ] **Step 1: 写失败测试**

Write `tests/config/mbti.test.js`:
```javascript
import { describe, it, expect } from 'vitest'
import { MBTI_TYPES, MBTI_GROUPS, resolveType, DEFAULT_TYPE } from '@/config/mbti'

describe('MBTI config', () => {
  it('has all 16 types', () => {
    expect(Object.keys(MBTI_TYPES)).toHaveLength(16)
  })

  it('has 4 groups', () => {
    expect(Object.keys(MBTI_GROUPS)).toEqual(['analysts', 'diplomats', 'sentinels', 'explorers'])
  })

  it('every type belongs to a valid group', () => {
    for (const [code, t] of Object.entries(MBTI_TYPES)) {
      expect(MBTI_GROUPS[t.group], `${code} has invalid group`).toBeTruthy()
    }
  })

  it('DEFAULT_TYPE is ENFP', () => {
    expect(DEFAULT_TYPE).toBe('ENFP')
  })

  it('resolveType ENFP returns full config with particles and avatar', () => {
    const t = resolveType('ENFP')
    expect(t.code).toBe('ENFP')
    expect(t.accent).toBe('#f0537a')
    expect(t.avatar).toBe('/avatars/enfp.png')
    expect(t.particles.length).toBeGreaterThan(0)
    expect(t.groupMeta.label).toBe('外交家')
  })

  it('resolveType INTJ fills defaults for missing fields', () => {
    const t = resolveType('INTJ')
    expect(t.code).toBe('INTJ')
    expect(t.accent).toBe('#9b6dff')         // group 色 fallback
    expect(t.avatar).toBeNull()
    expect(t.particles.length).toBe(4)        // DEFAULT_PARTICLES
    expect(t.traits).toEqual(['I', 'N', 'T', 'J'])
  })

  it('resolveType unknown code falls back to ENFP', () => {
    const t = resolveType('ZZZZ')
    expect(t.code).toBe('ENFP')
  })
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run tests/config/mbti.test.js`
Expected: FAIL，错误信息包含 "Cannot find module '@/config/mbti'" 或类似。

- [ ] **Step 3: 写最小实现**

Write `src/config/mbti.js`:
```javascript
export const MBTI_GROUPS = {
  analysts:  { label: '分析家', color: '#9b6dff' },
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
  INTJ: { code:'INTJ', name:'建筑师',    group:'analysts',  description:'战略性的思考者' },
  INTP: { code:'INTP', name:'逻辑学家',  group:'analysts',  description:'创新的发明家' },
  ENTJ: { code:'ENTJ', name:'指挥官',    group:'analysts',  description:'大胆的领导者' },
  ENTP: { code:'ENTP', name:'辩论家',    group:'analysts',  description:'机智的思考者' },
  INFJ: { code:'INFJ', name:'提倡者',    group:'diplomats', description:'安静的理想主义者' },
  INFP: { code:'INFP', name:'调停者',    group:'diplomats', description:'诗意的理想主义者' },
  ENFJ: { code:'ENFJ', name:'主人公',    group:'diplomats', description:'富有魅力的领导者' },
  ISTJ: { code:'ISTJ', name:'物流师',    group:'sentinels', description:'可靠的实干家' },
  ISFJ: { code:'ISFJ', name:'守卫者',    group:'sentinels', description:'温暖的守护者' },
  ESTJ: { code:'ESTJ', name:'总经理',    group:'sentinels', description:'高效的管理者' },
  ESFJ: { code:'ESFJ', name:'执政官',    group:'sentinels', description:'关怀的协调者' },
  ISTP: { code:'ISTP', name:'鉴赏家',    group:'explorers', description:'大胆的实验家' },
  ISFP: { code:'ISFP', name:'探险家',    group:'explorers', description:'灵活的艺术家' },
  ESTP: { code:'ESTP', name:'企业家',    group:'explorers', description:'精力充沛的行动派' },
  ESFP: { code:'ESFP', name:'表演者',    group:'explorers', description:'自发的享乐主义者' },
}

export const DEFAULT_TYPE = 'ENFP'
const DEFAULT_GREETING = { morning: '早上好', afternoon: '下午好', evening: '晚上好' }
const DEFAULT_PARTICLES = ['✨', '⭐', '💫', '🌟']

export function resolveType(code) {
  const t = MBTI_TYPES[code] || MBTI_TYPES[DEFAULT_TYPE]
  const group = MBTI_GROUPS[t.group]
  return {
    ...t,
    accent: t.accent ?? group.color,
    traits: t.traits ?? t.code.split(''),
    avatar: t.avatar ?? null,
    greeting: t.greeting ?? DEFAULT_GREETING,
    particles: t.particles ?? DEFAULT_PARTICLES,
    groupMeta: group,
  }
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run tests/config/mbti.test.js`
Expected: 所有 7 个 test 通过。

- [ ] **Step 5: Commit**

```bash
git add src/config/mbti.js tests/config/mbti.test.js
git commit -m "feat(P2): MBTI 16-type config with resolver + tests"
```

---

## Task 5: storage.js 服务 + 测试

**Files:**
- Create: `src/services/storage.js`
- Create: `tests/services/storage.test.js`

- [ ] **Step 1: 写失败测试**

Write `tests/services/storage.test.js`:
```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { load, save, remove } from '@/services/storage'

describe('storage service', () => {
  beforeEach(() => localStorage.clear())

  it('save + load round-trip', () => {
    save('test_key', { a: 1, b: [2, 3] })
    expect(load('test_key')).toEqual({ a: 1, b: [2, 3] })
  })

  it('load returns fallback when missing', () => {
    expect(load('missing', { x: 'default' })).toEqual({ x: 'default' })
  })

  it('load returns undefined when missing and no fallback', () => {
    expect(load('missing')).toBeUndefined()
  })

  it('load swallows JSON parse errors and returns fallback', () => {
    localStorage.setItem('broken', 'not-json{')
    expect(load('broken', 'safe')).toBe('safe')
  })

  it('remove clears the key', () => {
    save('tmp', 1)
    remove('tmp')
    expect(load('tmp')).toBeUndefined()
  })

  it('keys are automatically fs1_ prefixed', () => {
    save('foo', 'bar')
    expect(localStorage.getItem('fs1_foo')).toBe('"bar"')
  })
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run tests/services/storage.test.js`
Expected: FAIL，"Cannot find module '@/services/storage'"

- [ ] **Step 3: 写实现**

Write `src/services/storage.js`:
```javascript
const PREFIX = 'fs1_'

export function load(key, fallback = undefined) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (e) {
    console.warn('[storage] save failed', key, e)
  }
}

export function remove(key) {
  localStorage.removeItem(PREFIX + key)
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run tests/services/storage.test.js`
Expected: 所有 6 个 test 通过。

- [ ] **Step 5: Commit**

```bash
git add src/services/storage.js tests/services/storage.test.js
git commit -m "feat(P2): storage service with fs1_ prefix + JSON tolerant loader"
```

---

## Task 6: useMbti Pinia store

**Files:**
- Create: `src/stores/useMbti.js`
- Create: `tests/stores/useMbti.test.js`

- [ ] **Step 1: 写失败测试**

Write `tests/stores/useMbti.test.js`:
```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMbti } from '@/stores/useMbti'

describe('useMbti store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    document.documentElement.removeAttribute('data-mbti')
    document.documentElement.style.cssText = ''
  })

  it('defaults to ENFP when localStorage empty', () => {
    const store = useMbti()
    expect(store.code).toBe('ENFP')
  })

  it('loads saved code from localStorage', () => {
    localStorage.setItem('fs1_mbti', '"INTJ"')
    const store = useMbti()
    expect(store.code).toBe('INTJ')
  })

  it('current getter returns resolved config', () => {
    const store = useMbti()
    expect(store.current.accent).toBe('#f0537a')
    expect(store.current.name).toBe('竞选者')
  })

  it('setType persists and applies theme', () => {
    const store = useMbti()
    store.setType('INTJ')
    expect(store.code).toBe('INTJ')
    expect(localStorage.getItem('fs1_mbti')).toBe('"INTJ"')
    expect(document.documentElement.dataset.mbti).toBe('INTJ')
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#9b6dff')
  })

  it('init applies theme from current code', () => {
    localStorage.setItem('fs1_mbti', '"ESFP"')
    const store = useMbti()
    store.init()
    expect(document.documentElement.dataset.mbti).toBe('ESFP')
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#f5a623')
  })
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run tests/stores/useMbti.test.js`
Expected: FAIL

- [ ] **Step 3: 写实现**

Write `src/stores/useMbti.js`:
```javascript
import { defineStore } from 'pinia'
import { load, save } from '@/services/storage'
import { resolveType, DEFAULT_TYPE } from '@/config/mbti'

function applyTheme(type) {
  const root = document.documentElement
  root.dataset.mbti = type.code
  root.style.setProperty('--accent', type.accent)
  root.style.setProperty('--group-color', type.groupMeta.color)
}

export const useMbti = defineStore('mbti', {
  state: () => ({
    code: load('mbti', DEFAULT_TYPE),
  }),
  getters: {
    current: (s) => resolveType(s.code),
  },
  actions: {
    setType(code) {
      this.code = code
      save('mbti', code)
      applyTheme(resolveType(code))
    },
    init() {
      applyTheme(resolveType(this.code))
    },
  },
})
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run tests/stores/useMbti.test.js`
Expected: 5 个 test 全过。

- [ ] **Step 5: Commit**

```bash
git add src/stores/useMbti.js tests/stores/useMbti.test.js
git commit -m "feat(P2): useMbti store with applyTheme + localStorage persist"
```

---

## Task 7: AvatarBlock 组件

**Files:**
- Create: `src/components/mbti/AvatarBlock.vue`
- Create: `public/avatars/enfp.png` (复制 dashboard.html 同源图片，或占位)

- [ ] **Step 1: 复制 ENFP 头像到 public/avatars/**

Check whether dashboard.html 引用的 enfp-icon 图片存在。Run:
```bash
ls -la public/ 2>/dev/null
```

If `enfp-icon.png` 存在项目中（可能在旧路径），复制到 `public/avatars/enfp.png`。如果不存在，创建一个占位 SVG 作为替代：

Write `public/avatars/enfp.png.placeholder.md`:
```
ENFP 8bit 跴跴头像待补充。
当前使用 AvatarBlock 的 fallback 方块（code 字母 + accent 色）。
补充真实 PNG 后替换此目录下的 enfp.png 即可。
```

说明：此 plan 不假定 PNG 存在。AvatarBlock 的逻辑会自动 fallback，视觉不会崩。

- [ ] **Step 2: 创建 AvatarBlock.vue**

Write `src/components/mbti/AvatarBlock.vue`:
```vue
<template>
  <img
    v-if="showImage"
    :src="type.avatar"
    :alt="type.name"
    class="avatar"
    @error="imgFailed = true"
  />
  <div
    v-else
    class="avatar avatar-fallback"
    :style="{ background: type.accent }"
    :title="`${type.code} · ${type.name}`"
  >
    {{ type.code }}
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  type: { type: Object, required: true },  // resolveType 的结果
  size: { type: Number, default: 40 },
})

const imgFailed = ref(false)
const showImage = computed(() => !!props.type.avatar && !imgFailed.value)
</script>

<style scoped>
.avatar {
  width: v-bind('props.size + "px"');
  height: v-bind('props.size + "px"');
  border-radius: 10px;
  object-fit: cover;
  display: inline-block;
  vertical-align: middle;
}
.avatar-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: v-bind('Math.round(props.size * 0.26) + "px"');
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
  user-select: none;
}
</style>
```

- [ ] **Step 3: 临时挂到 App.vue 目测**

Modify `src/App.vue`:
```vue
<template>
  <div style="padding: 32px;">
    <h1>FlowSpace ENFP</h1>
    <p>MBTI: {{ mbti.code }} · {{ mbti.current.name }}</p>
    <div class="flex-row flex-gap-12" style="margin-top: 16px;">
      <AvatarBlock :type="mbti.current" :size="40" />
      <AvatarBlock :type="resolveType('INTJ')" :size="40" />
      <AvatarBlock :type="resolveType('ISFP')" :size="40" />
      <AvatarBlock :type="resolveType('ESTJ')" :size="40" />
    </div>
    <div style="margin-top: 16px;">
      <button @click="mbti.setType('INTJ')">切到 INTJ</button>
      <button @click="mbti.setType('ENFP')">切到 ENFP</button>
      <button @click="mbti.setType('ESFP')">切到 ESFP</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMbti } from '@/stores/useMbti'
import { resolveType } from '@/config/mbti'
import AvatarBlock from '@/components/mbti/AvatarBlock.vue'

const mbti = useMbti()
onMounted(() => mbti.init())
</script>
```

- [ ] **Step 4: 目测验证**

Run: `npm run dev`
Expected:
- 页面显示 "MBTI: ENFP · 竞选者"
- 4 个头像：ENFP 可能显示图（如果 PNG 就位）或"ENFP"色块；INTJ/ISFP/ESTJ 显示对应颜色方块 + 字母
- 点"切到 INTJ"按钮，页面上 ENFP 位置的头像变成紫色 INTJ 方块；devtools 检查 `<html data-mbti="INTJ">` 和 `--accent: #9b6dff`
- 刷新页面，MBTI 保持为上次选的类型

- [ ] **Step 5: Commit**

```bash
git add src/components/mbti/AvatarBlock.vue src/App.vue public/avatars/
git commit -m "feat(P2): AvatarBlock with PNG + fallback block, visual smoke test in App.vue"
```

---

# Phase 3 · 布局 + 双页路由

## Task 8: Vue Router 配置

**Files:**
- Create: `src/router.js`
- Create: `src/views/DashboardView.vue`（空壳）
- Create: `src/views/InboxView.vue`（空壳）
- Modify: `src/main.js`（注册 router）
- Modify: `src/App.vue`（RouterView）

- [ ] **Step 1: 创建两个 View 空壳**

Write `src/views/DashboardView.vue`:
```vue
<template>
  <div class="view-dashboard">
    <h2>工作台</h2>
    <p>（后续 Phase 4 填充具体模块）</p>
  </div>
</template>

<script setup></script>

<style scoped>
.view-dashboard { padding: 24px; }
</style>
```

Write `src/views/InboxView.vue`:
```vue
<template>
  <div class="view-inbox">
    <h2>灵感收件箱</h2>
    <p>（后续 Phase 5 填充 Kanban）</p>
  </div>
</template>

<script setup></script>

<style scoped>
.view-inbox { padding: 24px; }
</style>
```

- [ ] **Step 2: 创建 router.js**

Write `src/router.js`:
```javascript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
  { path: '/inbox', name: 'inbox', component: () => import('@/views/InboxView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

- [ ] **Step 3: main.js 注册 router**

Modify `src/main.js` — 在 `app.use(createPinia())` 后加一行：
```javascript
import { router } from './router'
// ...
app.use(router)
```

完整 main.js:
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import App from './App.vue'
import { router } from './router'
import './styles/tokens.css'
import './styles/base.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, { unstyled: true })
app.use(ToastService)
app.use(ConfirmationService)
app.mount('#app')
```

- [ ] **Step 4: App.vue 切换为 RouterView**

Overwrite `src/App.vue`:
```vue
<template>
  <div class="app">
    <nav class="temp-nav">
      <RouterLink to="/">工作台</RouterLink>
      <RouterLink to="/inbox">收件箱</RouterLink>
      <span class="spacer" />
      <span>MBTI: {{ mbti.code }}</span>
      <button @click="toggleMbti">切换</button>
    </nav>
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useMbti } from '@/stores/useMbti'

const mbti = useMbti()
onMounted(() => mbti.init())

const order = ['ENFP', 'INTJ', 'ISFP', 'ESTJ']
function toggleMbti() {
  const i = order.indexOf(mbti.code)
  mbti.setType(order[(i + 1) % order.length])
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: grid;
  grid-template-rows: 52px 1fr;
}
.temp-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  background: var(--surf);
  border-bottom: 1px solid var(--line);
}
.temp-nav a {
  color: var(--t2);
  padding: 4px 10px;
  border-radius: var(--r);
}
.temp-nav a.router-link-active {
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}
.spacer { flex: 1; }
.temp-nav button {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 4px 10px;
  border-radius: var(--r);
}
</style>
```

> **说明**：`temp-nav` 是临时占位，Task 9 会用真正的 TopBar 组件替换。

- [ ] **Step 5: 目测验证**

Run: `npm run dev`
Expected:
- 顶部有"工作台 / 收件箱 / MBTI: ENFP / 切换"
- 点"收件箱"，URL 变 `/inbox`，页面内容切到 "灵感收件箱"
- 浏览器后退/前进按钮工作
- 访问 `/unknown` 被重定向到 `/`
- 点"切换"按钮，MBTI 在 ENFP/INTJ/ISFP/ESTJ 之间循环，accent 色变化
- 无控制台 error

- [ ] **Step 6: Commit**

```bash
git add src/router.js src/views/DashboardView.vue src/views/InboxView.vue src/main.js src/App.vue
git commit -m "feat(P3): Vue Router with dashboard + inbox routes, temp nav"
```

---

## Task 9: TopBar 组件（含 MbtiSwitcher 和 PageTabs）

**Files:**
- Create: `src/components/layout/TopBar.vue`
- Create: `src/components/mbti/MbtiSwitcher.vue`
- Modify: `src/App.vue`（用 TopBar 替换 temp-nav）

- [ ] **Step 1: 创建 MbtiSwitcher.vue（PrimeVue Select）**

Write `src/components/mbti/MbtiSwitcher.vue`:
```vue
<template>
  <Select
    :model-value="mbti.code"
    :options="groupedOptions"
    option-label="label"
    option-value="value"
    option-group-label="groupLabel"
    option-group-children="items"
    placeholder="选择 MBTI"
    class="mbti-select"
    :pt="{ root: 'mbti-select-root', input: 'mbti-select-input', panel: 'mbti-select-panel' }"
    @update:model-value="onChange"
  >
    <template #value="{ value }">
      <span class="val">
        <AvatarBlock :type="mbti.current" :size="24" />
        <span class="val-text">
          <strong>{{ mbti.current.code }}</strong>
          <em>{{ mbti.current.name }}</em>
        </span>
      </span>
    </template>
    <template #optiongroup="{ option }">
      <div class="opt-group">
        <span class="opt-group-dot" :style="{ background: option.groupColor }" />
        {{ option.groupLabel }}
      </div>
    </template>
    <template #option="{ option }">
      <div class="opt">
        <span class="opt-dot" :style="{ background: option.accent }" />
        <strong>{{ option.value }}</strong>
        <span class="opt-name">{{ option.label.split(' · ')[1] }}</span>
        <span v-if="option.value === mbti.code" class="opt-check">✓</span>
      </div>
    </template>
  </Select>
</template>

<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'
import { useMbti } from '@/stores/useMbti'
import { MBTI_TYPES, MBTI_GROUPS, resolveType } from '@/config/mbti'
import AvatarBlock from './AvatarBlock.vue'

const mbti = useMbti()

const groupedOptions = computed(() => {
  const groups = {}
  for (const code of Object.keys(MBTI_TYPES)) {
    const t = resolveType(code)
    if (!groups[t.group]) {
      groups[t.group] = {
        groupLabel: MBTI_GROUPS[t.group].label,
        groupColor: MBTI_GROUPS[t.group].color,
        items: [],
      }
    }
    groups[t.group].items.push({
      value: code,
      label: `${t.code} · ${t.name}`,
      accent: t.accent,
    })
  }
  // 固定顺序：analysts / diplomats / sentinels / explorers
  return ['analysts', 'diplomats', 'sentinels', 'explorers']
    .map((g) => groups[g])
    .filter(Boolean)
})

function onChange(code) {
  mbti.setType(code)
}
</script>

<style scoped>
.mbti-select { min-width: 180px; }
.val { display: inline-flex; align-items: center; gap: 8px; }
.val-text { display: inline-flex; flex-direction: column; line-height: 1.15; }
.val-text strong { font-size: 13px; font-weight: 800; color: var(--t1); }
.val-text em { font-size: 11px; color: var(--t2); font-style: normal; }

.opt-group {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; font-size: 11px; font-weight: 700;
  color: var(--t3); text-transform: uppercase; letter-spacing: 0.6px;
  background: var(--bg);
}
.opt-group-dot { width: 8px; height: 8px; border-radius: 50%; }

.opt {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px; cursor: pointer; font-size: 13px;
  color: var(--t1);
}
.opt:hover { background: color-mix(in srgb, var(--accent) 8%, transparent); }
.opt-dot { width: 10px; height: 10px; border-radius: 50%; }
.opt-name { color: var(--t2); font-size: 12px; }
.opt-check { margin-left: auto; color: var(--accent); font-weight: 800; }
</style>

<style>
/* Select 的 panel 被 portal 到 body，作为非 scoped 的全局样式 */
.mbti-select-panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  min-width: 240px;
  max-height: 400px;
  overflow-y: auto;
}
.mbti-select-root {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 4px 12px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.15s;
}
.mbti-select-root:hover { border-color: var(--accent); }
.mbti-select-input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--t1);
  flex: 1;
}
</style>
```

- [ ] **Step 2: 创建 TopBar.vue**

Write `src/components/layout/TopBar.vue`:
```vue
<template>
  <header class="topbar">
    <div class="brand">
      <i class="fa-solid fa-compass"></i>
      <span>FlowSpace</span>
    </div>
    <MbtiSwitcher />
    <nav class="tabs">
      <RouterLink to="/" class="tab">
        <i class="fa-solid fa-grid-2"></i>
        <span>工作台</span>
      </RouterLink>
      <RouterLink to="/inbox" class="tab">
        <i class="fa-solid fa-inbox"></i>
        <span>收件箱</span>
      </RouterLink>
    </nav>
    <div class="spacer" />
    <div class="clock">{{ clock }}</div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import MbtiSwitcher from '@/components/mbti/MbtiSwitcher.vue'

const clock = ref('')
let timer = null

function tick() {
  const d = new Date()
  clock.value = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 30 * 1000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 20px;
  background: var(--surf);
  border-bottom: 1px solid var(--line);
  height: 52px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 15px;
  letter-spacing: -0.3px;
  color: var(--accent);
}
.brand i { font-size: 16px; }
.tabs {
  display: flex;
  gap: 4px;
  margin-left: 8px;
}
.tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--r);
  color: var(--t2);
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
}
.tab:hover { color: var(--t1); background: color-mix(in srgb, var(--accent) 6%, transparent); }
.tab.router-link-active {
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
}
.spacer { flex: 1; }
.clock {
  font-variant-numeric: tabular-nums;
  color: var(--t2);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
```

- [ ] **Step 3: 替换 App.vue 的临时 nav**

Overwrite `src/App.vue`:
```vue
<template>
  <div class="app">
    <TopBar />
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import TopBar from '@/components/layout/TopBar.vue'
import { useMbti } from '@/stores/useMbti'

const mbti = useMbti()
onMounted(() => mbti.init())
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: grid;
  grid-template-rows: 52px 1fr;
}
.main { overflow: auto; }
</style>
```

- [ ] **Step 4: 目测验证**

Run: `npm run dev`
Expected:
- TopBar: 左侧 logo + brand "FlowSpace"（粉色）· MbtiSwitcher 下拉 · "工作台 / 收件箱" Tab · 右侧时钟 HH:MM
- 点 MbtiSwitcher 下拉，4 分组（分析家/外交家/守护者/探险家）展开显示 16 类型，每项有小色块
- 选 INTJ → 整个页面 accent 色变紫、brand 变紫、tab 高亮色变紫
- 刷新页面，MBTI 保持
- Tab 点击切路由，URL 和高亮一致
- 时钟每 30 秒更新一次（可以等着看）
- 无控制台 error

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/TopBar.vue src/components/mbti/MbtiSwitcher.vue src/App.vue
git commit -m "feat(P3): TopBar with MbtiSwitcher (PrimeVue Select) + page tabs + clock"
```

---

# Batch 1 结束 · 进度检查

完成 9 个 Task，覆盖 Phase 1-3。

**可验证成果**：
- `npm run dev` 启动工程，顶部 TopBar 含 brand / MBTI 切换 / Tab / 时钟
- 路由 `/` 和 `/inbox` 切换正常
- 16 MBTI 类型切换，accent 色全局响应
- MBTI 持久化
- `npx vitest run` 通过 18+ 个测试（config/mbti.test.js 7 个 + services/storage.test.js 6 个 + stores/useMbti.test.js 5 个）

---

# Phase 4 · 工作台模块迁移

## Task 10: useWorkspace store + seed.json（含 TDD）

**Files:**
- Create: `src/stores/useWorkspace.js`
- Create: `src/mocks/seed.json`
- Create: `tests/stores/useWorkspace.test.js`

- [ ] **Step 1: 创建 seed.json**

Write `src/mocks/seed.json`:
```json
{
  "energy": { "mood": 72, "focus": 58, "creative": 85 },
  "journal": "",
  "threads": [
    { "id": "t1", "name": "产品原型", "desc": "v2 迭代", "color": "#f0537a", "pct": 40, "steps": [
      { "text": "需求分析", "done": true },
      { "text": "线框图", "done": true },
      { "text": "视觉稿", "done": false },
      { "text": "交互稿", "done": false },
      { "text": "交付开发", "done": false }
    ]},
    { "id": "t2", "name": "读书笔记", "desc": "《深度工作》", "color": "#3ecfcf", "pct": 60, "steps": [
      { "text": "第一章", "done": true },
      { "text": "第二章", "done": true },
      { "text": "第三章", "done": true },
      { "text": "复盘整理", "done": false },
      { "text": "输出文章", "done": false }
    ]},
    { "id": "t3", "name": "健身计划", "desc": "每周 3 次", "color": "#9de84b", "pct": 20, "steps": [
      { "text": "周一力量", "done": true },
      { "text": "周三有氧", "done": false },
      { "text": "周五拉伸", "done": false },
      { "text": "周日复盘", "done": false },
      { "text": "月度目标", "done": false }
    ]}
  ],
  "projects": [
    { "id": "p1", "name": "FlowSpace v2", "stage": 1, "stages": ["需求分析", "线框图", "视觉稿", "原型", "交付"] }
  ],
  "todos": [
    { "id": "td1", "text": "修复 tooltip bug", "x": 28, "y": 22, "q": "ui", "done": false },
    { "id": "td2", "text": "读新书第一章", "x": 72, "y": 28, "q": "si", "done": false },
    { "id": "td3", "text": "回老板邮件", "x": 22, "y": 72, "q": "un", "done": false }
  ],
  "notes": "",
  "sync": [
    { "id": "s1", "name": "Obsidian", "status": "ok", "lastSync": 1714464000000 },
    { "id": "s2", "name": "GitHub", "status": "ok", "lastSync": 1714460000000 },
    { "id": "s3", "name": "iCloud", "status": "pending", "lastSync": 1714450000000 }
  ],
  "streak": { "days": 3, "lastDate": "2026-04-29" },
  "inbox_items": [
    { "id": "seed-i1", "content": "试一下番茄钟做副业产品——刷到一个说 ENFP 专注力差的短视频", "url": "https://v.douyin.com/seed1", "status": "pending", "tags": ["副业", "专注"], "source": "douyin", "createdAt": 1714460000000, "updatedAt": 1714460000000 },
    { "id": "seed-i2", "content": "看到一个观点：每天写 500 字公开输出，3 个月涨粉 1000", "url": "https://zhuanlan.zhihu.com/p/seed2", "status": "verifying", "tags": ["写作"], "source": "zhihu", "createdAt": 1714380000000, "updatedAt": 1714463000000 },
    { "id": "seed-i3", "content": "用 Obsidian + Dataview 做每日复盘——试过了好用", "url": "", "status": "done", "tags": ["效率", "工具"], "source": "other", "review": "确实好用，已成习惯。每天 10 分钟。", "createdAt": 1713980000000, "updatedAt": 1714100000000 },
    { "id": "seed-i4", "content": "小红书上看到的早起方法：闹钟放远处。试过，没用。", "url": "https://xhslink.com/seed4", "status": "archived", "tags": ["睡眠"], "source": "xhs", "review": "对我无效，已放弃。", "createdAt": 1713800000000, "updatedAt": 1714200000000 }
  ]
}
```

- [ ] **Step 2: 写失败测试**

Write `tests/stores/useWorkspace.test.js`:
```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWorkspace } from '@/stores/useWorkspace'

describe('useWorkspace store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initial state is empty', () => {
    const s = useWorkspace()
    expect(s.threads).toEqual([])
    expect(s.todos).toEqual([])
    expect(s.journal).toBe('')
    expect(s.notes).toBe('')
  })

  it('hydrate from seed when localStorage empty', async () => {
    const s = useWorkspace()
    await s.hydrate()
    expect(s.threads.length).toBeGreaterThan(0)
    expect(s.energy.mood).toBe(72)
  })

  it('hydrate prefers localStorage over seed', async () => {
    localStorage.setItem('fs1_workspace', JSON.stringify({
      energy: { mood: 10, focus: 10, creative: 10 },
      journal: 'saved',
      threads: [], projects: [], todos: [], notes: '', sync: [],
      streak: { days: 0, lastDate: null }, inbox_items: [],
    }))
    const s = useWorkspace()
    await s.hydrate()
    expect(s.energy.mood).toBe(10)
    expect(s.journal).toBe('saved')
  })

  it('updateEnergy mutates and persists', () => {
    const s = useWorkspace()
    s.updateEnergy('mood', 80)
    expect(s.energy.mood).toBe(80)
  })

  it('upsertTodo adds new when id not found', () => {
    const s = useWorkspace()
    s.upsertTodo({ id: 'x', text: 'hi', x: 30, y: 30, q: 'ui', done: false })
    expect(s.todos).toHaveLength(1)
    expect(s.todos[0].text).toBe('hi')
  })

  it('upsertTodo updates existing by id', () => {
    const s = useWorkspace()
    s.upsertTodo({ id: 'x', text: 'hi', x: 30, y: 30, q: 'ui', done: false })
    s.upsertTodo({ id: 'x', text: 'updated', x: 50, y: 50, q: 'si', done: true })
    expect(s.todos).toHaveLength(1)
    expect(s.todos[0].text).toBe('updated')
    expect(s.todos[0].done).toBe(true)
  })

  it('removeTodo removes by id', () => {
    const s = useWorkspace()
    s.upsertTodo({ id: 'a', text: 'a', x: 0, y: 0, q: 'ui', done: false })
    s.upsertTodo({ id: 'b', text: 'b', x: 0, y: 0, q: 'ui', done: false })
    s.removeTodo('a')
    expect(s.todos).toHaveLength(1)
    expect(s.todos[0].id).toBe('b')
  })

  it('setJournal + setNotes persist', () => {
    const s = useWorkspace()
    s.setJournal('hello')
    s.setNotes('world')
    expect(s.journal).toBe('hello')
    expect(s.notes).toBe('world')
  })
})
```

- [ ] **Step 3: 跑测试确认失败**

Run: `npx vitest run tests/stores/useWorkspace.test.js`
Expected: FAIL，"Cannot find module '@/stores/useWorkspace'"

- [ ] **Step 4: 写实现**

Write `src/stores/useWorkspace.js`:
```javascript
import { defineStore } from 'pinia'
import { load, save } from '@/services/storage'

const EMPTY_STATE = () => ({
  energy: { mood: 50, focus: 50, creative: 50 },
  journal: '',
  threads: [],
  projects: [],
  todos: [],
  notes: '',
  sync: [],
  streak: { days: 0, lastDate: null },
  inbox_items: [],
})

export const useWorkspace = defineStore('workspace', {
  state: () => EMPTY_STATE(),
  actions: {
    async hydrate() {
      const saved = load('workspace')
      if (saved) {
        Object.assign(this, saved)
        return
      }
      const res = await fetch('/src/mocks/seed.json').catch(() => null)
      const seed = res && res.ok ? await res.json() : null
      if (seed) {
        Object.assign(this, seed)
        this.persist()
      }
    },
    persist() {
      const { energy, journal, threads, projects, todos, notes, sync, streak, inbox_items } = this
      save('workspace', { energy, journal, threads, projects, todos, notes, sync, streak, inbox_items })
    },
    updateEnergy(key, value) {
      this.energy[key] = value
      this.persist()
    },
    setJournal(v) { this.journal = v; this.persist() },
    setNotes(v) { this.notes = v; this.persist() },
    upsertThread(t) {
      const i = this.threads.findIndex((x) => x.id === t.id)
      if (i >= 0) this.threads[i] = { ...this.threads[i], ...t }
      else this.threads.push(t)
      this.persist()
    },
    removeThread(id) {
      this.threads = this.threads.filter((t) => t.id !== id)
      this.persist()
    },
    upsertTodo(t) {
      const i = this.todos.findIndex((x) => x.id === t.id)
      if (i >= 0) this.todos[i] = { ...this.todos[i], ...t }
      else this.todos.push(t)
      this.persist()
    },
    removeTodo(id) {
      this.todos = this.todos.filter((t) => t.id !== id)
      this.persist()
    },
    advanceProject(id) {
      const p = this.projects.find((x) => x.id === id)
      if (p && p.stage < p.stages.length - 1) { p.stage++; this.persist() }
    },
  },
})
```

**注意**：测试里 seed 加载是通过 fetch，jsdom 环境下 fetch 会拒绝；"hydrate from seed" 测试靠 store 发现 localStorage 为空时直接写死 seed 内容，为了让测试独立于 fetch 结果，我们在实现里退化处理：

Modify `src/stores/useWorkspace.js` — `hydrate` action 改为：
```javascript
async hydrate() {
  const saved = load('workspace')
  if (saved) {
    Object.assign(this, saved)
    return
  }
  // 尝试 fetch seed；失败时（如测试环境）使用静态导入
  let seed = null
  try {
    const res = await fetch('/src/mocks/seed.json')
    if (res.ok) seed = await res.json()
  } catch {}
  if (!seed) {
    const mod = await import('@/mocks/seed.json')
    seed = mod.default || mod
  }
  if (seed) {
    Object.assign(this, seed)
    this.persist()
  }
},
```

同时在 `vite.config.js` 里确保 `.json` 可以 import（Vite 默认支持，无需改）。

- [ ] **Step 5: 跑测试确认通过**

Run: `npx vitest run tests/stores/useWorkspace.test.js`
Expected: 8 个测试全过。

- [ ] **Step 6: Commit**

```bash
git add src/stores/useWorkspace.js src/mocks/seed.json tests/stores/useWorkspace.test.js
git commit -m "feat(P4): useWorkspace store with hydrate + seed.json + CRUD actions"
```

---

## Task 11: 相对时间格式化工具（含 TDD）

**Files:**
- Create: `src/utils/time.js`
- Create: `tests/utils/time.test.js`

- [ ] **Step 1: 写失败测试**

Write `tests/utils/time.test.js`:
```javascript
import { describe, it, expect } from 'vitest'
import { timeAgo } from '@/utils/time'

describe('timeAgo', () => {
  const NOW = new Date('2026-04-30T12:00:00Z').getTime()

  it('< 1 minute returns 刚刚', () => {
    expect(timeAgo(NOW - 30 * 1000, NOW)).toBe('刚刚')
  })

  it('1-59 minutes returns Xm ago', () => {
    expect(timeAgo(NOW - 15 * 60 * 1000, NOW)).toBe('15m ago')
  })

  it('1-23 hours returns Xh ago', () => {
    expect(timeAgo(NOW - 3 * 60 * 60 * 1000, NOW)).toBe('3h ago')
  })

  it('1-6 days returns Xd ago', () => {
    expect(timeAgo(NOW - 2 * 24 * 60 * 60 * 1000, NOW)).toBe('2d ago')
  })

  it('>= 7 days returns YYYY-MM-DD', () => {
    const old = new Date('2026-04-15T10:00:00Z').getTime()
    expect(timeAgo(old, NOW)).toBe('2026-04-15')
  })

  it('future timestamp returns 刚刚', () => {
    expect(timeAgo(NOW + 10000, NOW)).toBe('刚刚')
  })
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run tests/utils/time.test.js`
Expected: FAIL

- [ ] **Step 3: 写实现**

Write `src/utils/time.js`:
```javascript
export function timeAgo(ts, now = Date.now()) {
  const diff = now - ts
  if (diff < 60 * 1000) return '刚刚'
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)}h ago`
  if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / 86400000)}d ago`
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run tests/utils/time.test.js`
Expected: 6 个测试全过。

- [ ] **Step 5: Commit**

```bash
git add src/utils/time.js tests/utils/time.test.js
git commit -m "feat(P4): timeAgo utility with granular thresholds"
```

---

## Task 12: DashboardView 两列布局 + RightSidebar 空壳

**Files:**
- Modify: `src/views/DashboardView.vue`
- Create: `src/components/layout/RightSidebar.vue`

- [ ] **Step 1: 创建 RightSidebar.vue**

Write `src/components/layout/RightSidebar.vue`:
```vue
<template>
  <aside class="right-sidebar">
    <slot />
  </aside>
</template>

<script setup></script>

<style scoped>
.right-sidebar {
  background: var(--surf);
  border-left: 1px solid var(--line);
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
```

- [ ] **Step 2: 重写 DashboardView.vue 布局**

Overwrite `src/views/DashboardView.vue`:
```vue
<template>
  <div class="dashboard">
    <!-- 顶部横幅（DailySpark 占位，Task 22 填） -->
    <div class="banner-slot">
      <!-- DailySpark 将在 Task 22 插入这里 -->
    </div>
    <!-- 双列主体 -->
    <div class="two-col">
      <section class="left">
        <!-- EnergyPanel / JournalPanel / ThreadsPanel / DesignFlowPanel 将在后续 Task 插入 -->
        <div class="placeholder">左列（工作台模块待填充）</div>
      </section>
      <RightSidebar>
        <!-- QuadrantTodo / FlashNotes / SyncStatus / MascotAvatar 将在后续 Task 插入 -->
        <div class="placeholder">右列（侧边栏模块待填充）</div>
      </RightSidebar>
    </div>
  </div>
</template>

<script setup>
import RightSidebar from '@/components/layout/RightSidebar.vue'
</script>

<style scoped>
.dashboard {
  height: calc(100vh - 52px);
  display: grid;
  grid-template-rows: auto 1fr;
}
.banner-slot {
  padding: 0 20px;
}
.two-col {
  display: grid;
  grid-template-columns: 1fr 360px;
  overflow: hidden;
}
.left {
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.placeholder {
  color: var(--t3);
  padding: 40px 16px;
  text-align: center;
  font-size: 13px;
  border: 1px dashed var(--line);
  border-radius: var(--r2);
}
</style>
```

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected: 进入 `/`，看到左右两列布局：左列（1fr）背景 bg、右列 360px 背景 surf；各有"待填充"占位。滚动条行为正确。

- [ ] **Step 4: Commit**

```bash
git add src/views/DashboardView.vue src/components/layout/RightSidebar.vue
git commit -m "feat(P4): two-column dashboard layout with banner + right sidebar"
```

---

## Task 13: EnergyPanel.vue

**Files:**
- Create: `src/components/workspace/EnergyPanel.vue`
- Modify: `src/views/DashboardView.vue`（引入并放进左列）
- Modify: `src/main.js`（确保已 hydrate useWorkspace；见 Step 5）

- [ ] **Step 1: 创建 EnergyPanel.vue**

Write `src/components/workspace/EnergyPanel.vue`:
```vue
<template>
  <section class="panel">
    <h3 class="panel-title">
      <i class="fa-solid fa-bolt" />
      今日状态
    </h3>
    <div class="slider-row" v-for="k in keys" :key="k.key">
      <div class="slider-head">
        <span class="slider-label">{{ k.label }}</span>
        <span class="slider-value">{{ ws.energy[k.key] }}</span>
      </div>
      <Slider
        :model-value="ws.energy[k.key]"
        :min="0" :max="100"
        class="energy-slider"
        :pt="sliderPt(k.key)"
        @update:model-value="(v) => ws.updateEnergy(k.key, v)"
      />
    </div>
  </section>
</template>

<script setup>
import Slider from 'primevue/slider'
import { useWorkspace } from '@/stores/useWorkspace'

const ws = useWorkspace()

const keys = [
  { key: 'mood', label: '情绪' },
  { key: 'focus', label: '专注' },
  { key: 'creative', label: '创意' },
]

function sliderPt(key) {
  return {
    root: `slider-root slider-${key}`,
    handle: 'slider-handle',
    range: 'slider-range',
  }
}
</script>

<style scoped>
.panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--t2);
  margin: 0 0 14px;
  letter-spacing: 0.4px;
}
.panel-title i { color: var(--accent); }

.slider-row { margin-bottom: 14px; }
.slider-row:last-child { margin-bottom: 0; }

.slider-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}
.slider-label {
  font-size: 12px;
  color: var(--t1);
}
.slider-value {
  font-size: 13px;
  font-weight: 800;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
</style>

<style>
/* PrimeVue Slider unstyled 的 pt class，用全局 style（scoped 下无效） */
.slider-root {
  position: relative;
  height: 6px;
  background: var(--line);
  border-radius: 99px;
  cursor: pointer;
}
.slider-range {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--accent);
  border-radius: 99px;
}
.slider-handle {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background: var(--t1);
  border: 2px solid var(--accent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: transform 0.15s;
}
.slider-handle:hover { transform: translate(-50%, -50%) scale(1.15); }
.slider-handle:active { cursor: grabbing; }
</style>
```

- [ ] **Step 2: 塞进 DashboardView**

Modify `src/views/DashboardView.vue` — 在 `<section class="left">` 里替换 placeholder 为：
```vue
<EnergyPanel />
<div class="placeholder">左列其他模块待填充</div>
```

并在 script 区 import：
```javascript
import EnergyPanel from '@/components/workspace/EnergyPanel.vue'
```

- [ ] **Step 3: 确保 workspace 初始化**

Modify `src/App.vue` — 在 onMounted 里同时 hydrate workspace：
```javascript
import { useMbti } from '@/stores/useMbti'
import { useWorkspace } from '@/stores/useWorkspace'

const mbti = useMbti()
const ws = useWorkspace()
onMounted(async () => {
  mbti.init()
  await ws.hydrate()
})
```

- [ ] **Step 4: 目测**

Run: `npm run dev`
Expected: 左列出现"今日状态"卡片，3 个 slider 显示 seed 值（72/58/85）。拖动 slider，右侧数值实时变化。切 MBTI，slider 的 range 和 handle 的 accent 色跟着变。刷新页面，slider 值保留。

- [ ] **Step 5: Commit**

```bash
git add src/components/workspace/EnergyPanel.vue src/views/DashboardView.vue src/App.vue
git commit -m "feat(P4): EnergyPanel with 3 PrimeVue sliders bound to useWorkspace"
```

---

## Task 14: JournalPanel.vue

**Files:**
- Create: `src/components/workspace/JournalPanel.vue`
- Modify: `src/views/DashboardView.vue`

- [ ] **Step 1: 创建 JournalPanel.vue**

Write `src/components/workspace/JournalPanel.vue`:
```vue
<template>
  <section class="panel">
    <h3 class="panel-title">
      <i class="fa-solid fa-pen-nib" />
      今日随笔
      <span class="save-hint" v-if="lastSavedAt">保存于 {{ savedText }}</span>
    </h3>
    <textarea
      v-model="text"
      class="journal-input"
      placeholder="今天发生了什么……"
      rows="4"
    />
  </section>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useWorkspace } from '@/stores/useWorkspace'
import { timeAgo } from '@/utils/time'

const ws = useWorkspace()
const text = ref(ws.journal)
const lastSavedAt = ref(null)
let timer = null

// store → local
watch(() => ws.journal, (v) => {
  if (v !== text.value) text.value = v
})

// local → store (debounce 300ms)
watch(text, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    ws.setJournal(v)
    lastSavedAt.value = Date.now()
  }, 300)
})

const savedText = computed(() => lastSavedAt.value ? timeAgo(lastSavedAt.value) : '')
</script>

<style scoped>
.panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--t2);
  margin: 0 0 10px;
  letter-spacing: 0.4px;
}
.panel-title i { color: var(--accent); }
.save-hint {
  margin-left: auto;
  font-size: 10px;
  color: var(--t3);
  font-weight: 500;
}
.journal-input {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 10px 12px;
  color: var(--t1);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
}
.journal-input:focus { border-color: var(--accent); }
</style>
```

- [ ] **Step 2: 塞进 DashboardView**

Modify `src/views/DashboardView.vue` — left 列加 `<JournalPanel />` 在 EnergyPanel 后。

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected: 随笔卡片出现，输入文字 300ms 后触发保存（右上角出现"保存于 刚刚"），刷新页保留。

- [ ] **Step 4: Commit**

```bash
git add src/components/workspace/JournalPanel.vue src/views/DashboardView.vue
git commit -m "feat(P4): JournalPanel with debounced autosave + timeAgo hint"
```

---

## Task 15: ThreadsPanel.vue（含 v2-3 字体改进）

**Files:**
- Create: `src/components/workspace/ThreadsPanel.vue`
- Modify: `src/views/DashboardView.vue`

- [ ] **Step 1: 创建 ThreadsPanel.vue**

Write `src/components/workspace/ThreadsPanel.vue`:
```vue
<template>
  <section class="panel">
    <h3 class="panel-title">
      <i class="fa-solid fa-layer-group" />
      并行任务线
    </h3>
    <div class="threads-grid">
      <article
        v-for="t in ws.threads"
        :key="t.id"
        class="thread"
        :class="{ complete: t.pct >= 100 }"
        :style="{ '--tc': t.color }"
      >
        <div class="thread-head">
          <div class="thread-ico" :style="{ background: `${t.color}22`, color: t.color }">
            <i class="fa-solid fa-diamond" />
          </div>
          <div class="thread-pct-big" :style="{ color: t.color }">{{ t.pct }}</div>
        </div>
        <div class="thread-name">{{ t.name }}</div>
        <div class="thread-desc">{{ t.desc }}</div>
        <div class="thread-bar-track">
          <div class="thread-bar-fill" :style="{ width: `${t.pct}%`, background: t.color }" />
        </div>
        <div class="thread-steps">
          <div
            v-for="(s, i) in t.steps"
            :key="i"
            class="thread-step"
            :class="{ done: s.done }"
            @click="toggleStep(t, i, $event)"
          >
            <span class="step-check" :style="s.done ? { borderColor: t.color, background: t.color } : {}">
              <i v-if="s.done" class="fa-solid fa-check" />
            </span>
            <span class="thread-step-text">{{ s.text }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useWorkspace } from '@/stores/useWorkspace'

const ws = useWorkspace()
const emit = defineEmits(['step-done', 'thread-complete'])

function toggleStep(thread, idx, event) {
  const step = thread.steps[idx]
  const wasDone = step.done
  step.done = !step.done
  // 重算进度：done 步骤数 / 总步数 * 100
  const doneCount = thread.steps.filter((s) => s.done).length
  const newPct = Math.round((doneCount / thread.steps.length) * 100)
  const wasComplete = thread.pct >= 100
  thread.pct = newPct
  ws.upsertThread({ ...thread })
  // 反馈：新完成一个子步骤 → emit step-done；刚好跨 100 → emit thread-complete
  if (!wasDone) {
    const origin = { x: event.clientX, y: event.clientY }
    const el = event.currentTarget
    emit('step-done', { el, origin })
    if (!wasComplete && newPct >= 100) {
      emit('thread-complete', { el: el.closest('.thread'), origin })
    }
  }
}
</script>

<style scoped>
.panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--t2);
  margin: 0 0 14px;
  letter-spacing: 0.4px;
}
.panel-title i { color: var(--accent); }

.threads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 10px;
}

.thread {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}
.thread.complete {
  box-shadow: 0 0 0 1.5px var(--tc, #fff), 0 0 22px color-mix(in srgb, var(--tc, #fff) 30%, transparent);
}

.thread-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}
.thread-ico {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.thread-pct-big {
  font-size: 28px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: -1.5px;   /* v2-3 微调 */
}

/* v2-3 字体改进 */
.thread-name {
  font-size: 14px;          /* v2-3: 13 → 14 */
  font-weight: 800;         /* v2-3: 700 → 800 */
  letter-spacing: -0.2px;   /* v2-3 新增 */
  margin-bottom: 2px;
  color: var(--t1);
}
.thread-desc {
  font-size: 11px;
  font-weight: 500;         /* v2-3 新增 */
  color: var(--t2);         /* v2-3: t3 → t2 */
  margin-bottom: 12px;
}

.thread-bar-track {
  height: 7px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 12px;
}
.thread-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.thread-steps {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.thread-step {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;        /* v2-3: 11 → 11.5 */
  font-weight: 500;         /* v2-3 新增 */
  color: var(--t2);
  cursor: pointer;
  padding: 3px 0;
  user-select: none;
  transition: color 0.15s;
}
.thread-step:hover { color: var(--t1); }
.thread-step.done .step-check { color: #fff; }
.thread-step.done .thread-step-text {
  color: var(--t3);
  text-decoration: line-through;
}
.step-check {
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--t3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  flex-shrink: 0;
  transition: all 0.15s;
}
</style>
```

- [ ] **Step 2: 塞进 DashboardView**

Modify `src/views/DashboardView.vue` — 在左列 import 并放 `<ThreadsPanel />`（在 JournalPanel 后）。

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected:
- 3 个 thread 卡片横排（190px+ 自适应）
- 每个卡片的 title 14px/800、desc 11px/500/t2、pct 28px/900
- 点步骤前的方块勾选/取消勾选；进度条和百分比跟着更新
- 勾到 100% 整个卡片发光（outline + box-shadow）
- 刷新页面保留状态

- [ ] **Step 4: Commit**

```bash
git add src/components/workspace/ThreadsPanel.vue src/views/DashboardView.vue
git commit -m "feat(P4): ThreadsPanel with v2-3 font treatment + step toggle + progress"
```

---

## Task 16: DesignFlowPanel.vue

**Files:**
- Create: `src/components/workspace/DesignFlowPanel.vue`
- Modify: `src/views/DashboardView.vue`

- [ ] **Step 1: 创建 DesignFlowPanel.vue**

Write `src/components/workspace/DesignFlowPanel.vue`:
```vue
<template>
  <section class="panel" v-if="project">
    <h3 class="panel-title">
      <i class="fa-solid fa-route" />
      设计流程 · {{ project.name }}
    </h3>
    <div class="flow">
      <div
        v-for="(name, i) in project.stages"
        :key="i"
        class="stage"
        :class="{ active: i === project.stage, done: i < project.stage }"
        @click="advance(i, $event)"
      >
        <div class="stage-dot">
          <i v-if="i < project.stage" class="fa-solid fa-check" />
          <span v-else>{{ i + 1 }}</span>
        </div>
        <div class="stage-name">{{ name }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useWorkspace } from '@/stores/useWorkspace'

const ws = useWorkspace()
const project = computed(() => ws.projects[0])
const emit = defineEmits(['stage-advance'])

function advance(targetIndex, event) {
  if (!project.value) return
  if (targetIndex <= project.value.stage) return
  if (targetIndex !== project.value.stage + 1) return
  ws.advanceProject(project.value.id)
  emit('stage-advance', { el: event.currentTarget, origin: { x: event.clientX, y: event.clientY } })
}
</script>

<style scoped>
.panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--t2);
  margin: 0 0 14px;
  letter-spacing: 0.4px;
}
.panel-title i { color: var(--accent); }

.flow {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4px;
  position: relative;
}
.flow::before {
  content: '';
  position: absolute;
  top: 11px;
  left: 8%;
  right: 8%;
  height: 2px;
  background: var(--line);
  z-index: 0;
}
.stage {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  min-width: 0;
}
.stage-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--t3);
  transition: all 0.2s;
}
.stage.active .stage-dot {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
}
.stage.done .stage-dot {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.stage-name {
  font-size: 10.5px;
  color: var(--t3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.stage.active .stage-name { color: var(--t1); font-weight: 700; }
.stage.done .stage-name { color: var(--t2); }
</style>
```

- [ ] **Step 2: 塞进 DashboardView**

Modify `src/views/DashboardView.vue` — 左列加 `<DesignFlowPanel />`（在 ThreadsPanel 后）。删除"左列其他模块待填充"占位。

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected: 5 阶段线性管道，当前阶段 accent 色、已完成阶段勾选。点下一阶段推进；点再下一阶段不生效；刷新保留。

- [ ] **Step 4: Commit**

```bash
git add src/components/workspace/DesignFlowPanel.vue src/views/DashboardView.vue
git commit -m "feat(P4): DesignFlowPanel 5-stage linear pipeline with advance"
```

---

## Task 17: QuadrantTodo.vue 主体（含 v2-6b 径向渐变）

**Files:**
- Create: `src/components/workspace/QuadrantTodo.vue`
- Modify: `src/views/DashboardView.vue`（放进 RightSidebar）

- [ ] **Step 1: 创建 QuadrantTodo.vue**

Write `src/components/workspace/QuadrantTodo.vue`:
```vue
<template>
  <section class="panel">
    <h3 class="panel-title">
      <i class="fa-solid fa-th-large" />
      四象限待办
      <span class="count">{{ activeTodos.length }}</span>
    </h3>

    <div class="todo-section-body">
      <div class="todo-add-row">
        <input
          v-model="newText"
          class="todo-input"
          placeholder="新增待办……"
          @keyup.enter="addTodo"
        />
        <select v-model="newQ" class="q-select">
          <option value="ui">紧急重要</option>
          <option value="si">不急重要</option>
          <option value="un">紧急不重要</option>
          <option value="nn">不急不重要</option>
        </select>
        <button class="todo-btn" @click="addTodo"><i class="fa-solid fa-plus" /></button>
      </div>

      <div class="q-matrix-wrap" ref="matrixRef">
        <div class="q-tint ui" />
        <div class="q-tint si" />
        <div class="q-tint un" />

        <div class="q-axis-label top">重要</div>
        <div class="q-axis-label bottom">不重要</div>
        <div class="q-axis-label left">紧急</div>
        <div class="q-axis-label right">不紧急</div>

        <div class="q-corner ui">紧急重要</div>
        <div class="q-corner si">不急重要</div>
        <div class="q-corner un">紧急不重要</div>

        <div
          v-for="t in activeTodos"
          :key="t.id"
          class="q-dot"
          :class="{ done: t.done, 'dragging-dot': draggingId === t.id }"
          :style="{ left: `${t.x}%`, top: `${t.y}%`, background: dotColor(t) }"
          @mousedown="onDotDown($event, t)"
        />

        <div class="q-done-panel">
          <div class="q-done-label">已完成</div>
          <div class="q-done-list">
            <div v-for="t in doneTodos" :key="t.id" class="q-done-item">
              <span class="q-done-check"><i class="fa-solid fa-check" /></span>
              <span class="q-done-text">{{ t.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="todo-stats">
        <span class="todo-stat-text">{{ doneTodos.length }} / {{ ws.todos.length }}</span>
        <div class="todo-progress-bar">
          <div class="todo-progress-fill" :style="{ width: progressPct + '%' }" />
        </div>
        <span class="todo-stat-text">{{ progressPct }}%</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useWorkspace } from '@/stores/useWorkspace'

const ws = useWorkspace()
const matrixRef = ref(null)
const newText = ref('')
const newQ = ref('ui')
const draggingId = ref(null)

const activeTodos = computed(() => ws.todos.filter((t) => !t.done))
const doneTodos = computed(() => ws.todos.filter((t) => t.done))
const progressPct = computed(() => {
  if (ws.todos.length === 0) return 0
  return Math.round((doneTodos.value.length / ws.todos.length) * 100)
})

const emit = defineEmits(['todo-done'])

function addTodo() {
  const text = newText.value.trim()
  if (!text) return
  const positions = { ui: [25, 25], si: [75, 25], un: [25, 75], nn: [75, 75] }
  const [x, y] = positions[newQ.value]
  ws.upsertTodo({
    id: 'td' + Date.now(),
    text, x, y, q: newQ.value, done: false,
  })
  newText.value = ''
}

function dotColor(t) {
  const map = { ui: '#f0537a', si: '#f5a623', un: '#3ecfcf', nn: '#9b6dff' }
  return map[t.q] || '#ffffff'
}

// ---- 拖拽（原生 mouse 事件，不用 HTML5 DnD，因为 dot 是绝对定位）----
let dragTodo = null
function onDotDown(e, t) {
  e.preventDefault()
  dragTodo = t
  draggingId.value = t.id
  window.addEventListener('mousemove', onDotMove)
  window.addEventListener('mouseup', onDotUp)
}
function onDotMove(e) {
  if (!dragTodo || !matrixRef.value) return
  const rect = matrixRef.value.getBoundingClientRect()
  const x = Math.max(4, Math.min(96, ((e.clientX - rect.left) / rect.width) * 100))
  const y = Math.max(4, Math.min(96, ((e.clientY - rect.top) / rect.height) * 100))
  dragTodo.x = x
  dragTodo.y = y
  dragTodo.q = classifyQuadrant(x, y)
}
function onDotUp() {
  if (dragTodo) {
    ws.upsertTodo({ ...dragTodo })
    dragTodo = null
    draggingId.value = null
  }
  window.removeEventListener('mousemove', onDotMove)
  window.removeEventListener('mouseup', onDotUp)
}
function classifyQuadrant(x, y) {
  if (y < 50) return x < 50 ? 'ui' : 'si'
  return x < 50 ? 'un' : 'nn'
}
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDotMove)
  window.removeEventListener('mouseup', onDotUp)
})

// ---- 完成 action（tooltip 里调用，Task 19 补 tooltip；这里先暴露 markDone 便于测试）----
function markDone(t, event) {
  ws.upsertTodo({ ...t, done: true })
  if (event) emit('todo-done', { el: event.currentTarget, origin: { x: event.clientX, y: event.clientY } })
}
defineExpose({ markDone })
</script>

<style scoped>
.panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--t2);
  margin: 0 0 14px;
  letter-spacing: 0.4px;
}
.panel-title i { color: var(--accent); }
.count {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  color: var(--t3);
}

/* ==== todo 控件 ==== */
.todo-add-row {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}
.todo-input {
  flex: 1;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 8px 12px;
  font: 13px/1 "Outfit", sans-serif;
  color: var(--t1);
  outline: none;
  transition: border-color 0.2s;
}
.todo-input:focus { border-color: var(--accent); }
.todo-input::placeholder { color: var(--t3); }
.q-select {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 8px 6px;
  font-size: 11px;
  color: var(--t2);
  outline: none;
  cursor: pointer;
  font-family: inherit;
  max-width: 80px;
}
.todo-btn {
  width: 34px;
  height: 34px;
  background: var(--accent);
  border: none;
  border-radius: var(--r);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}
.todo-btn:hover { opacity: 0.85; transform: scale(1.06); }

/* ==== 矩阵 ==== */
.q-matrix-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  overflow: hidden;
  user-select: none;
}
.q-matrix-wrap::before,
.q-matrix-wrap::after {
  content: '';
  position: absolute;
  background: var(--line);
  pointer-events: none;
  z-index: 1;
}
.q-matrix-wrap::before {
  left: 50%; top: 8px; bottom: 8px; width: 1px;
  transform: translateX(-50%);
}
.q-matrix-wrap::after {
  top: 50%; left: 8px; right: 8px; height: 1px;
  transform: translateY(-50%);
}

/* v2-6b 径向渐变 */
.q-tint { position: absolute; pointer-events: none; z-index: 0; }
.q-tint.ui {
  top: 0; left: 0; width: 50%; height: 50%;
  background: radial-gradient(ellipse at 30% 30%, color-mix(in srgb, var(--pink) 8%, transparent), transparent 70%);
}
.q-tint.si {
  top: 0; right: 0; width: 50%; height: 50%;
  background: radial-gradient(ellipse at 70% 30%, color-mix(in srgb, var(--amber) 8%, transparent), transparent 70%);
}
.q-tint.un {
  bottom: 0; left: 0; width: 50%; height: 50%;
  background: radial-gradient(ellipse at 30% 70%, color-mix(in srgb, var(--cyan) 6%, transparent), transparent 70%);
}

.q-axis-label {
  position: absolute;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--t3);
  pointer-events: none;
  z-index: 2;
}
.q-axis-label.top    { top: 6px; left: 50%; transform: translateX(-50%); }
.q-axis-label.bottom { bottom: 6px; left: 50%; transform: translateX(-50%); }
.q-axis-label.left   { left: 6px; top: 50%; transform: translateY(-50%) rotate(-90deg); }
.q-axis-label.right  { right: 6px; top: 50%; transform: translateY(-50%) rotate(90deg); }

.q-corner {
  position: absolute;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
  pointer-events: none;
  z-index: 2;
  opacity: 0.55;
}
.q-corner.ui { top: 10px; left: 10px; color: var(--pink); }
.q-corner.si { top: 10px; right: 10px; color: var(--amber); }
.q-corner.un { bottom: 10px; left: 10px; color: var(--cyan); }

.q-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  z-index: 10;
  transition: transform 0.15s, box-shadow 0.15s;
  border: 1.5px solid rgba(0, 0, 0, 0.25);
}
.q-dot:hover, .q-dot.hover { transform: translate(-50%, -50%) scale(1.6); z-index: 20; }
.q-dot.done { opacity: 0.35; filter: grayscale(0.6); }
.q-dot.dragging-dot { opacity: 0.6; cursor: grabbing; z-index: 30; }

.q-done-panel {
  position: absolute;
  bottom: 0; right: 0;
  width: 50%; height: 50%;
  z-index: 5;
  display: flex;
  flex-direction: column;
  padding: 6px;
  pointer-events: none;  /* 让 dot 可以叠到这里 */
}
.q-done-label {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--t3);
  opacity: 0.55;
  margin-bottom: 4px;
  flex-shrink: 0;
}
.q-done-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 3px;
  pointer-events: auto;
}
.q-done-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 9.5px;
  color: var(--t3);
}
.q-done-item:hover { background: rgba(255, 255, 255, 0.05); color: var(--t2); }
.q-done-check {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4ade8033;
  border: 1px solid #4ade8066;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6px;
  color: #4ade80;
}
.q-done-text {
  flex: 1;
  text-decoration: line-through;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding: 7px 10px;
  background: var(--bg);
  border-radius: var(--r);
  border: 1px solid var(--line);
}
.todo-progress-bar {
  flex: 1;
  height: 4px;
  background: var(--line);
  border-radius: 99px;
  overflow: hidden;
  margin: 0 10px;
}
.todo-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--pink));
  border-radius: 99px;
  transition: width 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}
.todo-stat-text {
  font-size: 11px;
  color: var(--t3);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
```

- [ ] **Step 2: 塞进 RightSidebar**

Modify `src/views/DashboardView.vue` — RightSidebar 内部替换 placeholder 为 `<QuadrantTodo />`，同时 import。

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected:
- 四象限矩阵展示，3 个 seed todo 分散在三象限
- 三个象限色块是径向渐变（柔和、中心向边缘扩散）不是硬边长方形
- 拖动 dot：鼠标按下后拖动，落到不同象限，`t.q` 自动切换；松开刷新页面位置保留
- 新增待办：输入文字，选象限，回车或点 + 按钮 → 新 dot 出现在象限中心
- `.q-dot.done` 和 `q-done-list` 暂无 todo（没 done 的）

- [ ] **Step 4: Commit**

```bash
git add src/components/workspace/QuadrantTodo.vue src/views/DashboardView.vue
git commit -m "feat(P4): QuadrantTodo with radial gradient tints (v2-6b) + drag dots"
```

---

## Task 18: QuadrantTodo 折叠能力（v2-6a）

**Files:**
- Modify: `src/components/workspace/QuadrantTodo.vue`

- [ ] **Step 1: 修改 template 和 script 加入折叠**

Modify `src/components/workspace/QuadrantTodo.vue` — 在 `<h3 class="panel-title">` 里加折叠按钮，在 `<div class="todo-section-body">` 上加 `:class` 绑定：

Template 的 title 部分改为：
```vue
<h3 class="panel-title">
  <i class="fa-solid fa-th-large" />
  四象限待办
  <span class="count">{{ activeTodos.length }}</span>
  <button class="todo-collapse-btn" :class="{ collapsed }" @click="toggleCollapse">
    <i class="fa-solid fa-chevron-down" />
  </button>
</h3>
```

`<div class="todo-section-body">` 改为：
```vue
<div class="todo-section-body" :class="{ collapsed }">
```

Script 区加：
```javascript
import { load, save } from '@/services/storage'
const collapsed = ref(load('todo_collapsed', false))
function toggleCollapse() {
  collapsed.value = !collapsed.value
  save('todo_collapsed', collapsed.value)
}
```

（注意把 ref 加到现有 import 里：`import { ref, computed, onBeforeUnmount } from 'vue'`）

- [ ] **Step 2: 追加折叠 CSS**

在 scoped `<style>` 末尾追加：
```css
.todo-collapse-btn {
  background: none;
  border: none;
  color: var(--t3);
  cursor: pointer;
  font-size: 10px;
  padding: 0;
  margin-left: 8px;
  transition: color 0.15s, transform 0.2s;
  display: flex;
  align-items: center;
}
.todo-collapse-btn:hover { color: var(--t1); }
.todo-collapse-btn.collapsed { transform: rotate(-90deg); }

.todo-section-body {
  max-height: 800px;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}
.todo-section-body.collapsed { max-height: 0; }
```

注意删掉 count 和 panel-title 里 `margin-left: auto` 会被 collapse-btn 抢占的问题——把 count 样式里的 `margin-left: auto` 去掉，给 panel-title 里 count 之前加 `<span class="spacer" style="flex: 1"></span>`：

Template 最终 title：
```vue
<h3 class="panel-title">
  <i class="fa-solid fa-th-large" />
  <span>四象限待办</span>
  <span class="spacer" />
  <span class="count">{{ activeTodos.length }}</span>
  <button class="todo-collapse-btn" :class="{ collapsed }" @click="toggleCollapse">
    <i class="fa-solid fa-chevron-down" />
  </button>
</h3>
```

CSS 改：
```css
.panel-title .spacer { flex: 1; }
.count { font-size: 11px; font-weight: 700; color: var(--t3); }
```
（把原 `.count { margin-left: auto; ... }` 里的 `margin-left: auto` 删掉）

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected: 标题右侧出现箭头按钮；点击折叠整个矩阵 + 输入框 + 进度条；再点展开；箭头图标旋转；刷新页面状态保留。

- [ ] **Step 4: Commit**

```bash
git add src/components/workspace/QuadrantTodo.vue
git commit -m "feat(P4): QuadrantTodo collapse toggle with persistence (v2-6a)"
```

---

## Task 19: QuadrantTodo Tooltip + 延迟隐藏（v2-7）

**Files:**
- Modify: `src/components/workspace/QuadrantTodo.vue`

- [ ] **Step 1: 在 template 加 tooltip DOM**

在 `<div class="q-matrix-wrap" ref="matrixRef">` 内部、`q-dot` 之后加：
```vue
<div
  v-if="activeTooltipId"
  class="q-tooltip"
  :style="{ left: `${tooltipPos.x}%`, top: `${tooltipPos.y}%` }"
  @mouseenter="cancelHide"
  @mouseleave="scheduleHide"
>
  <div class="q-tooltip-text">{{ tooltipTodo?.text }}</div>
  <div class="q-tooltip-actions">
    <button class="q-tip-btn done-btn" @click="doneFromTooltip($event)">完成</button>
    <button class="q-tip-btn del-btn" @click="removeFromTooltip">删除</button>
  </div>
</div>
```

- [ ] **Step 2: 给 q-dot 加 mouseenter/leave**

修改 `<div v-for="t in activeTodos"` 那行：
```vue
<div
  v-for="t in activeTodos"
  :key="t.id"
  class="q-dot"
  :class="{ done: t.done, 'dragging-dot': draggingId === t.id, hover: activeTooltipId === t.id }"
  :style="{ left: `${t.x}%`, top: `${t.y}%`, background: dotColor(t) }"
  @mousedown="onDotDown($event, t)"
  @mouseenter="showTooltip(t)"
  @mouseleave="scheduleHide"
/>
```

- [ ] **Step 3: script 加 tooltip 状态机**

在 script 区加：
```javascript
import { ref as vueRef } from 'vue'  // 已 import，复用
const activeTooltipId = ref(null)
const tooltipPos = ref({ x: 0, y: 0 })
const tooltipTodo = computed(() => ws.todos.find((t) => t.id === activeTooltipId.value))
let hideTimer = null

function showTooltip(t) {
  cancelHide()
  activeTooltipId.value = t.id
  tooltipPos.value = { x: t.x, y: t.y }
}
function scheduleHide() {
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    activeTooltipId.value = null
  }, 300)
}
function cancelHide() {
  clearTimeout(hideTimer)
}
function doneFromTooltip(event) {
  const t = tooltipTodo.value
  if (!t) return
  ws.upsertTodo({ ...t, done: true })
  emit('todo-done', { el: event.currentTarget, origin: { x: event.clientX, y: event.clientY } })
  activeTooltipId.value = null
}
function removeFromTooltip() {
  const t = tooltipTodo.value
  if (!t) return
  ws.removeTodo(t.id)
  activeTooltipId.value = null
}

onBeforeUnmount(() => { clearTimeout(hideTimer) })
```

- [ ] **Step 4: 追加 tooltip CSS**

在 scoped `<style>` 末尾追加：
```css
.q-tooltip {
  position: absolute;
  background: #1e1f28;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 11px;
  color: var(--t1);
  pointer-events: auto;
  z-index: 50;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -130%);
  max-width: 160px;
  white-space: normal;
  line-height: 1.4;
}
.q-tooltip::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #1e1f28;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}
.q-tooltip-actions {
  display: flex;
  gap: 5px;
  margin-top: 6px;
}
.q-tip-btn {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}
.q-tip-btn:hover { opacity: 0.8; }
.q-tip-btn.done-btn {
  background: #4ade8022;
  color: #4ade80;
  border: 1px solid #4ade8044;
}
.q-tip-btn.del-btn {
  background: #f0537a22;
  color: #f0537a;
  border: 1px solid #f0537a44;
}
```

- [ ] **Step 5: 目测 v2-7 修复**

Run: `npm run dev`
Expected:
- 鼠标悬停 dot → tooltip 出现显示文本 + 完成/删除按钮
- 鼠标**从 dot 平移到 tooltip**（中间有小段空隙）→ **tooltip 不消失**（300ms 延迟 + tooltip 自身 mouseenter 取消隐藏）
- 点"完成"→ dot 消失，移到"已完成"列表
- 点"删除"→ dot 消失
- 鼠标移出 tooltip 300ms 后 tooltip 消失

- [ ] **Step 6: Commit**

```bash
git add src/components/workspace/QuadrantTodo.vue
git commit -m "fix(P4): QuadrantTodo tooltip delayed-hide to prevent disappear (v2-7)"
```

---

## Task 20: FlashNotes.vue

**Files:**
- Create: `src/components/workspace/FlashNotes.vue`
- Modify: `src/views/DashboardView.vue`

- [ ] **Step 1: 创建 FlashNotes.vue**

Write `src/components/workspace/FlashNotes.vue`:
```vue
<template>
  <section class="panel">
    <h3 class="panel-title">
      <i class="fa-solid fa-note-sticky" />
      <span>快捷笔记</span>
      <span class="spacer" />
      <button class="new-inspire-btn" title="Ctrl+K 快速记录灵感" @click="triggerCapture">
        <i class="fa-solid fa-lightbulb" />
        <span>新灵感</span>
        <kbd>⌘K</kbd>
      </button>
    </h3>
    <textarea
      v-model="text"
      class="notes-input"
      placeholder="随手写点什么……Ctrl+Enter 保存"
      rows="4"
      @keydown.ctrl.enter.prevent="saveNotes"
      @keydown.meta.enter.prevent="saveNotes"
    />
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useWorkspace } from '@/stores/useWorkspace'
import { useToast } from 'primevue/usetoast'

const ws = useWorkspace()
const toast = useToast()
const text = ref(ws.notes)

watch(() => ws.notes, (v) => { if (v !== text.value) text.value = v })

function saveNotes() {
  ws.setNotes(text.value)
  toast.add({ severity: 'success', summary: '已记下', life: 2000 })
}

function triggerCapture() {
  // 广播到全局：Batch 3 的 useHotkey 会监听
  window.dispatchEvent(new CustomEvent('fs1:open-capture'))
}
</script>

<style scoped>
.panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--t2);
  margin: 0 0 10px;
  letter-spacing: 0.4px;
}
.panel-title i { color: var(--accent); }
.panel-title .spacer { flex: 1; }

.new-inspire-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  color: var(--accent);
  border-radius: var(--r);
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.new-inspire-btn:hover { background: color-mix(in srgb, var(--accent) 20%, transparent); }
.new-inspire-btn kbd {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 10px;
  color: var(--t3);
  font-family: inherit;
}

.notes-input {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 10px 12px;
  color: var(--t1);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
}
.notes-input:focus { border-color: var(--accent); }
</style>
```

- [ ] **Step 2: 塞进 RightSidebar**

Modify `src/views/DashboardView.vue` — RightSidebar 内 QuadrantTodo 后面加 `<FlashNotes />`。

- [ ] **Step 3: 挂 Toast 容器**

Modify `src/App.vue` — 在 `<main>` 外部（平级）加：
```vue
<Toast position="bottom-right" />
```
import：`import Toast from 'primevue/toast'`

并加 global CSS（或 scoped 内）确保 Toast 可见：
```css
:deep(.p-toast) { position: fixed; bottom: 24px; right: 24px; z-index: 9999; }
:deep(.p-toast-message) {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 10px 14px;
  color: var(--t1);
  margin-bottom: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
```

- [ ] **Step 4: 目测**

Run: `npm run dev`
Expected: "快捷笔记"卡片出现，输入文字 Ctrl+Enter → 右下角 toast "已记下"；点"新灵感 ⌘K"按钮触发 window 事件（控制台可以通过 `window.addEventListener('fs1:open-capture', () => console.log('fired'))` 验证）。

- [ ] **Step 5: Commit**

```bash
git add src/components/workspace/FlashNotes.vue src/views/DashboardView.vue src/App.vue
git commit -m "feat(P4): FlashNotes with Ctrl+Enter save + 新灵感 button dispatches global event"
```

---

## Task 21: SyncStatus.vue

**Files:**
- Create: `src/components/workspace/SyncStatus.vue`
- Modify: `src/views/DashboardView.vue`

- [ ] **Step 1: 创建 SyncStatus.vue**

Write `src/components/workspace/SyncStatus.vue`:
```vue
<template>
  <section class="panel">
    <h3 class="panel-title">
      <i class="fa-solid fa-rotate" />
      同步状态
    </h3>
    <div class="sync-list">
      <div v-for="s in ws.sync" :key="s.id" class="sync-item">
        <span class="sync-dot" :class="s.status" />
        <span class="sync-name">{{ s.name }}</span>
        <span class="sync-time">{{ timeAgo(s.lastSync) }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useWorkspace } from '@/stores/useWorkspace'
import { timeAgo } from '@/utils/time'

const ws = useWorkspace()
</script>

<style scoped>
.panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 16px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--t2);
  margin: 0 0 10px;
  letter-spacing: 0.4px;
}
.panel-title i { color: var(--accent); }

.sync-list { display: flex; flex-direction: column; gap: 8px; }
.sync-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--t2);
}
.sync-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--t3);
}
.sync-dot.ok { background: #4ade80; }
.sync-dot.pending { background: #f5a623; }
.sync-dot.error { background: #f0537a; }
.sync-name { flex: 1; color: var(--t1); font-weight: 600; }
.sync-time {
  color: var(--t3);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
</style>
```

- [ ] **Step 2: 塞进 RightSidebar**

Modify `src/views/DashboardView.vue` — FlashNotes 后加 `<SyncStatus />`。

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected: 3 条 mock 同步项，每条左侧色点（绿/黄/红），中间名称，右侧相对时间。

- [ ] **Step 4: Commit**

```bash
git add src/components/workspace/SyncStatus.vue src/views/DashboardView.vue
git commit -m "feat(P4): SyncStatus display with colored dots + relative time"
```

---

## Task 22: DailySpark.vue（含 v2-4 加宽）

**Files:**
- Create: `src/config/sparks.js`
- Create: `src/components/workspace/DailySpark.vue`
- Modify: `src/views/DashboardView.vue`（放到 banner-slot）

- [ ] **Step 1: 创建 sparks.js**

Write `src/config/sparks.js`:
```javascript
export const SPARKS = [
  '创意不是等待灵感降临，而是主动探索可能性的边界。',
  '今天的小步骤，是明天的大突破。',
  '把最重要的事情放在最有能量的时候做。',
  '你不需要完美，只需要开始。',
  '每一个困难都是你成长的材料。',
  '好的沟通不是让所有人说同一种语言，而是让每种语言都被听到。',
  '专注是稀缺资源，保护它。',
  '深度比广度更能带来复利。',
  '不是所有想法都值得执行，但每个想法都值得被记下来。',
  '当你想逃避的时候，可能正是最值得做的事。',
  '一天完成一件让自己骄傲的事。',
  '能量管理比时间管理更重要。',
  '创造者的直觉来自日复一日的练习。',
  '先完成，再完美。',
  '你不会后悔今天写下的任何一个字。',
  '灵感来自于动手，不是沉思。',
  '比速度重要的是方向。',
  '允许自己犯错，是成长的前提。',
  '把"应该"变成"选择"。',
  '今天的你，可以比昨天多走一步。',
]
```

- [ ] **Step 2: 创建 DailySpark.vue**

Write `src/components/workspace/DailySpark.vue`:
```vue
<template>
  <div class="daily-spark-wrap">
    <div class="spark-header">
      <i class="fa-solid fa-wand-magic-sparkles" />
      <span class="spark-label">今日灵感</span>
    </div>
    <div class="spark-text">{{ displayText }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { SPARKS } from '@/config/sparks'
import { load, save } from '@/services/storage'

const displayText = ref('')
let timer = null

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

onMounted(() => {
  const record = load('daily_spark', null)
  let index
  if (record && record.date === todayKey()) {
    index = record.index
  } else {
    index = Math.floor(Math.random() * SPARKS.length)
    save('daily_spark', { date: todayKey(), index })
  }
  const full = SPARKS[index]
  let i = 0
  timer = setInterval(() => {
    displayText.value = full.slice(0, i)
    i++
    if (i > full.length) clearInterval(timer)
  }, 50)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.daily-spark-wrap {
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--accent) 8%, transparent),
    color-mix(in srgb, var(--violet) 8%, transparent));
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-radius: var(--r2);
  padding: 18px 28px;         /* v2-4 加宽的 padding */
  margin: 16px 0;
  position: relative;
  overflow: hidden;
}
.daily-spark-wrap::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--violet) 20%, transparent), transparent 70%);
  pointer-events: none;
}
.spark-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 6px;
  position: relative;
  z-index: 1;
}
.spark-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--t1);
  line-height: 1.5;
  position: relative;
  z-index: 1;
  min-height: 24px;
}
</style>
```

- [ ] **Step 3: 放到 banner-slot（跨两列）**

Modify `src/views/DashboardView.vue`:

template 的 banner-slot：
```vue
<div class="banner-slot">
  <DailySpark />
</div>
```

import：`import DailySpark from '@/components/workspace/DailySpark.vue'`

CSS 里 `.banner-slot` 保持 padding `0 20px`，内容已跨整个宽度。（v2-4 的"跨两列"在当前布局下自然达成，因为 banner-slot 是 grid-template-rows 的第一行，横跨整行。）

- [ ] **Step 4: 目测**

Run: `npm run dev`
Expected: TopBar 下方出现 DailySpark 横幅，横跨整个视口宽度（从左侧 20px 到右侧 20px，覆盖工作台左列 + 右 sidebar 的宽度），padding 18/28。刷新页面同一天显示同一条 spark；改浏览器日期/清 localStorage 后换新 spark。typewriter 逐字出现。

- [ ] **Step 5: Commit**

```bash
git add src/config/sparks.js src/components/workspace/DailySpark.vue src/views/DashboardView.vue
git commit -m "feat(P4): DailySpark banner with typewriter + daily persistence (v2-4 widened)"
```

---

## Task 23: MascotAvatar.vue 基础版

**Files:**
- Create: `src/components/workspace/MascotAvatar.vue`
- Modify: `src/views/DashboardView.vue`（放到 RightSidebar 顶部）

- [ ] **Step 1: 创建 MascotAvatar.vue**

Write `src/components/workspace/MascotAvatar.vue`:
```vue
<template>
  <div class="mascot-wrap">
    <div class="mascot-frame" :class="moodClass">
      <AvatarBlock :type="mbti.current" :size="96" />
    </div>
    <div class="mascot-meta">
      <div class="mascot-greeting">{{ greeting }}</div>
      <div class="mascot-name">{{ mbti.current.name }} · {{ mbti.current.description }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMbti } from '@/stores/useMbti'
import { useWorkspace } from '@/stores/useWorkspace'
import AvatarBlock from '@/components/mbti/AvatarBlock.vue'

const mbti = useMbti()
const ws = useWorkspace()

const greeting = computed(() => {
  const h = new Date().getHours()
  const slot = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'
  return mbti.current.greeting[slot]
})

// P8 会接 celebrate 事件切 msc-celebrate；本阶段只根据 mood 切默认 class
const moodClass = computed(() => {
  const m = ws.energy.mood
  if (m >= 75) return 'msc-bounce'
  if (m >= 45) return 'msc-vibe'
  return 'msc-wobble'
})
</script>

<style scoped>
.mascot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0 4px;
  gap: 8px;
}
.mascot-frame {
  width: 96px;
  height: 96px;
  border-radius: 24px;
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}
.mascot-meta { text-align: center; }
.mascot-greeting {
  font-size: 14px;
  font-weight: 700;
  color: var(--t1);
}
.mascot-name {
  font-size: 11px;
  color: var(--t2);
  margin-top: 2px;
}

/* 四种情绪 class */
.msc-bounce { animation: msc-bounce 1.2s ease-in-out infinite; }
.msc-vibe { animation: msc-vibe 2.5s ease-in-out infinite; }
.msc-wobble { animation: msc-wobble 2s ease-in-out infinite; }
.msc-celebrate { animation: msc-celebrate 0.6s ease-out; }

@keyframes msc-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes msc-vibe {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
}
@keyframes msc-wobble {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-3px); }
}
@keyframes msc-celebrate {
  0% { transform: scale(1); }
  40% { transform: scale(1.15) rotate(6deg); }
  100% { transform: scale(1) rotate(0); }
}
</style>
```

- [ ] **Step 2: 塞到 RightSidebar 顶部**

Modify `src/views/DashboardView.vue` — RightSidebar 内 QuadrantTodo **之前**加 `<MascotAvatar />`。

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected: 右侧栏顶部显示 ENFP 头像（或 fallback 方块）+ 问候语（按当前时段）+ 类型名 · 描述。头像根据 mood 值有微动画（bounce / vibe / wobble）。

- [ ] **Step 4: Commit**

```bash
git add src/components/workspace/MascotAvatar.vue src/views/DashboardView.vue
git commit -m "feat(P4): MascotAvatar with time-based greeting + mood-driven animation"
```

---

## Task 24: P4 视觉回归

**Files:**
- None（只验证）

- [ ] **Step 1: 打开原 dashboard.html 作参照**

Run: 在浏览器中直接打开 `file:///<project-root>/dashboard.html`（两个窗口并排 dev server 和 dashboard.html）。

- [ ] **Step 2: 核对 v2 改进**

Checklist：
- [ ] v2-3 字体：Vue 版 thread title 14px 800 > dashboard.html 13px 700；desc 色比原来亮一点（t2 vs t3）
- [ ] v2-4 DailySpark：Vue 版宽度明显大于 dashboard.html 原版（dashboard.html 只占左列宽；Vue 跨整个视口宽度），padding 18/28
- [ ] v2-6b q-tint：Vue 版 tint 是径向柔和渐变，边缘平滑；dashboard.html 已经是径向（同逻辑），两版一致即可
- [ ] v2-6a 折叠：Vue 版标题右侧有箭头，点击能折叠；dashboard.html 没有这功能（这是 Vue 独有）
- [ ] v2-7 tooltip：Vue 版鼠标 dot → tooltip 不消失；dashboard.html 原版这里有 bug，对比后 Vue 明显更好

- [ ] **Step 3: 核对功能等价**

Checklist：
- [ ] 新建 thread 步骤能勾选，进度跳
- [ ] todo 能新增 / 拖拽 / 完成
- [ ] journal / notes 能保存
- [ ] MBTI 切换整站响应
- [ ] 所有数据刷新后保留

- [ ] **Step 4: 跑全量测试**

Run: `npx vitest run`
Expected: 所有测试通过（config/mbti 7 + services/storage 6 + stores/useMbti 5 + stores/useWorkspace 8 + utils/time 6 = 32 个）

- [ ] **Step 5: Commit 一个空标记（或 empty-doc 便于 log 追踪）**

```bash
git commit --allow-empty -m "chore(P4): visual regression checkpoint complete"
```

---

# Phase 5 · 灵感收件箱核心

## Task 25: useInbox store（含 TDD）

**Files:**
- Create: `src/stores/useInbox.js`
- Create: `tests/stores/useInbox.test.js`

- [ ] **Step 1: 写失败测试**

Write `tests/stores/useInbox.test.js`:
```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useInbox } from '@/stores/useInbox'

describe('useInbox store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initial state is empty', () => {
    const s = useInbox()
    expect(s.items).toEqual([])
    expect(s.search).toBe('')
    expect(s.filterTags).toEqual([])
    expect(s.sortBy).toBe('createdAt')
    expect(s.sortOrder).toBe('desc')
  })

  it('addItem generates id, timestamps, pending status, inserts at head', () => {
    const s = useInbox()
    s.addItem({ content: 'test', url: 'https://ex.com' })
    expect(s.items).toHaveLength(1)
    const it = s.items[0]
    expect(it.id).toMatch(/./)
    expect(it.status).toBe('pending')
    expect(it.tags).toEqual([])
    expect(it.createdAt).toBeLessThanOrEqual(Date.now())
    expect(it.updatedAt).toBe(it.createdAt)
  })

  it('addItem auto-detects URL from content if url not given', () => {
    const s = useInbox()
    s.addItem({ content: 'check https://example.com/x cool' })
    expect(s.items[0].url).toBe('https://example.com/x')
  })

  it('updateStatus updates status + updatedAt', async () => {
    const s = useInbox()
    s.addItem({ content: 'a' })
    const id = s.items[0].id
    const orig = s.items[0].updatedAt
    await new Promise((r) => setTimeout(r, 5))
    s.updateStatus(id, 'done')
    expect(s.items[0].status).toBe('done')
    expect(s.items[0].updatedAt).toBeGreaterThan(orig)
  })

  it('updateFields patches specific fields', () => {
    const s = useInbox()
    s.addItem({ content: 'a' })
    const id = s.items[0].id
    s.updateFields(id, { tags: ['x', 'y'], review: 'done it' })
    expect(s.items[0].tags).toEqual(['x', 'y'])
    expect(s.items[0].review).toBe('done it')
    expect(s.items[0].content).toBe('a')
  })

  it('removeItem removes by id', () => {
    const s = useInbox()
    s.addItem({ content: 'a' })
    s.addItem({ content: 'b' })
    s.removeItem(s.items[0].id)
    expect(s.items).toHaveLength(1)
    expect(s.items[0].content).toBe('a') // second-added is now [0] (addItem inserts head)
  })

  it('batchUpdateStatus updates multiple', () => {
    const s = useInbox()
    s.addItem({ content: 'a' }); s.addItem({ content: 'b' }); s.addItem({ content: 'c' })
    const ids = s.items.slice(0, 2).map((i) => i.id)
    s.batchUpdateStatus(ids, 'archived')
    const archivedCount = s.items.filter((i) => i.status === 'archived').length
    expect(archivedCount).toBe(2)
  })

  it('filteredItems applies search on content/url/tags/source/review', () => {
    const s = useInbox()
    s.addItem({ content: 'apple pie recipe' })
    s.addItem({ content: 'banana split' })
    s.search = 'apple'
    expect(s.filteredItems).toHaveLength(1)
    expect(s.filteredItems[0].content).toContain('apple')
  })

  it('filteredItems applies tag filter OR logic', () => {
    const s = useInbox()
    s.addItem({ content: 'a' })
    s.updateFields(s.items[0].id, { tags: ['foo'] })
    s.addItem({ content: 'b' })
    s.updateFields(s.items[0].id, { tags: ['bar'] })
    s.addItem({ content: 'c' })
    s.filterTags = ['foo']
    expect(s.filteredItems).toHaveLength(1)
    s.filterTags = ['foo', 'bar']
    expect(s.filteredItems).toHaveLength(2)
  })

  it('filteredItems sorts by createdAt desc by default', () => {
    const s = useInbox()
    s.addItem({ content: 'first' })
    s.addItem({ content: 'second' })
    s.addItem({ content: 'third' })
    // addItem inserts at head so items[0] is newest
    expect(s.filteredItems[0].content).toBe('third')
    expect(s.filteredItems[2].content).toBe('first')
  })

  it('allTags aggregates unique tags across items', () => {
    const s = useInbox()
    s.addItem({ content: 'a' })
    s.updateFields(s.items[0].id, { tags: ['x', 'y'] })
    s.addItem({ content: 'b' })
    s.updateFields(s.items[0].id, { tags: ['y', 'z'] })
    expect(s.allTags.sort()).toEqual(['x', 'y', 'z'])
  })

  it('hydrate loads from fs1_inbox_items when present', () => {
    localStorage.setItem('fs1_inbox_items', JSON.stringify([
      { id: 'seed', content: 'pre', status: 'pending', tags: [], createdAt: 1, updatedAt: 1 },
    ]))
    const s = useInbox()
    s.hydrate()
    expect(s.items).toHaveLength(1)
    expect(s.items[0].id).toBe('seed')
  })

  it('persist writes to localStorage', () => {
    const s = useInbox()
    s.addItem({ content: 'persist me' })
    const raw = localStorage.getItem('fs1_inbox_items')
    const parsed = JSON.parse(raw)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].content).toBe('persist me')
  })
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run tests/stores/useInbox.test.js`
Expected: FAIL，"Cannot find module '@/stores/useInbox'"

- [ ] **Step 3: 写实现**

Write `src/stores/useInbox.js`:
```javascript
import { defineStore } from 'pinia'
import { load, save } from '@/services/storage'

const URL_RE = /(https?:\/\/\S+)/

function extractUrl(text) {
  const m = text.match(URL_RE)
  return m ? m[1].replace(/[，。、；！？)）】」]+$/, '') : null
}

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'i' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
}

export const useInbox = defineStore('inbox', {
  state: () => ({
    items: [],
    search: '',
    filterTags: [],
    sortBy: 'createdAt',
    sortOrder: 'desc',
    selectedIds: [],    // 用数组替代 Set 以便 Pinia 响应式友好
  }),
  getters: {
    allTags(state) {
      const set = new Set()
      for (const it of state.items) {
        for (const t of it.tags || []) set.add(t)
      }
      return Array.from(set)
    },
    filteredItems(state) {
      let list = state.items

      // search
      if (state.search) {
        const q = state.search.toLowerCase()
        list = list.filter((it) => {
          const hay = [
            it.content,
            it.url || '',
            (it.tags || []).join(' '),
            it.source || '',
            it.review || '',
          ].join(' ').toLowerCase()
          return hay.includes(q)
        })
      }

      // tag filter (OR)
      if (state.filterTags.length > 0) {
        list = list.filter((it) => (it.tags || []).some((t) => state.filterTags.includes(t)))
      }

      // sort
      const dir = state.sortOrder === 'desc' ? -1 : 1
      list = [...list].sort((a, b) => {
        const av = a[state.sortBy] ?? ''
        const bv = b[state.sortBy] ?? ''
        if (av < bv) return -1 * dir
        if (av > bv) return 1 * dir
        return 0
      })

      return list
    },
  },
  actions: {
    hydrate() {
      const saved = load('inbox_items', null)
      if (Array.isArray(saved)) this.items = saved
    },
    persist() {
      save('inbox_items', this.items)
    },
    addItem({ content, url }) {
      const finalUrl = url ?? extractUrl(content)
      const now = Date.now()
      const it = {
        id: genId(),
        content,
        url: finalUrl || undefined,
        status: 'pending',
        tags: [],
        source: undefined,
        review: undefined,
        createdAt: now,
        updatedAt: now,
      }
      this.items.unshift(it)
      this.persist()
      return it
    },
    updateStatus(id, newStatus) {
      const it = this.items.find((i) => i.id === id)
      if (!it) return
      it.status = newStatus
      it.updatedAt = Date.now()
      this.persist()
    },
    updateFields(id, patch) {
      const it = this.items.find((i) => i.id === id)
      if (!it) return
      Object.assign(it, patch)
      it.updatedAt = Date.now()
      this.persist()
    },
    removeItem(id) {
      this.items = this.items.filter((i) => i.id !== id)
      this.selectedIds = this.selectedIds.filter((x) => x !== id)
      this.persist()
    },
    batchUpdateStatus(ids, newStatus) {
      const now = Date.now()
      for (const it of this.items) {
        if (ids.includes(it.id)) {
          it.status = newStatus
          it.updatedAt = now
        }
      }
      this.persist()
    },
    toggleSelect(id) {
      if (this.selectedIds.includes(id)) {
        this.selectedIds = this.selectedIds.filter((x) => x !== id)
      } else {
        this.selectedIds.push(id)
      }
    },
    selectAllVisible() {
      this.selectedIds = this.filteredItems.map((i) => i.id)
    },
    clearSelection() {
      this.selectedIds = []
    },
  },
})
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run tests/stores/useInbox.test.js`
Expected: 13 个测试全过。

- [ ] **Step 5: Commit**

```bash
git add src/stores/useInbox.js tests/stores/useInbox.test.js
git commit -m "feat(P5): useInbox store with CRUD + search/filter/sort getters + batch"
```

---

## Task 26: URL 抽取 + 来源 guess 纯函数（含 TDD）

**Files:**
- Create: `src/utils/urlDetect.js`
- Create: `tests/utils/urlDetect.test.js`

- [ ] **Step 1: 写失败测试**

Write `tests/utils/urlDetect.test.js`:
```javascript
import { describe, it, expect } from 'vitest'
import { extractFirstUrl, guessSource } from '@/utils/urlDetect'

describe('extractFirstUrl', () => {
  it('returns null when no url', () => {
    expect(extractFirstUrl('hello world')).toBeNull()
  })

  it('extracts http URL', () => {
    expect(extractFirstUrl('see http://foo.com now')).toBe('http://foo.com')
  })

  it('extracts https URL', () => {
    expect(extractFirstUrl('link: https://bar.com/x')).toBe('https://bar.com/x')
  })

  it('extracts first URL when multiple', () => {
    expect(extractFirstUrl('a https://a.com and https://b.com')).toBe('https://a.com')
  })

  it('strips trailing Chinese punctuation', () => {
    expect(extractFirstUrl('请看 https://zhihu.com/q/123。非常棒')).toBe('https://zhihu.com/q/123')
    expect(extractFirstUrl('是这个https://a.com）')).toBe('https://a.com')
  })

  it('handles text with only url', () => {
    expect(extractFirstUrl('https://solo.com')).toBe('https://solo.com')
  })
})

describe('guessSource', () => {
  it('returns null for empty', () => {
    expect(guessSource('')).toBeNull()
    expect(guessSource(null)).toBeNull()
  })

  it('detects douyin', () => {
    expect(guessSource('https://v.douyin.com/abc123/')).toBe('douyin')
    expect(guessSource('https://www.douyin.com/video/9876')).toBe('douyin')
  })

  it('detects zhihu', () => {
    expect(guessSource('https://www.zhihu.com/question/1')).toBe('zhihu')
    expect(guessSource('https://zhuanlan.zhihu.com/p/123')).toBe('zhihu')
  })

  it('detects xhs', () => {
    expect(guessSource('https://www.xiaohongshu.com/explore/abc')).toBe('xhs')
    expect(guessSource('https://xhslink.com/a/abc')).toBe('xhs')
  })

  it('detects wechat', () => {
    expect(guessSource('https://mp.weixin.qq.com/s/XXX')).toBe('wechat')
  })

  it('detects bilibili', () => {
    expect(guessSource('https://www.bilibili.com/video/BV1')).toBe('bilibili')
    expect(guessSource('https://b23.tv/abc')).toBe('bilibili')
  })

  it('returns null for unknown domains', () => {
    expect(guessSource('https://random-blog.com/post/1')).toBeNull()
  })

  it('returns null for invalid urls', () => {
    expect(guessSource('not-a-url')).toBeNull()
  })
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run tests/utils/urlDetect.test.js`
Expected: FAIL

- [ ] **Step 3: 写实现**

Write `src/utils/urlDetect.js`:
```javascript
const URL_RE = /(https?:\/\/\S+)/
const TRAIL_PUNCT = /[，。、；！？)）】」]+$/

export function extractFirstUrl(text) {
  if (!text || typeof text !== 'string') return null
  const m = text.match(URL_RE)
  if (!m) return null
  return m[1].replace(TRAIL_PUNCT, '')
}

const SOURCE_MAP = [
  { match: ['douyin.com'], source: 'douyin' },
  { match: ['zhihu.com'], source: 'zhihu' },
  { match: ['xiaohongshu.com', 'xhslink.com'], source: 'xhs' },
  { match: ['mp.weixin.qq.com'], source: 'wechat' },
  { match: ['bilibili.com', 'b23.tv'], source: 'bilibili' },
]

export function guessSource(url) {
  if (!url || typeof url !== 'string') return null
  let hostname
  try {
    hostname = new URL(url).hostname.toLowerCase()
  } catch {
    return null
  }
  for (const { match, source } of SOURCE_MAP) {
    if (match.some((d) => hostname === d || hostname.endsWith('.' + d))) {
      return source
    }
  }
  return null
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run tests/utils/urlDetect.test.js`
Expected: 14 个测试全过。

- [ ] **Step 5: 让 useInbox 使用 urlDetect**

Modify `src/stores/useInbox.js` — 在文件顶部加 import：
```javascript
import { extractFirstUrl, guessSource } from '@/utils/urlDetect'
```

删除内部的 `URL_RE` 和 `extractUrl`，在 `addItem` 里替换：
```javascript
addItem({ content, url }) {
  const finalUrl = url ?? extractFirstUrl(content)
  const finalSource = finalUrl ? guessSource(finalUrl) : undefined
  const now = Date.now()
  const it = {
    id: genId(),
    content,
    url: finalUrl || undefined,
    status: 'pending',
    tags: [],
    source: finalSource,
    review: undefined,
    createdAt: now,
    updatedAt: now,
  }
  this.items.unshift(it)
  this.persist()
  return it
},
```

- [ ] **Step 6: 复跑所有 inbox 测试确保没回归**

Run: `npx vitest run tests/stores/useInbox.test.js tests/utils/urlDetect.test.js`
Expected: 27 个测试全过（inbox 13 + urlDetect 14）。

- [ ] **Step 7: Commit**

```bash
git add src/utils/urlDetect.js tests/utils/urlDetect.test.js src/stores/useInbox.js
git commit -m "feat(P5): urlDetect utils + integrate into useInbox.addItem"
```

---

## Task 27: InboxCard.vue 折叠态

**Files:**
- Create: `src/components/inbox/InboxCard.vue`

- [ ] **Step 1: 创建 InboxCard.vue**

Write `src/components/inbox/InboxCard.vue`:
```vue
<template>
  <article
    class="ic-card"
    :class="{ 'is-selected': selected, 'is-dragging': dragging }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click.self="$emit('open', item.id)"
  >
    <div class="ic-head">
      <Checkbox
        :model-value="selected"
        binary
        @update:model-value="(v) => $emit('select', item.id, v)"
        @click.stop
        :pt="{ root: 'ic-check', box: 'ic-check-box' }"
      />
      <div class="ic-excerpt" @click="$emit('open', item.id)">{{ item.content }}</div>
    </div>

    <a
      v-if="item.url"
      class="ic-url"
      :href="item.url"
      target="_blank"
      rel="noopener noreferrer"
      @click.stop
    >
      <i class="fa-solid fa-link" />
      <span>{{ domain }}</span>
    </a>

    <div class="ic-meta">
      <span class="ic-time">{{ timeAgo(item.createdAt) }}</span>
      <span v-for="t in item.tags" :key="t" class="ic-tag">#{{ t }}</span>
      <span v-if="item.source" class="ic-source">{{ sourceLabel }}</span>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import Checkbox from 'primevue/checkbox'
import { timeAgo } from '@/utils/time'

const props = defineProps({
  item: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})
const emit = defineEmits(['select', 'open', 'drag-start', 'drag-end'])

const dragging = ref(false)

const domain = computed(() => {
  if (!props.item.url) return ''
  try {
    return new URL(props.item.url).hostname.replace(/^www\./, '')
  } catch {
    return props.item.url
  }
})

const SOURCE_LABELS = {
  douyin: '抖音', zhihu: '知乎', xhs: '小红书',
  wechat: '微信', bilibili: 'B站', other: '其他',
}
const sourceLabel = computed(() => SOURCE_LABELS[props.item.source] || props.item.source)

function onDragStart(e) {
  dragging.value = true
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', props.item.id)
  emit('drag-start', props.item.id)
}
function onDragEnd() {
  dragging.value = false
  emit('drag-end', props.item.id)
}
</script>

<style scoped>
.ic-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 12px;
  cursor: grab;
  transition: border-color 0.15s, transform 0.15s, opacity 0.2s;
}
.ic-card:hover { border-color: var(--accent); }
.ic-card.is-selected { border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 20%, transparent); }
.ic-card.is-dragging { opacity: 0.4; cursor: grabbing; }

.ic-head { display: flex; gap: 8px; align-items: flex-start; }
.ic-excerpt {
  flex: 1;
  font-size: 13px;
  line-height: 1.4;
  color: var(--t1);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  cursor: pointer;
}

.ic-url {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--accent);
  margin-top: 8px;
  text-decoration: none;
}
.ic-url:hover { text-decoration: underline; }

.ic-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 10.5px;
  color: var(--t3);
}
.ic-time { font-variant-numeric: tabular-nums; }
.ic-tag {
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}
.ic-source {
  color: var(--t2);
  font-weight: 600;
}
</style>

<style>
/* Checkbox pt class（非 scoped） */
.ic-check {
  display: inline-flex;
  width: 16px;
  height: 16px;
  margin-top: 2px;
}
.ic-check-box {
  width: 16px;
  height: 16px;
  background: var(--bg);
  border: 1.5px solid var(--line);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  color: transparent;
}
.ic-check-box[data-p-highlight="true"] {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.ic-check-box::after {
  content: '✓';
  font-size: 11px;
  font-weight: 700;
}
</style>
```

- [ ] **Step 2: 目测（临时挂到 InboxView）**

Modify `src/views/InboxView.vue`:
```vue
<template>
  <div class="inbox-test">
    <h2>灵感收件箱（Task 27 card 目测）</h2>
    <button @click="addOne">加一条</button>
    <button @click="loadSeed">注入 seed 数据</button>
    <div class="card-demo">
      <InboxCard
        v-for="it in inbox.items"
        :key="it.id"
        :item="it"
        :selected="inbox.selectedIds.includes(it.id)"
        @select="(id, v) => { v ? inbox.selectedIds.push(id) : inbox.toggleSelect(id) }"
        @open="(id) => console.log('open', id)"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useInbox } from '@/stores/useInbox'
import { useWorkspace } from '@/stores/useWorkspace'
import InboxCard from '@/components/inbox/InboxCard.vue'

const inbox = useInbox()
const ws = useWorkspace()

onMounted(() => inbox.hydrate())

function addOne() {
  inbox.addItem({
    content: '测试灵感 ' + new Date().toLocaleTimeString() + ' https://v.douyin.com/example/',
  })
}

function loadSeed() {
  if (ws.inbox_items?.length > 0) {
    inbox.items = [...ws.inbox_items]
    inbox.persist()
  }
}
</script>

<style scoped>
.inbox-test { padding: 24px; }
.card-demo {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  margin-top: 20px;
}
</style>
```

Run: `npm run dev`
Expected: 进入 /inbox 点"注入 seed 数据"→ 4 张 seed 卡片渲染；点"加一条"→ 新卡片头插；checkbox 可勾选。

- [ ] **Step 3: Commit**

```bash
git add src/components/inbox/InboxCard.vue src/views/InboxView.vue
git commit -m "feat(P5): InboxCard folded view with drag/select/open + domain display"
```

---

## Task 28: InboxColumn.vue（含 drop 支持）

**Files:**
- Create: `src/components/inbox/InboxColumn.vue`

- [ ] **Step 1: 创建 InboxColumn.vue**

Write `src/components/inbox/InboxColumn.vue`:
```vue
<template>
  <section
    class="ic-col"
    :class="{ 'is-drop-hover': dropHover, [`col-${status}`]: true }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <header class="ic-col-head">
      <span class="ic-col-label">{{ label }}</span>
      <span class="ic-col-count">{{ items.length }}</span>
    </header>

    <div class="ic-col-body">
      <InboxCard
        v-for="it in items"
        :key="it.id"
        :item="it"
        :selected="selectedIds.includes(it.id)"
        @select="(id, v) => $emit('select', id, v)"
        @open="(id) => $emit('open', id)"
      />

      <div v-if="items.length === 0" class="ic-col-empty">
        {{ emptyText }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import InboxCard from './InboxCard.vue'

const props = defineProps({
  status: { type: String, required: true },
  items: { type: Array, required: true },
  selectedIds: { type: Array, default: () => [] },
})
const emit = defineEmits(['select', 'open', 'drop-item'])

const dropHover = ref(false)

const LABELS = {
  pending: '未处理', verifying: '验证中', done: '完成', archived: '舍弃',
}
const EMPTIES = {
  pending: 'Ctrl+K 记下灵感',
  verifying: '拖动卡片到这里',
  done: '完成后的收获会汇聚于此',
  archived: '',
}

const label = computed(() => LABELS[props.status] || props.status)
const emptyText = computed(() => EMPTIES[props.status] || '')

function onDragOver(e) {
  e.dataTransfer.dropEffect = 'move'
  dropHover.value = true
}
function onDragLeave() { dropHover.value = false }
function onDrop(e) {
  dropHover.value = false
  const id = e.dataTransfer.getData('text/plain')
  if (id) emit('drop-item', id, props.status)
}
</script>

<style scoped>
.ic-col {
  background: var(--surf);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  display: flex;
  flex-direction: column;
  min-height: 400px;
  transition: border-color 0.15s, background 0.15s;
}
.ic-col.is-drop-hover {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 5%, var(--surf));
}

.ic-col-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--line);
}
.ic-col-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--t2);
}
.ic-col-count {
  font-size: 11px;
  font-weight: 700;
  color: var(--t3);
  background: var(--bg);
  padding: 2px 8px;
  border-radius: 99px;
  min-width: 24px;
  text-align: center;
}

.ic-col.col-pending .ic-col-label { color: var(--accent); }
.ic-col.col-verifying .ic-col-label { color: #f5a623; }
.ic-col.col-done .ic-col-label { color: #4ade80; }
.ic-col.col-archived .ic-col-label { color: var(--t3); }

.ic-col-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ic-col-empty {
  color: var(--t3);
  font-size: 11px;
  text-align: center;
  padding: 30px 10px;
  border: 1px dashed var(--line);
  border-radius: var(--r);
  margin-top: 8px;
}
</style>
```

- [ ] **Step 2: Commit（先不挂到 view，Task 29 一并集成）**

```bash
git add src/components/inbox/InboxColumn.vue
git commit -m "feat(P5): InboxColumn with drop zone + empty state"
```

---

## Task 29: InboxBoard.vue 四列布局 + 工具栏壳

**Files:**
- Create: `src/components/inbox/InboxBoard.vue`
- Modify: `src/views/InboxView.vue`（接入 Board）

- [ ] **Step 1: 创建 InboxBoard.vue**

Write `src/components/inbox/InboxBoard.vue`:
```vue
<template>
  <div class="ic-board">
    <header class="ic-toolbar">
      <div class="ic-toolbar-left">
        <h2 class="ic-title">灵感收件箱</h2>
        <span class="ic-total">共 {{ inbox.items.length }} 条</span>
      </div>
      <div class="ic-toolbar-right">
        <!-- Task 30-33 会在这里插入搜索 / 过滤 / 排序 / 批量 / 新建 -->
        <button class="ic-new" @click="triggerCapture">
          <i class="fa-solid fa-plus" />
          <span>新灵感</span>
          <kbd>⌘K</kbd>
        </button>
      </div>
    </header>

    <div class="ic-columns">
      <InboxColumn
        v-for="st in STATUSES"
        :key="st"
        :status="st"
        :items="grouped[st] || []"
        :selected-ids="inbox.selectedIds"
        @select="onSelect"
        @open="onOpen"
        @drop-item="onDropItem"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useInbox } from '@/stores/useInbox'
import InboxColumn from './InboxColumn.vue'

const inbox = useInbox()

const STATUSES = ['pending', 'verifying', 'done', 'archived']

const grouped = computed(() => {
  const map = { pending: [], verifying: [], done: [], archived: [] }
  for (const it of inbox.filteredItems) {
    ;(map[it.status] || (map[it.status] = [])).push(it)
  }
  return map
})

function onSelect(id, v) {
  if (v) {
    if (!inbox.selectedIds.includes(id)) inbox.selectedIds.push(id)
  } else {
    inbox.selectedIds = inbox.selectedIds.filter((x) => x !== id)
  }
}
function onOpen(id) {
  // Task 37 / Batch 3 Task P7 接 Edit Dialog
  window.dispatchEvent(new CustomEvent('fs1:inbox-open', { detail: id }))
}
function onDropItem(id, targetStatus) {
  inbox.updateStatus(id, targetStatus)
}
function triggerCapture() {
  window.dispatchEvent(new CustomEvent('fs1:open-capture'))
}
</script>

<style scoped>
.ic-board {
  padding: 20px;
  height: calc(100vh - 52px);
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.ic-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.ic-toolbar-left { display: flex; align-items: baseline; gap: 12px; }
.ic-title { font-size: 18px; font-weight: 800; margin: 0; color: var(--t1); }
.ic-total { font-size: 12px; color: var(--t3); }

.ic-toolbar-right { display: flex; align-items: center; gap: 8px; }
.ic-new {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 7px 12px;
  border-radius: var(--r);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}
.ic-new:hover { transform: scale(1.04); }
.ic-new kbd {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 10px;
  font-family: inherit;
}

.ic-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  overflow-y: auto;
  min-height: 0;
}
</style>
```

- [ ] **Step 2: 重写 InboxView.vue**

Overwrite `src/views/InboxView.vue`:
```vue
<template>
  <InboxBoard />
</template>

<script setup>
import { onMounted } from 'vue'
import InboxBoard from '@/components/inbox/InboxBoard.vue'
import { useInbox } from '@/stores/useInbox'
import { useWorkspace } from '@/stores/useWorkspace'

const inbox = useInbox()
const ws = useWorkspace()

onMounted(async () => {
  await ws.hydrate()  // 确保 seed 被加载到 workspace
  inbox.hydrate()
  // 若 inbox 为空，从 seed 注入
  if (inbox.items.length === 0 && ws.inbox_items?.length > 0) {
    inbox.items = [...ws.inbox_items]
    inbox.persist()
  }
})
</script>
```

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected: 进入 `/inbox` 看到 4 列，seed 数据按 status 分布到 4 列：pending 1、verifying 1、done 1、archived 1。点"新灵感"按钮触发 `fs1:open-capture` 事件（控制台 listen 验证）。

- [ ] **Step 4: Commit**

```bash
git add src/components/inbox/InboxBoard.vue src/views/InboxView.vue
git commit -m "feat(P5): InboxBoard 4-column layout with grouped items + toolbar stub"
```

---

## Task 30: 搜索框 + debounce

**Files:**
- Modify: `src/components/inbox/InboxBoard.vue`

- [ ] **Step 1: 在 toolbar 加搜索 input**

Modify `src/components/inbox/InboxBoard.vue`:

在 `<div class="ic-toolbar-right">` 里，**在 `<button class="ic-new">` 之前**插入：
```vue
<div class="ic-search">
  <i class="fa-solid fa-search" />
  <input
    v-model="localSearch"
    placeholder="搜索内容、链接、标签……"
    @input="onSearchInput"
  />
  <button v-if="localSearch" class="ic-search-clear" @click="clearSearch">
    <i class="fa-solid fa-times" />
  </button>
</div>
```

在 script 区加：
```javascript
import { ref } from 'vue'
const localSearch = ref(inbox.search)
let searchTimer = null
function onSearchInput() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    inbox.search = localSearch.value
  }, 300)
}
function clearSearch() {
  localSearch.value = ''
  inbox.search = ''
}
```

- [ ] **Step 2: 追加 CSS**

在 scoped style 末尾：
```css
.ic-search {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 4px 10px;
  min-width: 220px;
}
.ic-search i { color: var(--t3); font-size: 11px; }
.ic-search input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--t1);
  font-size: 12px;
  padding: 4px 0;
}
.ic-search input::placeholder { color: var(--t3); }
.ic-search-clear {
  background: none;
  border: none;
  color: var(--t3);
  cursor: pointer;
  font-size: 10px;
  padding: 2px;
}
.ic-search-clear:hover { color: var(--t1); }
```

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected: 工具栏左侧出现搜索框，输入 "番茄" 应过滤出 seed-i1；×按钮清空；300ms debounce 体感正常。

- [ ] **Step 4: Commit**

```bash
git add src/components/inbox/InboxBoard.vue
git commit -m "feat(P5): inbox search input with debounce"
```

---

## Task 31: 标签过滤（PrimeVue MultiSelect）

**Files:**
- Modify: `src/components/inbox/InboxBoard.vue`

- [ ] **Step 1: 加 MultiSelect**

Modify `src/components/inbox/InboxBoard.vue`:

在搜索框之后、new 按钮之前加：
```vue
<MultiSelect
  :model-value="inbox.filterTags"
  :options="tagOptions"
  placeholder="标签"
  display="chip"
  class="ic-tag-filter"
  :pt="{ root: 'ic-tag-filter-root', panel: 'ic-tag-filter-panel' }"
  @update:model-value="(v) => inbox.filterTags = v"
/>
```

script 区加：
```javascript
import MultiSelect from 'primevue/multiselect'
import { computed } from 'vue'
const tagOptions = computed(() => inbox.allTags)
```

- [ ] **Step 2: 追加 CSS**

scoped style 末尾：
```css
.ic-tag-filter { min-width: 140px; }
</style>

<style>
.ic-tag-filter-root {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 4px 10px;
  cursor: pointer;
  font-size: 12px;
  color: var(--t1);
  display: inline-flex;
  align-items: center;
}
.ic-tag-filter-panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 4px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.ic-tag-filter-panel [data-pc-section="header"] { padding: 6px; }
.ic-tag-filter-panel [data-pc-section="option"] {
  padding: 6px 10px;
  cursor: pointer;
  font-size: 12px;
  color: var(--t1);
  border-radius: 4px;
}
.ic-tag-filter-panel [data-pc-section="option"]:hover {
  background: color-mix(in srgb, var(--accent) 10%, transparent);
}
```

注意：如果第二块 `<style>` 和 Task 27/31 里已存在的 non-scoped `<style>` 冲突，只保留一个 non-scoped `<style>` 块并合并样式。

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected: 工具栏出现"标签"多选，点击展开 seed 数据里的标签池（副业/写作/效率/工具/睡眠/专注）；选"副业"只显示含该标签的卡片；多选 OR 逻辑。

- [ ] **Step 4: Commit**

```bash
git add src/components/inbox/InboxBoard.vue
git commit -m "feat(P5): inbox tag filter via PrimeVue MultiSelect (OR logic)"
```

---

## Task 32: 排序下拉

**Files:**
- Modify: `src/components/inbox/InboxBoard.vue`

- [ ] **Step 1: 加排序 Select**

Modify `src/components/inbox/InboxBoard.vue`:

在 MultiSelect 后加：
```vue
<Select
  :model-value="sortValue"
  :options="sortOptions"
  option-label="label"
  option-value="value"
  class="ic-sort"
  :pt="{ root: 'ic-sort-root' }"
  @update:model-value="onSortChange"
/>
```

script 区加：
```javascript
import Select from 'primevue/select'
const sortOptions = [
  { label: '最新', value: 'createdAt:desc' },
  { label: '最早', value: 'createdAt:asc' },
  { label: '最近更新', value: 'updatedAt:desc' },
  { label: '按来源', value: 'source:asc' },
]
const sortValue = computed(() => `${inbox.sortBy}:${inbox.sortOrder}`)
function onSortChange(v) {
  const [by, order] = v.split(':')
  inbox.sortBy = by
  inbox.sortOrder = order
}
```

- [ ] **Step 2: 追加 CSS（并入已有 non-scoped style）**

```css
.ic-sort-root {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 4px 10px;
  cursor: pointer;
  font-size: 12px;
  color: var(--t1);
}
```

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected: 工具栏出现排序下拉，默认"最新"；改"最早"卡片顺序倒转；其他选项生效。

- [ ] **Step 4: Commit**

```bash
git add src/components/inbox/InboxBoard.vue
git commit -m "feat(P5): inbox sort dropdown (createdAt/updatedAt/source)"
```

---

## Task 33: 批量操作工具栏

**Files:**
- Modify: `src/components/inbox/InboxBoard.vue`

- [ ] **Step 1: 新增批量工具栏条**

Modify `src/components/inbox/InboxBoard.vue`:

在 `</header>` 之后、`<div class="ic-columns">` 之前加：
```vue
<div v-if="inbox.selectedIds.length > 0" class="ic-batch-bar">
  <span class="ic-batch-count">已选 {{ inbox.selectedIds.length }} 条</span>
  <button class="ic-batch-btn" @click="inbox.selectAllVisible()">全选可见</button>
  <button class="ic-batch-btn" @click="inbox.clearSelection()">取消</button>
  <span class="ic-batch-spacer" />
  <button class="ic-batch-btn done-btn" @click="batchDone">批量完成</button>
  <button class="ic-batch-btn arc-btn" @click="batchArchive">批量舍弃</button>
</div>
```

script 区加：
```javascript
function batchDone() {
  inbox.batchUpdateStatus([...inbox.selectedIds], 'done')
  inbox.clearSelection()
}
function batchArchive() {
  inbox.batchUpdateStatus([...inbox.selectedIds], 'archived')
  inbox.clearSelection()
}
```

- [ ] **Step 2: 追加 CSS**

scoped style 末尾：
```css
.ic-batch-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: var(--r);
  margin-bottom: 12px;
  font-size: 12px;
}
.ic-batch-count {
  color: var(--accent);
  font-weight: 700;
}
.ic-batch-spacer { flex: 1; }
.ic-batch-btn {
  background: var(--card);
  border: 1px solid var(--line);
  color: var(--t1);
  padding: 5px 10px;
  border-radius: var(--r);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.ic-batch-btn:hover { border-color: var(--accent); }
.ic-batch-btn.done-btn { color: #4ade80; border-color: #4ade8044; }
.ic-batch-btn.done-btn:hover { background: #4ade8022; }
.ic-batch-btn.arc-btn { color: var(--t2); }
```

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected: 勾选 2 张卡片 → 顶部出现批量工具栏 → 点"批量完成"→ 2 张卡进入 done 列；选择被清空；批量栏消失。

- [ ] **Step 4: Commit**

```bash
git add src/components/inbox/InboxBoard.vue
git commit -m "feat(P5): inbox batch toolbar with select-all / batch done / archive"
```

---

## Task 34: P5 联合目测回归 + 拖拽浏览器交叉验证

**Files:**
- None（只验证）

- [ ] **Step 1: 浏览器 3 家回归**

Run: `npm run dev`
分别在 Chrome / Firefox / Edge 打开 `/inbox`，逐项验证：

Checklist：
- [ ] seed 4 条卡片正确分布在 4 列（1+1+1+1）
- [ ] 新灵感按钮 → 控制台 `fs1:open-capture` 事件触发（Batch 3 接真实 Dialog）
- [ ] **拖拽**：pending 列的卡拖到 verifying 列 → 松手卡片进入 verifying 列；刷新页面数据保留
- [ ] 从 verifying 拖回 pending → 正确切换
- [ ] 拖到 done 列 → 切 done
- [ ] 拖到 archived 列 → 切 archived
- [ ] 拖过程 column 有高亮 `.is-drop-hover`；dragend 复位
- [ ] 搜索 "番茄" → 只剩 seed-i1
- [ ] 清空搜索 → 恢复 4 条
- [ ] 标签过滤选"写作" → 只剩 seed-i2
- [ ] 排序改"最早" → seed-i4 排第一
- [ ] 勾选 2 条 → 批量栏出现 → 批量舍弃 → 全进 archived

- [ ] **Step 2: 跑全量测试**

Run: `npx vitest run`
Expected: 全部通过（累计约 59 个：config 7 + storage 6 + useMbti 5 + useWorkspace 8 + time 6 + useInbox 13 + urlDetect 14）

- [ ] **Step 3: Commit 空标**

```bash
git commit --allow-empty -m "chore(P5): inbox core regression pass (drag + search + filter + sort + batch)"
```

---

# Batch 2 结束 · 进度检查

完成 Task 10-34 共 25 个 Task，覆盖 Phase 4 + Phase 5。

**可验证成果**：
- 工作台（`/`）：DailySpark 横幅 + Energy / Journal / Threads (v2-3) / DesignFlow 左列；Mascot / QuadrantTodo (v2-6/v2-7) / FlashNotes / SyncStatus 右列
- 收件箱（`/inbox`）：四列 Kanban + 搜索 + 标签过滤 + 排序 + 批量操作 + 拖拽跨列
- 测试累计约 59 个，全部通过
- 所有数据持久化到 `fs1_*` localStorage

**下批（Batch 3）预告**：P6 快捕 Dialog + P7 卡片编辑 + P8 正反馈系统，约 20 个 Task。

---

# Phase 6 · 全局快捕 Dialog + Ctrl+K 热键

## Task 35: useHotkey composable（含 TDD）

**Files:**
- Create: `src/composables/useHotkey.js`
- Create: `tests/composables/useHotkey.test.js`

- [ ] **Step 1: 写失败测试**

Write `tests/composables/useHotkey.test.js`:
```javascript
import { describe, it, expect, vi, afterEach } from 'vitest'
import { matchHotkey } from '@/composables/useHotkey'

describe('matchHotkey', () => {
  it('matches Ctrl+K on non-mac', () => {
    const ev = { key: 'k', ctrlKey: true, metaKey: false, shiftKey: false, altKey: false }
    expect(matchHotkey(ev, 'mod+k')).toBe(true)
  })

  it('matches Cmd+K on mac', () => {
    const ev = { key: 'k', ctrlKey: false, metaKey: true, shiftKey: false, altKey: false }
    expect(matchHotkey(ev, 'mod+k')).toBe(true)
  })

  it('ignores Ctrl+K+Shift when pattern is mod+k', () => {
    const ev = { key: 'k', ctrlKey: true, shiftKey: true, metaKey: false, altKey: false }
    expect(matchHotkey(ev, 'mod+k')).toBe(false)
  })

  it('matches case-insensitive key', () => {
    const ev = { key: 'K', ctrlKey: true, metaKey: false, shiftKey: false, altKey: false }
    expect(matchHotkey(ev, 'mod+k')).toBe(true)
  })

  it('does not match plain k without modifier', () => {
    const ev = { key: 'k', ctrlKey: false, metaKey: false, shiftKey: false, altKey: false }
    expect(matchHotkey(ev, 'mod+k')).toBe(false)
  })
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run tests/composables/useHotkey.test.js`
Expected: FAIL

- [ ] **Step 3: 写实现**

Write `src/composables/useHotkey.js`:
```javascript
import { onMounted, onBeforeUnmount } from 'vue'

export function matchHotkey(event, pattern) {
  const parts = pattern.toLowerCase().split('+')
  const keyPart = parts[parts.length - 1]
  const wantShift = parts.includes('shift')
  const wantAlt = parts.includes('alt')
  const wantMod = parts.includes('mod') || parts.includes('ctrl') || parts.includes('meta')

  const hasMod = event.ctrlKey || event.metaKey
  if (wantMod !== hasMod) return false
  if (event.shiftKey !== wantShift) return false
  if (event.altKey !== wantAlt) return false
  if (String(event.key).toLowerCase() !== keyPart) return false
  return true
}

export function useHotkey(pattern, handler, options = {}) {
  const { preventDefault = true, stopPropagation = false } = options

  function onKey(ev) {
    if (!matchHotkey(ev, pattern)) return
    if (preventDefault) ev.preventDefault()
    if (stopPropagation) ev.stopPropagation()
    handler(ev)
  }

  onMounted(() => window.addEventListener('keydown', onKey))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run tests/composables/useHotkey.test.js`
Expected: 5 个测试全过。

- [ ] **Step 5: Commit**

```bash
git add src/composables/useHotkey.js tests/composables/useHotkey.test.js
git commit -m "feat(P6): useHotkey composable with matchHotkey pattern matcher"
```

---

## Task 36: QuickCaptureDialog 组件

**Files:**
- Create: `src/components/inbox/QuickCaptureDialog.vue`
- Modify: `src/App.vue`（挂载全局 Dialog + 绑 Ctrl+K + 监听 fs1:open-capture）

- [ ] **Step 1: 创建 QuickCaptureDialog.vue**

Write `src/components/inbox/QuickCaptureDialog.vue`:
```vue
<template>
  <Dialog
    v-model:visible="open"
    modal
    :dismissable-mask="true"
    :closable="false"
    :pt="{
      root: 'qc-root',
      mask: 'qc-mask',
    }"
  >
    <div class="qc-dialog">
      <header class="qc-head">
        <div class="qc-title">
          <i class="fa-solid fa-lightbulb" />
          <span>新灵感</span>
        </div>
        <button class="qc-close" @click="open = false" aria-label="关闭">
          <i class="fa-solid fa-times" />
        </button>
      </header>
      <textarea
        ref="textareaRef"
        v-model="text"
        class="qc-input"
        placeholder="粘贴链接或记下想法……"
        rows="4"
        @keydown="onKey"
      />
      <div v-if="detectedUrl" class="qc-url-hint">
        <i class="fa-solid fa-link" />
        <span>已识别链接: {{ detectedUrl }}</span>
      </div>
      <footer class="qc-foot">
        <span class="qc-hint">Enter 保存 · Esc 取消 · Shift+Enter 换行</span>
        <button class="qc-save" :disabled="!text.trim()" @click="save">
          保存
        </button>
      </footer>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useInbox } from '@/stores/useInbox'
import { extractFirstUrl } from '@/utils/urlDetect'

const open = defineModel('open', { type: Boolean, default: false })
const text = ref('')
const textareaRef = ref(null)

const inbox = useInbox()
const toast = useToast()
const router = useRouter()

const detectedUrl = computed(() => extractFirstUrl(text.value))

watch(open, async (v) => {
  if (v) {
    text.value = ''
    await nextTick()
    textareaRef.value?.focus()
  }
})

function onKey(e) {
  if (e.key === 'Escape') {
    open.value = false
  } else if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    save()
  }
}

function save() {
  const content = text.value.trim()
  if (!content) return
  const onInboxPage = router.currentRoute.value.name === 'inbox'
  inbox.addItem({ content })
  open.value = false
  toast.add({
    severity: 'success',
    summary: '已入箱',
    detail: onInboxPage ? undefined : '点击查看收件箱',
    life: 3000,
  })
}
</script>

<style>
/* PrimeVue Dialog 的 mask + root 是 portal 到 body，需要 non-scoped */
.qc-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  z-index: 999;
}
.qc-root {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  width: 560px;
  max-width: 90vw;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}
</style>

<style scoped>
.qc-dialog {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px 14px;
}
.qc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.qc-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: var(--accent);
}
.qc-close {
  background: none;
  border: none;
  color: var(--t3);
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
}
.qc-close:hover { color: var(--t1); }

.qc-input {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 12px 14px;
  color: var(--t1);
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
  min-height: 100px;
}
.qc-input:focus { border-color: var(--accent); }

.qc-url-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  color: var(--accent);
  padding: 5px 10px;
  border-radius: var(--r);
  font-size: 12px;
  font-weight: 600;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.qc-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
  border-top: 1px solid var(--line);
  padding-top: 12px;
}
.qc-hint {
  font-size: 11px;
  color: var(--t3);
}
.qc-save {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 7px 16px;
  border-radius: var(--r);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
}
.qc-save:hover:not(:disabled) { transform: scale(1.04); }
.qc-save:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
```

- [ ] **Step 2: 在 App.vue 挂全局 Dialog + 绑 Ctrl+K**

Modify `src/App.vue`:
```vue
<template>
  <div class="app">
    <TopBar />
    <main class="main">
      <RouterView />
    </main>
    <QuickCaptureDialog v-model:open="captureOpen" />
    <Toast position="bottom-right" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import TopBar from '@/components/layout/TopBar.vue'
import QuickCaptureDialog from '@/components/inbox/QuickCaptureDialog.vue'
import { useMbti } from '@/stores/useMbti'
import { useWorkspace } from '@/stores/useWorkspace'
import { useInbox } from '@/stores/useInbox'
import { useHotkey } from '@/composables/useHotkey'

const mbti = useMbti()
const ws = useWorkspace()
const inbox = useInbox()
const captureOpen = ref(false)

onMounted(async () => {
  mbti.init()
  await ws.hydrate()
  inbox.hydrate()
  if (inbox.items.length === 0 && ws.inbox_items?.length > 0) {
    inbox.items = [...ws.inbox_items]
    inbox.persist()
  }
})

useHotkey('mod+k', () => { captureOpen.value = true })

function onExternalOpen() { captureOpen.value = true }
onMounted(() => window.addEventListener('fs1:open-capture', onExternalOpen))
onBeforeUnmount(() => window.removeEventListener('fs1:open-capture', onExternalOpen))
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: grid;
  grid-template-rows: 52px 1fr;
}
.main { overflow: auto; }
</style>

<style>
:deep(.p-toast) { position: fixed; bottom: 24px; right: 24px; z-index: 9999; }
:deep(.p-toast-message) {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 10px 14px;
  color: var(--t1);
  margin-bottom: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
</style>
```

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected:
- 任意页面按 **Ctrl+K** → Dialog 打开、textarea autofocus
- 粘贴含 URL 的文本 → "已识别链接" 行出现
- Enter → Dialog 关闭 + 右下角 toast "已入箱"
- Shift+Enter 在 textarea 内换行（不保存）
- Esc → 关闭
- 点击 FlashNotes 上的"新灵感 ⌘K"按钮 → 同样打开 Dialog（通过 fs1:open-capture 事件）
- 点击 InboxBoard 上的"新灵感"按钮 → 同样打开
- 进入 `/inbox` 后保存一条 → 新卡片立刻出现在"未处理"列顶部

- [ ] **Step 4: Commit**

```bash
git add src/components/inbox/QuickCaptureDialog.vue src/App.vue
git commit -m "feat(P6): QuickCaptureDialog with Ctrl+K hotkey + URL auto-detect + toast"
```

---

## Task 37: 浏览器热键冲突验证 + README 补说明

**Files:**
- Create: `README.md`（如果不存在）或 Modify

- [ ] **Step 1: Chrome 冲突验证**

Run: `npm run dev`
在 Chrome 打开 `/`，地址栏失焦（点一下页面空白处），按 Ctrl+K → 期望：Dialog 打开（不是 Chrome 的地址栏 site search）。

已知：当焦点在 Chrome 地址栏时 Chrome 会吞 Ctrl+K，这是浏览器原生行为，用 preventDefault 改不了（事件没到页面）。在 README 里提一句即可。

- [ ] **Step 2: 补 README**

Check if README.md exists, then update or create:

Read existing `README.md` first. If it's a minimal 5-10 line file (likely), overwrite with:

```markdown
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
- `fs1_todo_collapsed`：四象限是否折叠
- `fs1_daily_spark`：当日灵感语录索引
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README with hotkeys + directory overview"
```

---

# Phase 7 · 卡片编辑 Dialog + 状态切换 + 删除

## Task 38: InboxEditDialog 组件

**Files:**
- Create: `src/components/inbox/InboxEditDialog.vue`
- Modify: `src/App.vue`（挂全局 Dialog + 监听 fs1:inbox-open）

- [ ] **Step 1: 创建 InboxEditDialog.vue**

Write `src/components/inbox/InboxEditDialog.vue`:
```vue
<template>
  <Dialog
    v-model:visible="open"
    modal
    :dismissable-mask="true"
    :closable="false"
    :pt="{ root: 'ie-root', mask: 'ie-mask' }"
  >
    <div v-if="item" class="ie-dialog">
      <header class="ie-head">
        <div class="ie-title">
          <i class="fa-solid fa-pen" />
          <span>编辑灵感</span>
        </div>
        <div class="ie-head-actions">
          <ConfirmPopup />
          <button class="ie-del" @click="confirmDelete($event)">
            <i class="fa-solid fa-trash" />
            <span>删除</span>
          </button>
          <button class="ie-close" @click="open = false"><i class="fa-solid fa-times" /></button>
        </div>
      </header>

      <textarea v-model="form.content" class="ie-content" rows="4" placeholder="内容……" />

      <div class="ie-row">
        <label>链接</label>
        <input v-model="form.url" class="ie-input" placeholder="https://…" />
      </div>

      <div class="ie-row">
        <label>来源</label>
        <select v-model="form.source" class="ie-select">
          <option :value="undefined">（未设置）</option>
          <option value="douyin">抖音</option>
          <option value="zhihu">知乎</option>
          <option value="xhs">小红书</option>
          <option value="wechat">微信</option>
          <option value="bilibili">B站</option>
          <option value="other">其他</option>
        </select>
      </div>

      <div class="ie-row">
        <label>标签</label>
        <div class="ie-tags">
          <span v-for="(t, i) in form.tags" :key="i" class="ie-tag">
            #{{ t }}
            <button class="ie-tag-remove" @click="removeTag(i)"><i class="fa-solid fa-times" /></button>
          </span>
          <input
            v-model="newTag"
            class="ie-tag-input"
            placeholder="加标签（回车）"
            @keydown.enter.prevent="addTag"
          />
        </div>
      </div>

      <div class="ie-row">
        <label>复盘笔记</label>
        <textarea v-model="form.review" class="ie-review" rows="3" placeholder="（完成或舍弃时可补写）" />
      </div>

      <div class="ie-statuses">
        <button
          v-for="s in STATUSES"
          :key="s.value"
          class="ie-status-btn"
          :class="[`status-${s.value}`, { active: form.status === s.value }]"
          @click="setStatus(s.value, $event)"
        >
          {{ s.label }}
        </button>
      </div>

      <footer class="ie-foot">
        <span class="ie-hint">自动保存</span>
        <button class="ie-save" @click="save">保存并关闭</button>
      </footer>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import ConfirmPopup from 'primevue/confirmpopup'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useInbox } from '@/stores/useInbox'

const open = defineModel('open', { type: Boolean, default: false })
const props = defineProps({ itemId: { type: String, default: null } })
const emit = defineEmits(['status-change'])

const inbox = useInbox()
const confirm = useConfirm()
const toast = useToast()

const STATUSES = [
  { value: 'pending',   label: '未处理' },
  { value: 'verifying', label: '验证中' },
  { value: 'done',      label: '完成' },
  { value: 'archived',  label: '舍弃' },
]

const item = computed(() => inbox.items.find((i) => i.id === props.itemId))
const form = reactive({ content: '', url: '', source: undefined, tags: [], review: '', status: 'pending' })
const newTag = ref('')

// 当 Dialog 打开、item 变化时填充 form
watch([open, () => props.itemId], () => {
  if (open.value && item.value) {
    form.content = item.value.content
    form.url = item.value.url || ''
    form.source = item.value.source
    form.tags = [...(item.value.tags || [])]
    form.review = item.value.review || ''
    form.status = item.value.status
  }
}, { immediate: true })

function setStatus(newStatus, event) {
  const prev = form.status
  form.status = newStatus
  save({ skipClose: true })
  if (prev !== newStatus && event) {
    emit('status-change', { id: props.itemId, prev, next: newStatus, el: event.currentTarget, origin: { x: event.clientX, y: event.clientY } })
  }
}

function addTag() {
  const v = newTag.value.trim().replace(/^#/, '')
  if (!v) return
  if (!form.tags.includes(v)) form.tags.push(v)
  newTag.value = ''
  save({ skipClose: true })
}
function removeTag(i) {
  form.tags.splice(i, 1)
  save({ skipClose: true })
}

function save({ skipClose = false } = {}) {
  if (!item.value) return
  inbox.updateFields(props.itemId, {
    content: form.content,
    url: form.url || undefined,
    source: form.source || undefined,
    tags: [...form.tags],
    review: form.review || undefined,
    status: form.status,
  })
  if (!skipClose) open.value = false
}

function confirmDelete(event) {
  confirm.require({
    target: event.currentTarget,
    message: '确认删除这条灵感？',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      inbox.removeItem(props.itemId)
      open.value = false
      toast.add({ severity: 'info', summary: '已删除', life: 2000 })
    },
  })
}
</script>

<style>
.ie-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8vh;
  z-index: 999;
}
.ie-root {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  width: 600px;
  max-width: 92vw;
  max-height: 86vh;
  overflow-y: auto;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}
</style>

<style scoped>
.ie-dialog {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 20px;
}
.ie-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line);
}
.ie-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: var(--accent);
}
.ie-head-actions { display: inline-flex; gap: 8px; align-items: center; }

.ie-del {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0537a22;
  color: #f0537a;
  border: 1px solid #f0537a44;
  padding: 5px 10px;
  border-radius: var(--r);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}
.ie-del:hover { background: #f0537a33; }
.ie-close {
  background: none;
  border: none;
  color: var(--t3);
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
}
.ie-close:hover { color: var(--t1); }

.ie-content {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 10px 12px;
  color: var(--t1);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;
  outline: none;
}
.ie-content:focus { border-color: var(--accent); }

.ie-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.ie-row label {
  min-width: 72px;
  font-size: 11px;
  font-weight: 700;
  color: var(--t2);
  letter-spacing: 0.4px;
  padding-top: 8px;
  text-transform: uppercase;
}
.ie-input, .ie-select {
  flex: 1;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 7px 10px;
  color: var(--t1);
  font-family: inherit;
  font-size: 12px;
  outline: none;
}
.ie-input:focus, .ie-select:focus { border-color: var(--accent); }

.ie-tags {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 4px 6px;
  border: 1px solid var(--line);
  border-radius: var(--r);
  min-height: 32px;
  align-items: center;
}
.ie-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}
.ie-tag-remove {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  padding: 0;
  font-size: 9px;
  display: inline-flex;
  align-items: center;
}
.ie-tag-input {
  flex: 1;
  min-width: 90px;
  background: transparent;
  border: none;
  outline: none;
  color: var(--t1);
  font-size: 12px;
}

.ie-review {
  flex: 1;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 7px 10px;
  color: var(--t1);
  font-family: inherit;
  font-size: 12px;
  line-height: 1.5;
  resize: vertical;
  outline: none;
}
.ie-review:focus { border-color: var(--accent); }

.ie-statuses {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-top: 4px;
}
.ie-status-btn {
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--t2);
  padding: 7px 10px;
  border-radius: var(--r);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.ie-status-btn:hover { border-color: var(--accent); color: var(--t1); }
.ie-status-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.ie-status-btn.status-done.active { background: #4ade80; border-color: #4ade80; }
.ie-status-btn.status-archived.active { background: var(--t3); border-color: var(--t3); color: var(--t1); }
.ie-status-btn.status-verifying.active { background: #f5a623; border-color: #f5a623; }

.ie-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--line);
}
.ie-hint { font-size: 10px; color: var(--t3); }
.ie-save {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 7px 16px;
  border-radius: var(--r);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}
.ie-save:hover { opacity: 0.9; }
</style>
```

- [ ] **Step 2: 挂到 App.vue**

Modify `src/App.vue`:

template 加：
```vue
<InboxEditDialog v-model:open="editOpen" :item-id="editingId" @status-change="onEditStatusChange" />
```

script 加：
```javascript
import InboxEditDialog from '@/components/inbox/InboxEditDialog.vue'

const editOpen = ref(false)
const editingId = ref(null)

function onExternalEdit(e) {
  editingId.value = e.detail
  editOpen.value = true
}
onMounted(() => window.addEventListener('fs1:inbox-open', onExternalEdit))
onBeforeUnmount(() => window.removeEventListener('fs1:inbox-open', onExternalEdit))

function onEditStatusChange(payload) {
  // P8 将接 useReward.celebrate；此处先空 handler
  window.dispatchEvent(new CustomEvent('fs1:inbox-status-change', { detail: payload }))
}
```

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected:
- 进入 `/inbox` 点任一卡片（点 excerpt 区域） → Edit Dialog 打开，字段预填正确
- 改内容 → 点"保存并关闭" → 卡片内容更新
- 加标签 → 回车 → tag chip 出现
- 删标签 → chip 消失
- 切 source 下拉 → 保存反映
- 点状态按钮（如从"未处理"→"完成"）→ 立即切换，卡片移到 done 列
- 点删除 → ConfirmPopup → 确认后卡片消失 + toast
- 重新打开同一条 → 所有修改持久化

- [ ] **Step 4: Commit**

```bash
git add src/components/inbox/InboxEditDialog.vue src/App.vue
git commit -m "feat(P7): InboxEditDialog with full field editing + status switch + confirm delete"
```

---

## Task 39: P7 联合目测

**Files:**
- None

- [ ] **Step 1: 完整流程**

Run: `npm run dev`
Checklist：
- [ ] Ctrl+K → 写一条"测试灵感 https://v.douyin.com/x"→ Enter
- [ ] 新卡片出现在 `/inbox` 未处理列顶部，自动识别 url + source=douyin
- [ ] 点卡片 → Edit Dialog 打开，字段预填正确（url: https://..., source: 抖音）
- [ ] 添加标签 "测试"
- [ ] 切状态到"验证中"→ 卡片移到 verifying 列
- [ ] 切"完成"→ 卡片移到 done 列
- [ ] 再次点开该卡片 → 写一句复盘："效果不错"→ 保存并关闭
- [ ] 点删除 → 确认 → 卡片消失

- [ ] **Step 2: 跑全量测试**

Run: `npx vitest run`
Expected: 全部通过（累计约 64 个：Batch 2 的 59 + useHotkey 5）

- [ ] **Step 3: Commit**

```bash
git commit --allow-empty -m "chore(P7): edit dialog + status + delete flow regression pass"
```

---

# Phase 8 · 正反馈系统

## Task 40: praises.js + useReward composable（含 TDD）

**Files:**
- Create: `src/config/praises.js`
- Create: `src/composables/useReward.js`
- Create: `tests/composables/useReward.test.js`

- [ ] **Step 1: 创建 praises.js**

Write `src/config/praises.js`:
```javascript
// 30 句 ENFP 风格的完成赞美
export const PRAISES = [
  '漂亮！',
  '这种事你从不拖延。',
  'ENFP 的执行力被低估了。',
  '又搞定一个——你今天挺行。',
  '这就是你的节奏。',
  '动手了就赢了一半。',
  '还记得你不久前说过"试一下"吗？看吧。',
  '想到就做，这就是你最酷的地方。',
  '这条灵感没白记。',
  '真好，再来一个？',
  '你是那种会把事情做完的人。',
  '小小的完成，大大的自信。',
  '未来的你在偷偷感谢此刻的你。',
  '跟未来的你说声谢谢吧。',
  '这就是复利的开始。',
  '别停，势头正好。',
  '你正在证明给自己看。',
  '灵感 → 验证 → 行动，教科书级的闭环。',
  '这种感觉留住它。',
  '你的直觉果然对。',
  '说干就干，这是本能。',
  '今天的你比昨天走得更远了。',
  '完成一件是一件，积小胜为大胜。',
  '你在把"想到"变成"做到"——这是 ENFP 最难也最酷的事。',
  '继续！',
  '干得漂亮。',
  '诚实地说，挺棒的。',
  '真的，不骗你。',
  '这就是为什么值得相信你自己。',
  '你知道接下来该做什么。',
]
```

- [ ] **Step 2: 写失败测试**

Write `tests/composables/useReward.test.js`:
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import { useReward } from '@/composables/useReward'

describe('useReward', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    document.body.innerHTML = '<div id="burst-layer"></div>'
    // Mock Math.random to control praise probability
    vi.spyOn(Math, 'random')
  })

  it('burst() creates DOM particles in burst-layer', () => {
    const { burst } = useReward()
    burst({ x: 100, y: 100 }, 5)
    const layer = document.getElementById('burst-layer')
    expect(layer.children.length).toBe(5)
    for (const child of layer.children) {
      expect(child.classList.contains('burst-particle')).toBe(true)
    }
  })

  it('burst() caps particles at 20 even if asked for more', () => {
    const { burst } = useReward()
    burst({ x: 0, y: 0 }, 100)
    const layer = document.getElementById('burst-layer')
    expect(layer.children.length).toBeLessThanOrEqual(20)
  })

  it('burst() without burst-layer element is safe', () => {
    document.body.innerHTML = ''
    const { burst } = useReward()
    expect(() => burst({ x: 0, y: 0 }, 5)).not.toThrow()
  })

  it('celebrate() calls burst', () => {
    const { celebrate } = useReward()
    celebrate({ x: 50, y: 50 }, { burstCount: 3 })
    const layer = document.getElementById('burst-layer')
    expect(layer.children.length).toBe(3)
  })

  it('celebrate() with pulseEl adds is-celebrating class', async () => {
    const { celebrate } = useReward()
    const el = document.createElement('div')
    document.body.appendChild(el)
    celebrate({ x: 0, y: 0 }, { burstCount: 1, pulseEl: el })
    await nextTick()
    expect(el.classList.contains('is-celebrating')).toBe(true)
  })

  it('celebrate() with praise triggers when random < 0.3', () => {
    Math.random.mockReturnValue(0.1)
    const { celebrate } = useReward()
    const praiseCalls = []
    window.addEventListener('fs1:praise', (e) => praiseCalls.push(e.detail))
    celebrate({ x: 0, y: 0 }, { burstCount: 1, praise: true })
    expect(praiseCalls.length).toBe(1)
    expect(typeof praiseCalls[0].message).toBe('string')
  })

  it('celebrate() praise skipped when random >= 0.3', () => {
    Math.random.mockReturnValue(0.5)
    const { celebrate } = useReward()
    const praiseCalls = []
    window.addEventListener('fs1:praise', (e) => praiseCalls.push(e.detail))
    celebrate({ x: 0, y: 0 }, { burstCount: 1, praise: true })
    expect(praiseCalls.length).toBe(0)
  })
})
```

- [ ] **Step 3: 跑测试确认失败**

Run: `npx vitest run tests/composables/useReward.test.js`
Expected: FAIL

- [ ] **Step 4: 写实现**

Write `src/composables/useReward.js`:
```javascript
import { useMbti } from '@/stores/useMbti'
import { PRAISES } from '@/config/praises'

const MAX_CONCURRENT_PARTICLES = 60
const DEFAULT_BURST = 10
const PARTICLE_LIFETIME = 1200

function getLayer() {
  return document.getElementById('burst-layer')
}

function fireBurst(origin, count, particles) {
  const layer = getLayer()
  if (!layer) return
  const safeCount = Math.min(count, 20)
  while (layer.children.length > MAX_CONCURRENT_PARTICLES) {
    layer.removeChild(layer.firstChild)
  }
  for (let i = 0; i < safeCount; i++) {
    const el = document.createElement('span')
    el.className = 'burst-particle'
    el.textContent = particles[Math.floor(Math.random() * particles.length)]
    const angle = Math.random() * Math.PI * 2
    const dist = 60 + Math.random() * 90
    const dx = Math.cos(angle) * dist
    const dy = Math.sin(angle) * dist - 30
    const rot = (Math.random() - 0.5) * 720
    const dur = 900 + Math.random() * 500
    el.style.left = origin.x + 'px'
    el.style.top = origin.y + 'px'
    el.style.setProperty('--dx', dx + 'px')
    el.style.setProperty('--dy', dy + 'px')
    el.style.setProperty('--rot', rot + 'deg')
    el.style.setProperty('--dur', dur + 'ms')
    layer.appendChild(el)
    setTimeout(() => el.remove(), dur + 100)
  }
}

function firePulse(el) {
  if (!el) return
  el.classList.remove('is-celebrating')
  // 触发 reflow 以便 class 重新应用
  void el.offsetWidth
  el.classList.add('is-celebrating')
  setTimeout(() => el.classList.remove('is-celebrating'), 900)
}

function fireCheckmark(el) {
  if (!el) return
  el.classList.remove('is-checking')
  void el.offsetWidth
  el.classList.add('is-checking')
  setTimeout(() => el.classList.remove('is-checking'), 500)
}

function firePraise() {
  const msg = PRAISES[Math.floor(Math.random() * PRAISES.length)]
  window.dispatchEvent(new CustomEvent('fs1:praise', { detail: { message: msg } }))
}

export function useReward() {
  const mbti = useMbti()

  function burst(origin, count = DEFAULT_BURST) {
    fireBurst(origin, count, mbti.current.particles)
  }

  function celebrate(origin, options = {}) {
    const {
      burstCount = DEFAULT_BURST,
      pulseEl = null,
      checkEl = null,
      praise = false,
    } = options
    fireBurst(origin, burstCount, mbti.current.particles)
    if (pulseEl) firePulse(pulseEl)
    if (checkEl) fireCheckmark(checkEl)
    if (praise && Math.random() < 0.3) firePraise()
  }

  function countUp(el, from, to, duration = 600) {
    if (!el) return
    const start = performance.now()
    const diff = to - from
    function tick(now) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      el.textContent = Math.round(from + diff * eased)
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  return { burst, celebrate, countUp }
}
```

- [ ] **Step 5: 跑测试确认通过**

Run: `npx vitest run tests/composables/useReward.test.js`
Expected: 7 个测试通过。

- [ ] **Step 6: Commit**

```bash
git add src/config/praises.js src/composables/useReward.js tests/composables/useReward.test.js
git commit -m "feat(P8): useReward composable with burst/pulse/checkmark/praise + tests"
```

---

## Task 41: BurstLayer 组件 + 粒子 CSS

**Files:**
- Create: `src/components/common/BurstLayer.vue`
- Modify: `src/App.vue`（挂载 BurstLayer + pulse/checkmark 全局 CSS）

- [ ] **Step 1: 创建 BurstLayer.vue**

Write `src/components/common/BurstLayer.vue`:
```vue
<template>
  <div id="burst-layer" class="burst-layer" aria-hidden="true" />
</template>

<script setup></script>

<style>
/* 全局非 scoped，粒子由 useReward 动态插入 */
.burst-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  overflow: hidden;
}
.burst-particle {
  position: fixed;
  pointer-events: none;
  font-size: 22px;
  line-height: 1;
  will-change: transform, opacity;
  animation: burst-fly var(--dur, 1000ms) cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
  z-index: 9999;
}
@keyframes burst-fly {
  0%   { transform: translate(0, 0) scale(0.5); opacity: 0; }
  15%  { opacity: 1; }
  100% { transform: translate(var(--dx), var(--dy)) scale(1.1) rotate(var(--rot)); opacity: 0; }
}

/* is-celebrating pulse */
.is-celebrating {
  animation: pulse-out 0.9s cubic-bezier(0.25, 1, 0.5, 1);
}
@keyframes pulse-out {
  0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent); }
  100% { box-shadow: 0 0 0 14px transparent; }
}

/* is-checking for checkmark SVG */
.is-checking .cm-path {
  stroke-dashoffset: 0 !important;
  transition: stroke-dashoffset 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
```

- [ ] **Step 2: 挂到 App.vue**

Modify `src/App.vue`:

template 里加（在 main 之外，全局）：
```vue
<BurstLayer />
```

script 加：
```javascript
import BurstLayer from '@/components/common/BurstLayer.vue'
```

- [ ] **Step 3: 浏览器测试（临时触发）**

Run: `npm run dev`
打开控制台，粘贴：
```javascript
import('/src/composables/useReward.js').then(({ useReward }) => {
  const { celebrate } = useReward()
  celebrate({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, { burstCount: 15, praise: true })
})
```
Expected: 屏幕中心冒出 ~15 个 emoji 粒子（ENFP 就是🥚🌈⭐✨💥🎯等），向外飞散后淡出。

- [ ] **Step 4: Commit**

```bash
git add src/components/common/BurstLayer.vue src/App.vue
git commit -m "feat(P8): BurstLayer with particle + pulse + checkmark keyframes"
```

---

## Task 42: PraiseToast 组件

**Files:**
- Create: `src/components/common/PraiseToast.vue`
- Modify: `src/App.vue`（挂 PraiseToast 监听 fs1:praise）

- [ ] **Step 1: 创建 PraiseToast.vue**

Write `src/components/common/PraiseToast.vue`:
```vue
<template>
  <div class="praise-stack" aria-live="polite">
    <TransitionGroup name="praise">
      <div
        v-for="p in active"
        :key="p.id"
        class="praise-card"
      >
        <i class="fa-solid fa-sparkles" />
        <span>{{ p.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const active = ref([])
const LIFETIME = 2500
let counter = 0

function onPraise(e) {
  const id = ++counter
  active.value.push({ id, message: e.detail.message })
  setTimeout(() => {
    active.value = active.value.filter((p) => p.id !== id)
  }, LIFETIME)
}

onMounted(() => window.addEventListener('fs1:praise', onPraise))
onBeforeUnmount(() => window.removeEventListener('fs1:praise', onPraise))
</script>

<style scoped>
.praise-stack {
  position: fixed;
  left: 50%;
  top: 22%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
  z-index: 9997;
}
.praise-card {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--accent) 90%, black),
    var(--accent));
  color: #fff;
  padding: 10px 18px;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.3px;
  box-shadow: 0 10px 30px color-mix(in srgb, var(--accent) 40%, transparent);
  white-space: nowrap;
}
.praise-card i { font-size: 12px; opacity: 0.85; }

.praise-enter-active,
.praise-leave-active {
  transition: all 0.35s cubic-bezier(0.1, 0.8, 0.3, 1);
}
.praise-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.85);
}
.praise-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}
</style>
```

- [ ] **Step 2: 挂到 App.vue**

Modify `src/App.vue` — 加 import + template：
```javascript
import PraiseToast from '@/components/common/PraiseToast.vue'
```
template 里加 `<PraiseToast />`。

- [ ] **Step 3: 浏览器测试**

Run: `npm run dev`
控制台执行：
```javascript
window.dispatchEvent(new CustomEvent('fs1:praise', { detail: { message: '漂亮！' } }))
```
Expected: 屏幕上方中央出现 pill 形 toast "漂亮！"，带渐变色 + 阴影，2.5 秒后消失（过渡动画）。

- [ ] **Step 4: Commit**

```bash
git add src/components/common/PraiseToast.vue src/App.vue
git commit -m "feat(P8): PraiseToast stacked pills with accent gradient"
```

---

## Task 43: 接入 Inbox 状态切换 celebrate

**Files:**
- Modify: `src/components/inbox/InboxBoard.vue`（drop 事件 celebrate）
- Modify: `src/App.vue`（editDialog status-change celebrate）

- [ ] **Step 1: InboxBoard drop celebrate**

Modify `src/components/inbox/InboxBoard.vue`:

script 加：
```javascript
import { useReward } from '@/composables/useReward'
const reward = useReward()
```

改 `onDropItem` 为：
```javascript
function onDropItem(id, targetStatus) {
  const prev = inbox.items.find((i) => i.id === id)?.status
  inbox.updateStatus(id, targetStatus)
  // 拖拽 drop 事件没有 clientX/Y 的直接访问，用列中心估计
  // 更好做法：从 InboxColumn 发出来的 drop event 带 mouse position，再改事件签名
  // 这里简化：整个板中心
  const origin = { x: window.innerWidth / 2, y: window.innerHeight / 3 }
  const celebrateOpts = { burstCount: 12 }
  if (targetStatus === 'done') {
    celebrateOpts.burstCount = 15
    celebrateOpts.praise = true
  } else if (targetStatus === 'archived') {
    celebrateOpts.burstCount = 6
  }
  reward.celebrate(origin, celebrateOpts)
}
```

**修正**：为了让粒子从真正的 drop 位置飞出，改 InboxColumn 的 drop event 签名：

Modify `src/components/inbox/InboxColumn.vue`:

改 `onDrop`：
```javascript
function onDrop(e) {
  dropHover.value = false
  const id = e.dataTransfer.getData('text/plain')
  if (id) emit('drop-item', id, props.status, { x: e.clientX, y: e.clientY })
}
```

改 emit 声明：`defineEmits(['select', 'open', 'drop-item'])` 保持不变，但改消费者 InboxBoard.vue 的 `onDropItem` 为：
```javascript
function onDropItem(id, targetStatus, origin) {
  const celebrateOpts = { burstCount: 12 }
  if (targetStatus === 'done') { celebrateOpts.burstCount = 15; celebrateOpts.praise = true }
  else if (targetStatus === 'archived') celebrateOpts.burstCount = 6
  inbox.updateStatus(id, targetStatus)
  reward.celebrate(origin || { x: window.innerWidth / 2, y: window.innerHeight / 3 }, celebrateOpts)
}
```

template 里事件：
```vue
<InboxColumn
  ...
  @drop-item="onDropItem"
/>
```
（Vue 会自动把事件 arguments 按顺序传进，不需要改写）

- [ ] **Step 2: App.vue editDialog status-change celebrate**

Modify `src/App.vue`:

script 加：
```javascript
import { useReward } from '@/composables/useReward'
const reward = useReward()
```

改 `onEditStatusChange`:
```javascript
function onEditStatusChange(payload) {
  const celebrateOpts = { burstCount: 12, pulseEl: payload.el }
  if (payload.next === 'done') { celebrateOpts.burstCount = 15; celebrateOpts.praise = true }
  else if (payload.next === 'archived') celebrateOpts.burstCount = 6
  reward.celebrate(payload.origin, celebrateOpts)
}
```

- [ ] **Step 3: 目测**

Run: `npm run dev`
Expected:
- 拖卡片从 pending → verifying → 粒子从 drop 位置爆出（12 粒）
- 拖卡片 → done → 15 粒 + 有 30% 概率看到 praise toast
- 拖卡片 → archived → 6 粒（低调）
- 在 Edit Dialog 点状态按钮（未处理 → 完成）→ 按钮 pulse 发光 + 粒子 + 可能 praise

- [ ] **Step 4: Commit**

```bash
git add src/components/inbox/InboxBoard.vue src/components/inbox/InboxColumn.vue src/App.vue
git commit -m "feat(P8): celebrate on inbox status changes (drop + edit) with praise chance"
```

---

## Task 44: 接入 Workspace 模块 celebrate

**Files:**
- Modify: `src/components/workspace/ThreadsPanel.vue`（step-done / thread-complete celebrate）
- Modify: `src/components/workspace/QuadrantTodo.vue`（todo-done celebrate）
- Modify: `src/components/workspace/DesignFlowPanel.vue`（stage-advance celebrate）
- Modify: `src/views/DashboardView.vue`（把 emit 连起来）

- [ ] **Step 1: 让 Panels 自己调 celebrate**

最简做法：每个 Panel 自己 import useReward，自己 celebrate；不依赖父组件转发。

Modify `src/components/workspace/ThreadsPanel.vue`:

script 加：
```javascript
import { useReward } from '@/composables/useReward'
const reward = useReward()
```

修改 `toggleStep` 函数：
```javascript
function toggleStep(thread, idx, event) {
  const step = thread.steps[idx]
  const wasDone = step.done
  step.done = !step.done
  const doneCount = thread.steps.filter((s) => s.done).length
  const newPct = Math.round((doneCount / thread.steps.length) * 100)
  const wasComplete = thread.pct >= 100
  thread.pct = newPct
  ws.upsertThread({ ...thread })

  if (!wasDone) {
    const origin = { x: event.clientX, y: event.clientY }
    const stepEl = event.currentTarget
    const threadCard = stepEl.closest('.thread')

    if (!wasComplete && newPct >= 100) {
      // 100% 完成：大爆 + praise
      reward.celebrate(origin, { burstCount: 20, pulseEl: threadCard, praise: true })
    } else {
      reward.celebrate(origin, { burstCount: 8, pulseEl: stepEl })
    }
  }
}
```

可以删掉原来 `emit('step-done', ...)` 和 `emit('thread-complete', ...)` 以及 `defineEmits([...])`。

- [ ] **Step 2: QuadrantTodo celebrate**

Modify `src/components/workspace/QuadrantTodo.vue`:

script 加：
```javascript
import { useReward } from '@/composables/useReward'
const reward = useReward()
```

修改 `doneFromTooltip`:
```javascript
function doneFromTooltip(event) {
  const t = tooltipTodo.value
  if (!t) return
  ws.upsertTodo({ ...t, done: true })
  const origin = { x: event.clientX, y: event.clientY }
  const dotEl = matrixRef.value?.querySelector(`.q-dot:nth-child(${activeTodos.value.indexOf(t) + 1})`)
  reward.celebrate(origin, { burstCount: 8 })
  activeTooltipId.value = null
}
```

（删 emit 相关代码）

- [ ] **Step 3: DesignFlow celebrate**

Modify `src/components/workspace/DesignFlowPanel.vue`:

script 加：
```javascript
import { useReward } from '@/composables/useReward'
const reward = useReward()
```

修改 `advance`:
```javascript
function advance(targetIndex, event) {
  if (!project.value) return
  if (targetIndex <= project.value.stage) return
  if (targetIndex !== project.value.stage + 1) return
  ws.advanceProject(project.value.id)
  const origin = { x: event.clientX, y: event.clientY }
  reward.celebrate(origin, { burstCount: 10, pulseEl: event.currentTarget })
}
```

（删 emit 相关代码）

- [ ] **Step 4: 目测**

Run: `npm run dev`
Expected:
- 工作台点 thread 步骤勾选 → 8 粒子 + 步骤行 pulse
- 勾最后一个步骤把进度拉到 100% → 20 粒子 + 整卡 pulse + 可能 praise
- QuadrantTodo dot 悬浮 → tooltip → 点完成 → 8 粒子
- DesignFlow 点下一阶段 → 10 粒子 + 阶段 dot pulse
- 同页面快速多次触发不会堆叠 DOM（粒子上限 60）

- [ ] **Step 5: Commit**

```bash
git add src/components/workspace/ThreadsPanel.vue src/components/workspace/QuadrantTodo.vue src/components/workspace/DesignFlowPanel.vue
git commit -m "feat(P8): celebrate on thread steps + thread complete + todo done + stage advance"
```

---

## Task 45: 数字跳变 CountUp 接入

**Files:**
- Modify: `src/components/workspace/ThreadsPanel.vue`（pct 数字用 CountUp）

- [ ] **Step 1: 给 pct span 加 ref + watch**

Modify `src/components/workspace/ThreadsPanel.vue`:

template 里把：
```vue
<div class="thread-pct-big" :style="{ color: t.color }">{{ t.pct }}</div>
```
改为：
```vue
<div class="thread-pct-big" :style="{ color: t.color }" :ref="(el) => registerPctEl(t.id, el)">{{ t.pct }}</div>
```

script 加：
```javascript
import { ref as vueRef } from 'vue'
const pctEls = new Map()
const prevPct = new Map()
function registerPctEl(id, el) {
  if (el) pctEls.set(id, el)
}
```

在 `toggleStep` 里在 `ws.upsertThread({ ...thread })` 之后、celebrate 之前加：
```javascript
const el = pctEls.get(thread.id)
const prev = prevPct.get(thread.id) ?? thread.pct
if (el) reward.countUp(el, prev, thread.pct, 600)
prevPct.set(thread.id, thread.pct)
```

- [ ] **Step 2: 目测**

Run: `npm run dev`
Expected: 勾选 thread 步骤时百分比数字平滑滚动过渡（0.6 秒），而不是瞬间跳到新值。

- [ ] **Step 3: Commit**

```bash
git add src/components/workspace/ThreadsPanel.vue
git commit -m "feat(P8): countUp animation on thread percentage changes"
```

---

## Task 46: Mascot celebrate class 联动

**Files:**
- Modify: `src/components/workspace/MascotAvatar.vue`（监听 fs1:praise + celebrate 事件切 msc-celebrate 临时）

- [ ] **Step 1: 添加临时 celebrate class 切换逻辑**

Modify `src/components/workspace/MascotAvatar.vue`:

script 区加：
```javascript
import { ref as vueRef, onMounted, onBeforeUnmount } from 'vue'
const celebratingUntil = vueRef(0)

function onPraise() {
  celebratingUntil.value = Date.now() + 2000
}
onMounted(() => {
  window.addEventListener('fs1:praise', onPraise)
  window.addEventListener('fs1:inbox-status-change', onPraise)
})
onBeforeUnmount(() => {
  window.removeEventListener('fs1:praise', onPraise)
  window.removeEventListener('fs1:inbox-status-change', onPraise)
})
```

修改 `moodClass`：
```javascript
const moodClass = computed(() => {
  if (Date.now() < celebratingUntil.value) return 'msc-celebrate'
  const m = ws.energy.mood
  if (m >= 75) return 'msc-bounce'
  if (m >= 45) return 'msc-vibe'
  return 'msc-wobble'
})
```

**注意**：Date.now() 在 computed 里不会响应变化。要用 reactive tick：

改为：
```javascript
import { ref as vueRef, computed, onMounted, onBeforeUnmount } from 'vue'
const tickNow = vueRef(Date.now())
let tickTimer = null

onMounted(() => {
  tickTimer = setInterval(() => {
    tickNow.value = Date.now()
  }, 300)
  window.addEventListener('fs1:praise', onPraise)
  window.addEventListener('fs1:inbox-status-change', onPraise)
})
onBeforeUnmount(() => {
  clearInterval(tickTimer)
  window.removeEventListener('fs1:praise', onPraise)
  window.removeEventListener('fs1:inbox-status-change', onPraise)
})

const moodClass = computed(() => {
  if (tickNow.value < celebratingUntil.value) return 'msc-celebrate'
  const m = ws.energy.mood
  if (m >= 75) return 'msc-bounce'
  if (m >= 45) return 'msc-vibe'
  return 'msc-wobble'
})
```

- [ ] **Step 2: 目测**

Run: `npm run dev`
- 拖卡片到"完成"列若触发 praise → Mascot 跳一下（msc-celebrate 动画 0.6s）
- 拖到"完成"列不触发 praise 时 mascot 继续 bounce/vibe

- [ ] **Step 3: Commit**

```bash
git add src/components/workspace/MascotAvatar.vue
git commit -m "feat(P8): Mascot switches to celebrate class on praise events for 2s"
```

---

## Task 47: P8 最终回归 + 全量测试

**Files:**
- None

- [ ] **Step 1: 手工完整 flow 验收**

Run: `npm run dev`

按照 Spec 5.3 退出门逐项验证：

- [ ] `npm run dev` 启动无 error
- [ ] 16 MBTI 类型切换，非 ENFP 头像 fallback 显示方块 + 字母
- [ ] Ctrl+K 在工作台和收件箱都生效，保存入箱 toast 正常
- [ ] 工作台模块迁移完整：Energy/Journal/Threads(v2-3)/DesignFlow/QuadrantTodo(v2-6/v2-7)/FlashNotes/SyncStatus/DailySpark(v2-4)
- [ ] 收件箱 Kanban 完整：拖拽跨列（Chrome/Firefox/Edge）、搜索、标签过滤、排序、批量完成/舍弃
- [ ] 点 Card 打开 Edit Dialog，全字段编辑 + 状态切换 + 删除 ConfirmPopup
- [ ] 所有完成动作触发粒子 + pulse + 可能 praise（粒子跟随 MBTI 类型）
- [ ] Thread 100% 完成时 20 粒子 + pulse + 可能 praise
- [ ] Thread 百分比数字跳变动画顺畅
- [ ] Mascot 在 praise 时切到 celebrate class
- [ ] 刷新页面所有数据保留
- [ ] 切到不同 MBTI 类型（如 INTJ），再完成任务 → 粒子变成 DEFAULT_PARTICLES（✨⭐💫🌟）

- [ ] **Step 2: 全量测试通过**

Run: `npx vitest run`
Expected: 全部测试通过。累计：
- config/mbti 7
- services/storage 6
- stores/useMbti 5
- stores/useWorkspace 8
- utils/time 6
- stores/useInbox 13
- utils/urlDetect 14
- composables/useHotkey 5
- composables/useReward 7
- **总计 71 个**

- [ ] **Step 3: 生产构建验证**

Run: `npm run build`
Expected: `dist/` 目录生成，无 error。`dist/index.html` 可静态托管。

Run: `npm run preview`
Expected: `http://localhost:4173` 启动，页面完整可用。

- [ ] **Step 4: Commit**

```bash
git commit --allow-empty -m "chore(P8): Part 1 final regression pass — Definition of Done complete"
```

---

# Part 1 全部完成

## 交付清单

- [x] Vue 3 + Vite + Pinia + Router + PrimeVue (unstyled) 工程化脚手架
- [x] 16 MBTI 类型配置系统（ENFP 完整，其余 15 占位）
- [x] 双页面路由（`/` 工作台、`/inbox` 收件箱）
- [x] 工作台 9 个模块完整迁移 + v2-3/4/6/7 融入
- [x] 灵感收件箱 Kanban 四态 + 搜索/过滤/排序/批量/拖拽
- [x] Ctrl+K 全局快捕 Dialog + URL auto-detect + source guess
- [x] Inbox 卡片编辑 Dialog + ConfirmPopup 删除
- [x] 正反馈系统 6 机制（粒子/pulse/CountUp/checkmark/Mascot/praise）
- [x] 71 个单元测试全部通过
- [x] localStorage `fs1_*` 持久化
- [x] `npm run build` 可部署

## Part 2 / Part 3 backlog

见 Spec 5.7 节。关键项：
- 真 WebSocket 服务层
- Inbox 链接元信息抓取
- reducedMotion 开关 UI
- Mascot 15 类型精细化
- 正反馈扩展（A5/B1-4/C3-4/D1/D3）
- 导出 JSON / CSV
- 移动端适配
- 文章推荐（若仍需要）
- 多设备同步 + 账号系统

## 关键决策沉淀

- PrimeVue unstyled 成功接入：关键是 `app.use(PrimeVue, { unstyled: true })` + 每个组件用 PassThrough class + 自己写 CSS
- localStorage 单 key 整体序列化够用：workspace < 100KB，inbox < 500KB（几千条条目规模）
- 原生 HTML5 DnD 对桌面 Kanban 足够；移动端 Part 2 考虑
- 务实 TDD 落地：stores / composables / utils 共 9 个测试文件 71 个测试；UI 组件目测
- 全局事件总线（window.dispatchEvent + CustomEvent）做跨层联动：`fs1:open-capture` / `fs1:inbox-open` / `fs1:inbox-status-change` / `fs1:praise`，避免 props 透传地狱


