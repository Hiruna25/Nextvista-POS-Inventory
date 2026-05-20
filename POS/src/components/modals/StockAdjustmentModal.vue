<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Adjust Stock - {{ product?.name }}</h2>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="adjustStock">
          <div class="form-group">
            <label>Current Stock</label>
            <p class="stock-value">{{ currentStock }} units</p>
          </div>

          <div class="form-group">
            <label>Adjustment Type *</label>
            <div class="radio-group">
              <label class="radio-label">
                <input v-model="form.type" type="radio" value="add" />
                Add Stock
              </label>
              <label class="radio-label">
                <input v-model="form.type" type="radio" value="remove" />
                Remove Stock
              </label>
              <label class="radio-label">
                <input v-model="form.type" type="radio" value="correct" />
                Stock Correction
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Quantity *</label>
            <input v-model.number="form.quantity" type="number" class="form-input" required />
          </div>

          <div class="form-group">
            <label>Reason *</label>
            <select v-model="form.reason" class="form-input" required>
              <option value="">Select Reason</option>
              <option value="received">Stock Received</option>
              <option value="damage">Damaged Stock</option>
              <option value="loss">Loss/Theft</option>
              <option value="expired">Expired</option>
              <option value="return">Customer Return</option>
              <option value="correction">Physical Count Correction</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label>Notes</label>
            <textarea v-model="form.notes" class="form-input" rows="3" placeholder="Additional details..."></textarea>
          </div>

          <div class="preview">
            <p>{{ form.type === 'remove' ? 'New Stock: ' : 'New Stock: ' }}<strong>{{ newStock }}</strong> units</p>
            <p v-if="form.type !== 'correct'" class="difference" :class="form.type === 'add' ? 'add' : 'remove'">
              {{ form.type === 'add' ? '+' : '-' }}{{ form.quantity }} units
            </p>
          </div>

          <div class="modal-footer">
            <Button @click="closeModal" variant="secondary">Cancel</Button>
            <Button type="submit" variant="primary">Adjust Stock</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types'
import { useStockCalculations } from '@/composables/useStockCalculations'
import Button from '@/components/shared/Button.vue'

const props = defineProps<{
  isOpen: boolean
  product?: Product
  selectedBranch: number
}>()

const emit = defineEmits<{
  close: []
  save: [adjustment: { type: string; quantity: number; reason: string; notes: string }]
}>()

const { getCurrentBranchStock } = useStockCalculations()

const form = ref({
  type: 'add',
  quantity: 0,
  reason: '',
  notes: ''
})

const currentStock = computed(() => {
  if (!props.product) return 0
  return getCurrentBranchStock(props.product, props.selectedBranch)
})

const newStock = computed(() => {
  if (form.value.type === 'add') {
    return currentStock.value + form.value.quantity
  } else if (form.value.type === 'remove') {
    return Math.max(0, currentStock.value - form.value.quantity)
  } else {
    return form.value.quantity
  }
})

const closeModal = () => {
  emit('close')
  resetForm()
}

const adjustStock = () => {
  emit('save', form.value)
  resetForm()
}

const resetForm = () => {
  form.value = { type: 'add', quantity: 0, reason: '', notes: '' }
}

watch(() => props.isOpen, (open) => {
  if (!open) resetForm()
})
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
  max-width: 500px;
  width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e6ed;
  background: #f8fafc;
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
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
}

.stock-value {
  font-size: 24px;
  font-weight: 600;
  color: #3498db;
  margin: 5px 0;
}

.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;
}

.radio-label input {
  margin-right: 8px;
}

.form-input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.form-input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.preview {
  background: #f8fafc;
  border: 1px solid #e0e6ed;
  padding: 12px;
  border-radius: 4px;
  margin: 15px 0;
}

.preview p {
  margin: 5px 0;
  font-size: 14px;
}

.difference {
  font-weight: 600;
}

.difference.add {
  color: #27ae60;
}

.difference.remove {
  color: #e74c3c;
}

.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #e0e6ed;
  background: #f8fafc;
}
</style>
