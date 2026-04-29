<script setup>
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm'])

const projectName = ref('')
const deadline = ref('')

function handleConfirm() {
  if (projectName.value.trim()) {
    emit('confirm', {
      name: projectName.value.trim(),
      deadline: deadline.value.trim() || '未设置'
    })
    resetForm()
  }
}

function handleCancel() {
  emit('close')
  resetForm()
}

function resetForm() {
  projectName.value = ''
  deadline.value = ''
}
</script>

<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" class="modal-wrapper" @close="handleCancel">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="modal-backdrop" />
      </TransitionChild>

      <div class="modal-container">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel class="modal-panel">
            <DialogTitle class="modal-title">新建项目</DialogTitle>

            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">项目名称</label>
                <input
                  v-model="projectName"
                  type="text"
                  class="form-input"
                  placeholder="输入项目名称"
                  @keyup.enter="handleConfirm"
                />
              </div>
              <div class="form-group">
                <label class="form-label">截止日期</label>
                <input
                  v-model="deadline"
                  type="date"
                  class="form-input"
                />
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn btn-cancel" @click="handleCancel">取消</button>
              <button class="btn btn-confirm" @click="handleConfirm">确认</button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
.modal-wrapper {
  position: relative;
  z-index: 50;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

.modal-container {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r2);
  padding: 20px 24px;
  width: 100%;
  max-width: 360px;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--t1);
  margin-bottom: 16px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--t2);
}

.form-input {
  background: var(--surf);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 8px 10px;
  font-size: 13px;
  color: var(--t1);
  outline: none;
  transition: border-color 0.15s;
}

.form-input::placeholder {
  color: var(--t3);
}

.form-input:focus {
  border-color: var(--accent);
}

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border-radius: var(--r);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  border: none;
}

.btn:hover {
  opacity: 0.85;
}

.btn-cancel {
  background: var(--surf);
  color: var(--t2);
}

.btn-confirm {
  background: var(--accent);
  color: #fff;
}
</style>
