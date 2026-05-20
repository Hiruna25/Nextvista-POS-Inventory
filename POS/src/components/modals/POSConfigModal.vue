<template>
  <Modal :is-open="isOpen" @close="$emit('close')" title="POS System Configuration">
    <div class="pos-config-form">
      <div class="form-group">
        <label for="pos-type">POS System Type</label>
        <select id="pos-type" v-model="config.type" class="form-control">
          <option value="square">Square</option>
          <option value="clover">Clover</option>
          <option value="shopify">Shopify</option>
          <option value="custom">Custom API</option>
        </select>
      </div>

      <div class="form-group">
        <label for="endpoint">API Endpoint</label>
        <input
          id="endpoint"
          v-model="config.endpoint"
          type="url"
          class="form-control"
          placeholder="https://api.pos-system.com"
        />
      </div>

      <div class="form-group">
        <label for="api-key">API Key</label>
        <input
          id="api-key"
          v-model="config.apiKey"
          type="password"
          class="form-control"
          placeholder="Enter your API key"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="sync-frequency">Sync Frequency (minutes)</label>
          <input
            id="sync-frequency"
            v-model.number="config.syncFrequency"
            type="number"
            class="form-control"
            min="5"
            max="1440"
          />
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="config.autoSync"
              type="checkbox"
            />
            Auto Sync Enabled
          </label>
        </div>
      </div>

      <div class="form-actions">
        <Button @click="$emit('close')" variant="secondary">Cancel</Button>
        <Button @click="saveConfiguration" variant="primary">Save Configuration</Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { POSConfig } from '@/types'
import Modal from '@/components/shared/Modal.vue'
import Button from '@/components/shared/Button.vue'

interface Props {
  isOpen: boolean
  initialConfig?: POSConfig
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [config: POSConfig]
}>()

const config = reactive<POSConfig>({
  type: props.initialConfig?.type || 'square',
  endpoint: props.initialConfig?.endpoint || '',
  apiKey: props.initialConfig?.apiKey || '',
  syncFrequency: props.initialConfig?.syncFrequency || 30,
  autoSync: props.initialConfig?.autoSync ?? true
})

const saveConfiguration = () => {
  emit('save', { ...config })
  emit('close')
}
</script>

<style scoped>
.pos-config-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>
