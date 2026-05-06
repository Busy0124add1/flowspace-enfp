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
