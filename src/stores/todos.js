import { defineStore } from 'pinia'

const STORAGE_KEY = 'fp3_todos'

const DEF_TODOS = [
  { id: '1', text: '完成仪表盘 UI', quadrant: 'ui', done: false, x: 30, y: 40 },
  { id: '2', text: '修复登录 bug', quadrant: 'ui', done: false, x: 65, y: 25 },
  { id: '3', text: '阅读设计模式', quadrant: 'si', done: false, x: 20, y: 60 },
  { id: '4', text: '规划下周任务', quadrant: 'si', done: false, x: 70, y: 55 },
  { id: '5', text: '回复邮件', quadrant: 'un', done: false, x: 45, y: 30 },
  { id: '6', text: '更新简历', quadrant: 'si', done: false, x: 55, y: 70 },
]

function loadTodos() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v ? JSON.parse(v) : DEF_TODOS
  } catch {
    return DEF_TODOS
  }
}

function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {}
}

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: loadTodos()
  }),

  getters: {
    byQuadrant: (state) => (quadrant) => state.todos.filter(t => t.quadrant === quadrant),
    uiTodos: (state) => state.todos.filter(t => t.quadrant === 'ui'),
    siTodos: (state) => state.todos.filter(t => t.quadrant === 'si'),
    unTodos: (state) => state.todos.filter(t => t.quadrant === 'un'),
    doneTodos: (state) => state.todos.filter(t => t.done),
  },

  actions: {
    addTodo(text, quadrant = 'ui', x = 50, y = 50) {
      const id = Date.now().toString()
      this.todos.push({ id, text, quadrant, done: false, x, y })
      saveTodos(this.todos)
    },

    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.done = !todo.done
        if (todo.done) {
          todo.quadrant = 'done'
        }
        saveTodos(this.todos)
      }
    },

    deleteTodo(id) {
      const idx = this.todos.findIndex(t => t.id === id)
      if (idx !== -1) {
        this.todos.splice(idx, 1)
        saveTodos(this.todos)
      }
    },

    moveTodo(id, quadrant, x, y) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.quadrant = quadrant
        todo.x = x
        todo.y = y
        saveTodos(this.todos)
      }
    }
  }
})