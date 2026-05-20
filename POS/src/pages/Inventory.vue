/**
 * Inventory Management Page
 * View and manage inventory across branches
 */

<template>
  <div class="inventory-page">
    <div class="page-header">
      <div>
        <h2>Inventory Management</h2>
        <p class="text-gray-600">Monitor stock levels across branches</p>
      </div>
    </div>

    <!-- Branch Selector & Stats -->
    <div class="inventory-controls">
      <div class="branch-selector">
        <label>Select Branch:</label>
        <select v-model="selectedBranch" class="filter-input">
          <option value="">All Branches</option>
          <option v-for="branch in branches" :key="branch.id" :value="branch.id">
            {{ branch.name }}
          </option>
        </select>
      </div>

      <div class="inventory-stats">
        <div class="stat-card">
          <span class="stat-label">Total Products</span>
          <span class="stat-value">{{ inventory.length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Low Stock</span>
          <span class="stat-value text-warning">{{ lowStockCount }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Out of Stock</span>
          <span class="stat-value text-danger">{{ outOfStockCount }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Total Value</span>
          <span class="stat-value">${{ totalInventoryValue.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Inventory Table Component -->
    <div class="table-wrapper">
      <InventoryTable
        :inventory="inventory"
        :categories="categories"
        :suppliers="suppliers"
        :branches="branches"
        :selected-branch="selectedBranch"
        :sort-field="sortField"
        :sort-direction="sortDirection"
        @sort="handleSort"
        @edit="handleEdit"
        @adjust-stock="handleAdjustStock"
        @view-history="handleViewHistory"
        @delete="handleDelete"
      />
    </div>

    <!-- Stock Adjustment Modal -->
    <div v-if="showStockModal" class="modal-overlay" @click.self="showStockModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Adjust Stock - {{ selectedProduct?.name }}</h2>
          <button class="btn-close" @click="showStockModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Adjustment Type</label>
            <select v-model="adjustmentType" class="form-input">
              <option value="add">Add Stock</option>
              <option value="remove">Remove Stock</option>
              <option value="adjust">Adjust to Exact Quantity</option>
            </select>
          </div>
          <div class="form-group">
            <label>Quantity</label>
            <input v-model.number="adjustmentQty" type="number" class="form-input" min="0" />
          </div>
          <div class="form-group">
            <label>Reason</label>
            <textarea v-model="adjustmentReason" class="form-input" rows="3" placeholder="Why are you adjusting stock?"></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" @click="showStockModal = false">Cancel</button>
            <button class="btn-submit" @click="applyStockAdjustment">Apply Adjustment</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInventoryData } from '@/composables/useInventoryData'
import InventoryTable from '@/components/features/InventoryTable.vue'
import type { Product } from '@/types'
import { logger } from '@/utils/logger'

const { inventory, categories, suppliers, branches, loadInitialData } = useInventoryData()

const selectedBranch = ref<number>(0)
const sortField = ref('name')
const sortDirection = ref('asc')
const showStockModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const adjustmentType = ref('add')
const adjustmentQty = ref(0)
const adjustmentReason = ref('')

onMounted(async () => {
  await loadInitialData()
})

const lowStockCount = computed(() =>
  inventory.value.filter(p => p.stock_quantity <= (p.min_stock_level || 10)).length
)

const outOfStockCount = computed(() =>
  inventory.value.filter(p => p.stock_quantity <= 0).length
)

const totalInventoryValue = computed(() =>
  inventory.value.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0)
)

const handleSort = (field: string) => {
  logger.debug('Sort field', { field })
}

const handleEdit = (product: Product) => {
  logger.debug('Edit product', { id: product.id })
}

const handleAdjustStock = (product: Product) => {
  selectedProduct.value = product
  adjustmentType.value = 'add'
  adjustmentQty.value = 0
  adjustmentReason.value = ''
  showStockModal.value = true
}

const applyStockAdjustment = async () => {
  if (!selectedProduct.value || adjustmentQty.value === 0) return

  try {
    let newQty = selectedProduct.value.stock_quantity

    if (adjustmentType.value === 'add') {
      newQty += adjustmentQty.value
    } else if (adjustmentType.value === 'remove') {
      newQty -= adjustmentQty.value
    } else {
      newQty = adjustmentQty.value
    }

    // TODO: Call API to update stock
    await updateProduct(selectedProduct.value.id, { stock_quantity: newQty })
    logger.info('Stock adjusted successfully')
    showStockModal.value = false
  } catch (error) {
    logger.error('Error adjusting stock', error)
  }
}

const handleViewHistory = (product: Product) => {
  logger.debug('View history for product', { id: product.id })
}

const handleDelete = (product: Product) => {
  if (confirm(`Delete ${product.name}?`)) {
    logger.info('Product deleted')
  }
}

const updateProduct = (_id: string, _data: any) => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}
</script>

<style scoped>
.inventory-page {
  animation: fadeIn 0.3s ease-in;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #1f2937;
}

.inventory-controls {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-bottom: 30px;
}

.branch-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.branch-selector label {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.inventory-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.text-warning {
  color: #d97706;
}

.text-danger {
  color: #dc2626;
}

.table-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
}

.btn-submit {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.btn-submit:hover {
  background-color: #2563eb;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .inventory-controls {
    grid-template-columns: 1fr;
  }

  .inventory-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
