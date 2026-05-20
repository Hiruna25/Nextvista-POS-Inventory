<template>
  <Card>
    <template #header>
      <div class="form-header">
        <h2><i class="fas fa-plus-circle"></i> Add New Product</h2>
        <span v-if="isDirty" class="unsaved-indicator" title="Unsaved changes">
          <i class="fas fa-circle"></i> Unsaved
        </span>
      </div>
    </template>

    <!-- Unsaved Changes Warning -->
    <div v-if="isDirty && showDirtyWarning" class="warning-banner">
      <i class="fas fa-exclamation-triangle"></i>
      <span>You have unsaved changes. They will be lost if you close this form.</span>
    </div>

    <form @submit.prevent="submitForm" class="product-form" @keydown.ctrl.enter="submitForm">
      <div class="form-group">
        <label>Product Name *</label>
        <input v-model="form.name" type="text" placeholder="Enter product name" required />
        <span v-if="errors.name" class="error">{{ errors.name }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Category *</label>
          <select v-model.number="form.category_id" required>
            <option :value="null">Select Category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <span v-if="errors.category_id" class="error">{{ errors.category_id }}</span>
        </div>

        <div class="form-group">
          <label>Supplier *</label>
          <select v-model.number="form.supplier_id" required>
            <option :value="null">Select Supplier</option>
            <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
              {{ sup.name }}
            </option>
          </select>
          <span v-if="errors.supplier_id" class="error">{{ errors.supplier_id }}</span>
        </div>
      </div>

      <div class="form-group">
        <label>Barcode</label>
        <input v-model="form.barcode" type="text" placeholder="Enter barcode (optional)" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Cost Price *</label>
          <input v-model.number="form.cost" type="number" placeholder="0.00" step="0.01" required />
          <span v-if="errors.cost" class="error">{{ errors.cost }}</span>
        </div>

        <div class="form-group">
          <label>Selling Price *</label>
          <input v-model.number="form.price" type="number" placeholder="0.00" step="0.01" required />
          <span v-if="errors.price" class="error">{{ errors.price }}</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Min Stock Level</label>
          <input v-model.number="form.min_stock_level" type="number" placeholder="10" />
        </div>

        <div class="form-group">
          <label>Max Stock Level</label>
          <input v-model.number="form.max_stock_level" type="number" placeholder="100" />
        </div>

        <div class="form-group">
          <label>Daily Sales</label>
          <input v-model.number="form.dailySales" type="number" placeholder="0" />
        </div>
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="form.description" placeholder="Enter product description (optional)" rows="3"></textarea>
      </div>

      <div class="form-actions">
        <Button @click="handleCancel" variant="secondary" size="md" title="Close form (ESC)">
          <i class="fas fa-times"></i> Cancel
        </Button>
        <Button @click="resetForm" variant="warning" size="md" title="Clear all fields">
          <i class="fas fa-redo"></i> Reset
        </Button>
        <Button type="submit" variant="success" size="md" title="Submit form (Ctrl+Enter)" :disabled="isSubmitting">
          <i v-if="!isSubmitting" class="fas fa-save"></i>
          <i v-else class="fas fa-spinner fa-spin"></i>
          {{ isSubmitting ? 'Adding...' : 'Add Product' }}
        </Button>
      </div>

      <div v-if="successMessage" class="success-message">
        <i class="fas fa-check-circle"></i> {{ successMessage }}
      </div>

      <div v-if="generalError" class="error-banner">
        <i class="fas fa-exclamation-circle"></i> {{ generalError }}
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Product, Category, Supplier } from '@/types'
import Card from '@/components/shared/Card.vue'
import Button from '@/components/shared/Button.vue'

interface Props {
  categories: Category[]
  suppliers: Supplier[]
  showDirtyWarning?: boolean
}

interface Emits {
  'add-product': [product: Product]
  'close': []
}

const props = withDefaults(defineProps<Props>(), {
  showDirtyWarning: false
})

const emit = defineEmits<Emits>()

