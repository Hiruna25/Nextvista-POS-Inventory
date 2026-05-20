/**
 * Products Management Page
 * Manage product catalog, create, edit, and view products
 */

<template>
  <div class="products-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2>Products Management</h2>
        <p class="text-gray-600">Manage your product catalog</p>
      </div>
      <button class="btn-primary" @click="showNewProductModal = true">
        <i class="fas fa-plus"></i> Add New Product
      </button>
    </div>

    <!-- Filters & Search -->
    <div class="filters-bar">
      <div class="filter-group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="filter-input"
        />
      </div>
      <div class="filter-group">
        <select v-model="selectedCategory" class="filter-input">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <select v-model="selectedSupplier" class="filter-input">
          <option value="">All Suppliers</option>
          <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
            {{ sup.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <i class="fas fa-spinner animate-spin"></i>
      <p>Loading products...</p>
    </div>

    <!-- Products Table -->
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="sortBy('name')" class="sortable">
              Product Name
              <i v-if="sortField === 'name'" :class="sortDirection === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            </th>
            <th>Category</th>
            <th>Supplier</th>
            <th @click="sortBy('price')" class="sortable">
              Price
              <i v-if="sortField === 'price'" :class="sortDirection === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            </th>
            <th @click="sortBy('stock_quantity')" class="sortable">
              Stock
              <i v-if="sortField === 'stock_quantity'" :class="sortDirection === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            </th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td class="font-medium">{{ product.name }}</td>
            <td>{{ getCategoryName(product.category_id, categories) }}</td>
            <td>{{ getSupplierName(product.supplier_id, suppliers) }}</td>
            <td>${{ product.price.toFixed(2) }}</td>
            <td>{{ product.stock_quantity }}</td>
            <td>
              <span :class="getStockBadgeClass(product)">
                {{ getStockStatus(product) }}
              </span>
            </td>
            <td class="actions-cell">
              <button class="btn-sm btn-edit" @click="editProduct(product)" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-sm btn-delete" @click="deleteProduct(product.id)" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <i class="fas fa-inbox"></i>
        <h3>No products found</h3>
        <p>{{ searchQuery ? 'Try adjusting your filters' : 'Create your first product' }}</p>
      </div>
    </div>

    <!-- New/Edit Product Modal -->
    <div v-if="showNewProductModal" class="modal-overlay" @click.self="showNewProductModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
          <button class="btn-close" @click="showNewProductModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <newproduct
          :product="editingProduct"
          :categories="categories"
          :suppliers="suppliers"
          @save="handleProductSave"
          @cancel="showNewProductModal = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInventoryData } from '@/composables/useInventoryData'
import { getCategoryName, getSupplierName } from '@/utils/helpers'
import newproduct from '@/components/features/newproduct.vue'
import type { Product } from '@/types'
import { logger } from '@/utils/logger'

const { inventory, categories, suppliers, loadInitialData, updateProduct, addProduct } = useInventoryData()

const isLoading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref<string | number>('')
const selectedSupplier = ref<string | number>('')
const sortField = ref<keyof Product>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')
const showNewProductModal = ref(false)
const editingProduct = ref<Product | null>(null)

onMounted(async () => {
  await loadInitialData()
  isLoading.value = false
})

const filteredProducts = computed(() => {
  let filtered = inventory.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) || p.barcode?.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category_id === selectedCategory.value)
  }

  if (selectedSupplier.value) {
    filtered = filtered.filter(p => p.supplier_id === selectedSupplier.value)
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal: any = a[sortField.value]
    let bVal: any = b[sortField.value]

    if (aVal == null) aVal = ''
    if (bVal == null) bVal = ''

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = (bVal as string).toLowerCase()
    }

    if (sortDirection.value === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
  })

  return filtered
})

const sortBy = (field: keyof Product) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getStockStatus = (product: Product) => {
  if (product.stock_quantity <= 0) return 'Out of Stock'
  if (product.stock_quantity <= (product.min_stock_level || 10)) return 'Low Stock'
  return 'In Stock'
}

const getStockBadgeClass = (product: Product) => {
  const status = getStockStatus(product)
  const baseClass = 'badge'
  if (status === 'Out of Stock') return `${baseClass} badge-danger`
  if (status === 'Low Stock') return `${baseClass} badge-warning`
  return `${baseClass} badge-success`
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  showNewProductModal.value = true
}

const handleProductSave = async (productData: Partial<Product>) => {
  try {
    if (editingProduct.value?.id) {
      await updateProduct(editingProduct.value.id, productData)
      logger.info('Product updated successfully')
    } else {
      await addProduct(productData as Omit<Product, 'id'>)
      logger.info('Product created successfully')
    }
    showNewProductModal.value = false
    editingProduct.value = null
  } catch (error) {
    logger.error('Error saving product', error)
  }
}

const deleteProduct = async (_id: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      // TODO: Implement delete functionality
      logger.info('Product deleted')
    } catch (error) {
      logger.error('Error deleting product', error)
    }
  }
}
</script>

<style scoped>
.products-page {
  animation: fadeIn 0.3s ease-in;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #1f2937;
}

.page-header p {
  margin: 0;
  font-size: 14px;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.filters-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.filter-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.loading-state i {
  font-size: 32px;
  margin-bottom: 15px;
  animation: spin 1s linear infinite;
}

.table-container {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background-color: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.data-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #1f2937;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 5px;
}

.data-table th.sortable:hover {
  color: #3b82f6;
}

.data-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.data-table td {
  padding: 15px;
  color: #1f2937;
  font-size: 14px;
}

.font-medium {
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background-color: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.badge-warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.badge-danger {
  background-color: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.btn-edit {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.btn-edit:hover {
  background-color: rgba(59, 130, 246, 0.2);
}

.btn-delete {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-delete:hover {
  background-color: rgba(239, 68, 68, 0.2);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-state h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #6b7280;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* Modal Styles */
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
  background-color: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
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
  transition: color 0.2s ease;
}

.btn-close:hover {
  color: #1f2937;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
  }

  .filters-bar {
    flex-direction: column;
  }

  .filter-group {
    min-width: auto;
  }

  .data-table {
    font-size: 12px;
  }

  .data-table th,
  .data-table td {
    padding: 10px;
  }

  .modal-content {
    width: 95%;
    max-height: 95vh;
  }
}
</style>
