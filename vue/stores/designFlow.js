import { defineStore } from 'pinia'

const STORAGE_KEY = 'fp3_stages'

const DEF_STAGES = [
  {id:'s1',lbl:'需求分析',ico:'fa-file-lines',done:true,active:false},
  {id:'s2',lbl:'线框图',ico:'fa-border-all',done:true,active:false},
  {id:'s3',lbl:'视觉稿',ico:'fa-image',done:false,active:true},
  {id:'s4',lbl:'原型',ico:'fa-computer-mouse',done:false,active:false},
  {id:'s5',lbl:'交付',ico:'fa-check-double',done:false,active:false},
]

function loadStages() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v ? JSON.parse(v) : DEF_STAGES
  } catch {
    return DEF_STAGES
  }
}

function saveStages(stages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stages))
  } catch {}
}

export const useDesignFlowStore = defineStore('designFlow', {
  state: () => ({
    stages: loadStages(),
    project: { name: '工作前台仪表盘', deadline: '2026-05-10' }
  }),

  getters: {
    activeIndex: (state) => state.stages.findIndex(s => s.active),
    completedCount: (state) => state.stages.filter(s => s.done).length
  },

  actions: {
    setActive(index) {
      this.stages.forEach((s, i) => {
        s.done = i < index
        s.active = i === index
      })
      saveStages(this.stages)
    },

    resetProject(name = '工作前台仪表盘', deadline = '2026-05-10') {
      this.project = { name, deadline }
      this.stages = DEF_STAGES.map(s => ({...s}))
      saveStages(this.stages)
    }
  }
})