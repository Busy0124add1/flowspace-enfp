import { defineStore } from 'pinia'

const STORAGE_KEY = 'fp3_threads'

const DEF_THREADS = [
  {id:'a',color:'#f0537a',icon:'fa-pen-ruler',name:'设计',desc:'仪表盘 UI',pct:60,
   steps:[{t:'需求梳理',d:true},{t:'线框图',d:true},{t:'视觉稿',d:false},{t:'标注交付',d:false}]},
  {id:'b',color:'#3ecfcf',icon:'fa-code',name:'开发',desc:'前端 & 逻辑',pct:75,
   steps:[{t:'HTML 结构',d:true},{t:'CSS 样式',d:true},{t:'JS 交互',d:true},{t:'响应式',d:false}]},
  {id:'c',color:'#9de84b',icon:'fa-magnifying-glass',name:'调研',desc:'用户偏好',pct:25,
   steps:[{t:'竞品参考',d:false},{t:'草图',d:false},{t:'方案评审',d:false}]},
  {id:'d',color:'#9b6dff',icon:'fa-wand-magic-sparkles',name:'创意',desc:'新功能脑暴',pct:0,
   steps:[{t:'竞品参考',d:false},{t:'草图',d:false},{t:'方案评审',d:false}]},
  {id:'e',color:'#f5a623',icon:'fa-bullhorn',name:'运营',desc:'文档 & 案例',pct:67,
   steps:[{t:'撰写文档',d:true},{t:'截图配图',d:true},{t:'发布',d:false}]},
]

function loadThreads() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v ? JSON.parse(v) : DEF_THREADS
  } catch {
    return DEF_THREADS
  }
}

function saveThreads(threads) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
  } catch {}
}

function calcPct(steps) {
  if (!steps || steps.length === 0) return 0
  const done = steps.filter(s => s.d).length
  return Math.round((done / steps.length) * 100)
}

export const useThreadsStore = defineStore('threads', {
  state: () => ({
    threads: loadThreads()
  }),

  actions: {
    toggleStep(threadIdx, stepIdx) {
      const thread = this.threads[threadIdx]
      if (thread) {
        thread.steps[stepIdx].d = !thread.steps[stepIdx].d
        thread.pct = calcPct(thread.steps)
        saveThreads(this.threads)
      }
    },

    reset() {
      this.threads = DEF_THREADS.map(t => ({...t, steps: t.steps.map(s => ({...s}))}))
      saveThreads(this.threads)
    }
  }
})