const initialFormState = {
  name: '',
  category_id: null as number | null,
  supplier_id: null as number | null,
  barcode: '',
  cost: 0,
  price: 0,
  min_stock_level: 10,
  max_stock_level: 100,
  dailySales: 0,
  description: ''
}

const form = ref({ ...initialFormState })

const errors = ref({
  name: '',
  category_id: '',
  supplier_id: '',
  cost: '',
  price: ''
})

const successMessage = ref('')
const generalError = ref('')
const isSubmitting = ref(false)

// Dirty state - tracks if form has unsaved changes
const isDirty = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(initialFormState)
})

const validateForm = (): boolean => {
  errors.value = {
    name: '',
    category_id: '',
    supplier_id: '',
    cost: '',
    price: ''
  }
  generalError.value = ''

  if (!form.value.name.trim()) {
    errors.value.name = 'Product name is required'
  }
  if (form.value.category_id === null) {
    errors.value.category_id = 'Category is required'
  }
  if (form.value.supplier_id === null) {
    errors.value.supplier_id = 'Supplier is required'
  }
  if (form.value.cost <= 0) {
    errors.value.cost = 'Cost price must be greater than 0'
  }
  if (form.value.price <= 0) {
    errors.value.price = 'Selling price must be greater than 0'
  }
  if (form.value.price < form.value.cost) {
    generalError.value = 'Warning: Selling price is less than cost price'
  }

  return Object.values(errors.value).every(err => !err)
}

const submitForm = async () => {
  if (!validateForm()) return
  if (isSubmitting.value) return

  isSubmitting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API call

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: form.value.name,
      category_id: form.value.category_id ?? undefined,
      supplier_id: form.value.supplier_id ?? undefined,
      barcode: form.value.barcode || undefined,
      cost: form.value.cost,
      price: form.value.price,
      stock_quantity: 0,
      min_stock_level: form.value.min_stock_level,
      max_stock_level: form.value.max_stock_level,
      description: form.value.description || undefined,
      dailySales: form.value.dailySales || undefined
    }

    emit('add-product', newProduct)
    successMessage.value = 'Product added successfully!'
    
    setTimeout(() => {
      resetForm()
      emit('close')
    }, 1500)
  } catch (error) {
    generalError.value = 'Failed to add product. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = { ...initialFormState }
  errors.value = {
    name: '',
    category_id: '',
    supplier_id: '',
    cost: '',
    price: ''
  }
  successMessage.value = ''
  generalError.value = ''
}

const handleCancel = () => {
  if (isDirty.value && props.showDirtyWarning) {
    if (confirm('You have unsaved changes. Are you sure you want to close?')) {
      emit('close')
    }
  } else {
    emit('close')
  }
}

// Keyboard shortcuts
const handleKeyboardShortcuts = (e: KeyboardEvent) => {
  // ESC to close
  if (e.key === 'Escape' && !isSubmitting.value) {
    handleCancel()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyboardShortcuts)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboardShortcuts)
})
</script>

<style scoped>
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.form-header h2 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
}

.unsaved-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff3cd;
  color: #856404;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  animation: pulse 2s infinite;
}

.unsaved-indicator i {
  font-size: 8px;
  animation: blink 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes blink {
  0%, 49%, 100% {
    opacity: 1;
  }
  50%, 99% {
    opacity: 0.3;
  }
}

.warning-banner {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  padding: 12px 15px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #856404;
  font-size: 14px;
  font-weight: 500;
}

.warning-banner i {
  font-size: 16px;
  color: #f39c12;
}

.error-banner {
  background: #ffe6e6;
  border: 1px solid #ffcccc;
  border-radius: 6px;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #c92a2a;
  font-size: 14px;
  font-weight: 500;
  margin-top: 15px;
}

.error-banner i {
  font-size: 16px;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #e0e6ed;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: -4px;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px solid #e0e6ed;
}

.success-message {
  background: #d5f4e6;
  color: #27ae60;
  padding: 12px 15px;
  border-radius: 4px;
  border-left: 4px solid #27ae60;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease;
  font-weight: 500;
}

.success-message i {
  font-size: 18px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>
