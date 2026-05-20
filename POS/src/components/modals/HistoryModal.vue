<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2><i class="fas fa-history"></i> Inventory History - {{ product?.name }}</h2>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="filters">
          <input v-model="filterText" type="text" placeholder="Search history..." class="filter-input" />
          <select v-model="filterType" class="filter-select">
            <option value="">All Types</option>
            <option value="Stock Added">Add</option>
            <option value="Stock Removed">Remove</option>
            <option value="Stock Corrected">Correction</option>
          </select>
        </div>

        <div class="history-list">
          <div v-if="filteredHistory.length === 0" class="empty-state">
            <p>No history records found</p>
          </div>

          <div v-for="record in filteredHistory" :key="record.id" class="history-item">
            <div class="history-header">
              <span :class="['type-badge', `type-${record.action.toLowerCase().replace(' ', '-')}`]">{{
                record.action
              }}</span>
              <span class="date">{{ formatDate(record.timestamp) }}</span>
            </div>
            <div class="history-details">
              <p><strong>Change:</strong> {{ record.quantity }} units</p>
              <p><strong>Previous Stock:</strong> {{ record.previous_stock }}</p>
              <p><strong>New Stock:</strong> {{ record.new_stock }}</p>
              <p v-if="record.notes" class="notes">{{ record.notes }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <Button @click="exportHistory" variant="secondary" icon="fas fa-download">
          Export
        </Button>
        <Button @click="closeModal" variant="primary">Close</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product, InventoryHistoryEntry } from '@/types'
import { useFormatting } from '@/composables/useFormatting'
import Button from '@/components/shared/Button.vue'

const props = defineProps<{
  isOpen: boolean
  product?: Product
  history: InventoryHistoryEntry[]
}>()

const emit = defineEmits<{
  close: []
}>()

const { formatDate } = useFormatting()

const filterText = ref('')
const filterType = ref('')

const filteredHistory = computed(() => {
  const productHistory = props.history.filter((record) => record.product_id === props.product?.id)
  return productHistory.filter((record) => {
    const matchesSearch =
      record.action?.toLowerCase().includes(filterText.value.toLowerCase()) ||
      record.notes?.toLowerCase().includes(filterText.value.toLowerCase())
    const matchesType = !filterType.value || record.action === filterType.value
    return matchesSearch && matchesType
  })
})

const closeModal = () => {
  emit('close')
}

const exportHistory = () => {
  const data = filteredHistory.value.map((record) => ({
    Date: formatDate(record.timestamp),
    Action: record.action,
    Quantity: record.quantity,
    'Previous Stock': record.previous_stock,
    'New Stock': record.new_stock,
    Notes: record.notes
  }))

  const csv =
    Object.keys(data[0]).join(',') +
    '\n' +
    data.map((row) => Object.values(row).join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `inventory-history-${props.product?.id}.csv`
  link.click()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 700px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e6ed;
  background: #f8fafc;
  flex-shrink: 0;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #95a5a6;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-input,
.filter-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #3498db;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #95a5a6;
}

.history-item {
  border: 1px solid #e0e6ed;
  border-radius: 4px;
  padding: 15px;
  background: #f8fafc;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.type-add {
  background-color: #27ae60;
}

.type-remove {
  background-color: #e74c3c;
}

.type-correction {
  background-color: #f39c12;
}

.date {
  font-size: 13px;
  color: #95a5a6;
}

.history-details p {
  margin: 5px 0;
  font-size: 14px;
  color: #2c3e50;
}

.notes {
  font-style: italic;
  color: #7f8c8d;
  margin-top: 8px;
}

.user {
  font-size: 12px;
  color: #95a5a6;
  margin-top: 8px;
}

.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #e0e6ed;
  background: #f8fafc;
  flex-shrink: 0;
}
</style>
