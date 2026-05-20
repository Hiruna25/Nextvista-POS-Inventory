<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div>
          <h2><i class="fas" :class="isEditing ? 'fa-edit' : 'fa-plus-circle'"></i> {{ isEditing ? 'Edit Product' : 'Add New Product' }}</h2>
          <p class="modal-subtitle">{{ isEditing ? 'Update product information' : 'Create a new product in your inventory' }}</p>
        </div>
        <button class="close-btn" @click="closeModal" title="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="saveProduct">
          <!-- Product Basic Info -->
          <div class="form-section">
            <h3 class="section-title"><i class="fas fa-box"></i> Basic Information</h3>
            
            <div class="form-group">
              <label>Product Name <span class="required">*</span></label>
              <input 
                v-model="form.name" 
                type="text" 
                class="form-input"
                placeholder="Enter product name"
                required 
              />
              <span v-if="form.name" class="char-count">{{ form.name.length }} characters</span>
            </div>

            <div class="form-group">
              <label>Barcode</label>
              <input 
                v-model="form.barcode" 
                type="text" 
                class="form-input"
                placeholder="e.g., 8718345234523"
              />
            </div>
          </div>

          <!-- Category & Supplier -->
          <div class="form-section">
            <h3 class="section-title"><i class="fas fa-tags"></i> Classification</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label>Category <span class="required">*</span></label>
                <select v-model.number="form.category_id" class="form-input" required>
                  <option :value="undefined">-- Select Category --</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Supplier <span class="required">*</span></label>
                <select v-model.number="form.supplier_id" class="form-input" required>
                  <option :value="undefined">-- Select Supplier --</option>
                  <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
                    {{ sup.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Stock & Inventory -->
          <div class="form-section">
            <h3 class="section-title"><i class="fas fa-warehouse"></i> Inventory</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label>Initial Stock Quantity <span class="required">*</span></label>
                <input 
                  v-model.number="form.stock_quantity" 
                  type="number" 
                  class="form-input"
                  min="0"
                  placeholder="0"
                  required 
                />
              </div>
              <div class="form-group">
                <label>Min Stock Level</label>
                <input 
                  v-model.number="form.min_stock_level" 
                  type="number" 
                  class="form-input"
                  min="0"
                  placeholder="10"
                />
              </div>
              <div class="form-group">
                <label>Max Stock Level</label>
                <input 
                  v-model.number="form.max_stock_level" 
                  type="number" 
                  class="form-input"
                  min="0"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="form-section">
            <h3 class="section-title"><i class="fas fa-dollar-sign"></i> Pricing</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label>Cost Price <span class="required">*</span></label>
                <input 
                  v-model.number="form.cost" 
                  type="number" 
                  class="form-input"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required 
                />
              </div>
              <div class="form-group">
                <label>Selling Price <span class="required">*</span></label>
                <input 
                  v-model.number="form.price" 
                  type="number" 
                  class="form-input"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required 
                />
              </div>
              <div class="form-group profit-display">
                <label>Profit Margin</label>
                <div class="margin-badge" :class="marginClass">
                  <i :class="marginIcon"></i>
                  <span>{{ profitMargin }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Inventory Settings -->
          <div class="form-section">
            <h3 class="section-title"><i class="fas fa-inventory"></i> Inventory Settings</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label>Low Stock Threshold <span class="required">*</span></label>
                <input 
                  v-model.number="form.lowStockThreshold" 
                  type="number" 
                  class="form-input"
                  min="1"
                  placeholder="10"
                  required 
                />
                <span class="help-text">Alert when stock falls below this amount</span>
              </div>
              <div class="form-group">
                <label>Daily Sales Rate</label>
                <input 
                  v-model.number="form.dailySales" 
                  type="number" 
                  class="form-input"
                  step="0.1"
                  min="0"
                  placeholder="0"
                />
                <span class="help-text">Average units sold per day</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="form-section">
            <h3 class="section-title"><i class="fas fa-file-alt"></i> Additional Details</h3>
            
            <div class="form-group">
              <label>Description</label>
              <textarea 
                v-model="form.description" 
                class="form-input" 
                rows="3"
                placeholder="Add product description, features, or notes..."
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <Button @click="closeModal" variant="secondary" icon="fas fa-times">
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon="fas fa-save">
              {{ isEditing ? 'Update Product' : 'Create Product' }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Product, Category, Supplier } from '@/types'
import Button from '@/components/shared/Button.vue'

const props = defineProps<{
  isOpen: boolean
  isEditing: boolean
  product?: Partial<Product>
  categories: Category[]
  suppliers: Supplier[]
}>()

const emit = defineEmits<{
  close: []
  save: [product: Partial<Product>]
}>()

const form = ref<Partial<Product>>({
  name: '',
  barcode: '',
  category_id: undefined,
  supplier_id: undefined,
  cost: 0,
  price: 0,
  stock_quantity: 0,
  min_stock_level: 10,
  max_stock_level: 100,
  description: '',
  lowStockThreshold: 10,
  dailySales: 0
})

const profitMargin = computed(() => {
  if (!form.value.cost || !form.value.price) return 0
  return (((form.value.price - form.value.cost) / form.value.cost) * 100).toFixed(2)
})

const marginClass = computed(() => {
  const margin = parseFloat(profitMargin.value as string)
  if (margin > 50) return 'excellent'
  if (margin > 30) return 'good'
  if (margin > 10) return 'fair'
  return 'low'
})

const marginIcon = computed(() => {
  const margin = parseFloat(profitMargin.value as string)
  if (margin > 50) return 'fas fa-arrow-up'
  if (margin > 30) return 'fas fa-check'
  if (margin > 10) return 'fas fa-info-circle'
  return 'fas fa-arrow-down'
})

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.value = { ...newProduct }
  } else {
    resetForm()
  }
}, { immediate: true })

