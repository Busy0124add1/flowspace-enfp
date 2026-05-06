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