const closeModal = () => {
  emit('close')
  resetForm()
}

const saveProduct = () => {
  emit('save', form.value)
  resetForm()
}

const resetForm = () => {
  form.value = {
    name: '',
    barcode: '',
    category_id: undefined,
    supplier_id: undefined,
    cost: 0,
    price: 0,
    stock_quantity: 0,
    min_stock_level: 10,
    max_stock_level: 100,
    description: '',
    lowStockThreshold: 10,
    dailySales: 0
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 28px;
  border-bottom: 2px solid #f0f2f5;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.modal-header h2 {
  margin: 0 0 6px 0;
  color: white;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header h2 i {
  font-size: 24px;
}

.modal-subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: 500;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  padding: 30px;
}

/* Form Sections */
.form-section {
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 1px solid #e8ecf1;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-title i {
  color: #667eea;
  font-size: 16px;
}

/* Form Groups */
.form-group {
  margin-bottom: 18px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 13px;
}

.required {
  color: #e74c3c;
  font-weight: 700;
}

.form-input,
textarea.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e8ecf1;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  color: #2c3e50;
}

.form-input:hover,
textarea.form-input:hover {
  border-color: #d0dce6;
  background-color: #fff;
}

.form-input:focus,
textarea.form-input:focus {
  outline: none;
  border-color: #667eea;
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #bdc3c7;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.char-count {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #95a5a6;
  text-align: right;
}

.help-text {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 500;
}

/* Form Row */
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
  margin-bottom: 0;
}

/* Profit Display */
.profit-display {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.margin-badge {
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.margin-badge.excellent {
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  border: 2px solid rgba(46, 204, 113, 0.3);
}

.margin-badge.good {
  background: rgba(52, 152, 219, 0.15);
  color: #3498db;
  border: 2px solid rgba(52, 152, 219, 0.3);
}

.margin-badge.fair {
  background: rgba(241, 196, 15, 0.15);
  color: #f39c12;
  border: 2px solid rgba(241, 196, 15, 0.3);
}

.margin-badge.low {
  background: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
  border: 2px solid rgba(231, 76, 60, 0.3);
}

/* Modal Footer */
.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 25px;
  margin-top: 25px;
  border-top: 1px solid #e8ecf1;
}

/* Responsive */
@media (max-width: 600px) {
  .modal-content {
    width: 98%;
  }

  .modal-header {
    padding: 20px;
  }

  .modal-header h2 {
    font-size: 18px;
  }

  .modal-body {
    padding: 20px;
  }

  .form-section {
    margin-bottom: 20px;
    padding-bottom: 15px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
}
</style>
