/**
 * Suppliers Management Page
 * Manage supplier information and details
 */

<template>
  <div class="suppliers-page">
    <div class="page-header">
      <div>
        <h2>Suppliers</h2>
        <p class="text-gray-600">Manage supplier information</p>
      </div>
      <button class="btn-primary" @click="showNewSupplierModal = true">
        <i class="fas fa-plus"></i> Add Supplier
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="filters-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search suppliers..."
        class="filter-input"
      />
    </div>

    <!-- Suppliers Grid/List -->
    <div class="suppliers-grid">
      <div v-for="supplier in filteredSuppliers" :key="supplier.id" class="supplier-card">
        <div class="supplier-header">
          <h3>{{ supplier.name }}</h3>
          <div class="supplier-actions">
            <button class="btn-sm btn-edit" @click="editSupplier(supplier)" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-sm btn-delete" @click="deleteSupplier(supplier.id)" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="supplier-body">
          <div class="info-row">
            <span class="info-label">Contact:</span>
            <span>{{ supplier.contact }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span>{{ supplier.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Address:</span>
            <span>{{ supplier.address }}</span>
          </div>
        </div>
        <div class="supplier-footer">
          <button class="btn-link" @click="viewSupplierOrders(supplier)">
            <i class="fas fa-file-invoice"></i> View Orders
          </button>
        </div>
      </div>

      <div v-if="filteredSuppliers.length === 0" class="empty-state">
        <i class="fas fa-inbox"></i>
        <h3>No suppliers found</h3>
        <p>{{ searchQuery ? 'Try adjusting your search' : 'Create your first supplier' }}</p>
      </div>
    </div>

    <!-- New Supplier Modal -->
    <div v-if="showNewSupplierModal" class="modal-overlay" @click.self="showNewSupplierModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingSupplier ? 'Edit Supplier' : 'Add New Supplier' }}</h2>
          <button class="btn-close" @click="showNewSupplierModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Supplier Name *</label>
            <input v-model="newSupplier.name" type="text" class="form-input" placeholder="Enter supplier name" required />
          </div>
          <div class="form-group">
            <label>Contact Person *</label>
            <input v-model="newSupplier.contact" type="text" class="form-input" placeholder="Enter contact person" required />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input v-model="newSupplier.email" type="email" class="form-input" placeholder="Enter email" required />
          </div>
          <div class="form-group">
            <label>Address</label>
            <textarea v-model="newSupplier.address" class="form-input" rows="3" placeholder="Enter address"></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" @click="showNewSupplierModal = false">Cancel</button>
            <button class="btn-submit" @click="saveSupplier">{{ editingSupplier ? 'Update' : 'Create' }} Supplier</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInventoryData } from '@/composables/useInventoryData'
import type { Supplier } from '@/types'
import { logger } from '@/utils/logger'

const { suppliers, loadInitialData } = useInventoryData()

const searchQuery = ref('')
const showNewSupplierModal = ref(false)
const editingSupplier = ref<Supplier | null>(null)
const newSupplier = ref<Supplier>({
  id: 0,
  name: '',
  contact: '',
  email: '',
  address: ''
})

onMounted(async () => {
  await loadInitialData()
})

const filteredSuppliers = computed(() => {
  if (!searchQuery.value) return suppliers.value

  const query = searchQuery.value.toLowerCase()
  return suppliers.value.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.contact?.toLowerCase().includes(query) ||
    s.email?.toLowerCase().includes(query)
  )
})

const editSupplier = (supplier: Supplier) => {
  editingSupplier.value = supplier
  newSupplier.value = { ...supplier }
  showNewSupplierModal.value = true
}

const saveSupplier = async () => {
  try {
    logger.info('Supplier saved', newSupplier.value)
    showNewSupplierModal.value = false
    editingSupplier.value = null
  } catch (error) {
    logger.error('Error saving supplier', error)
  }
}

const deleteSupplier = (id: number) => {
  if (confirm('Are you sure you want to delete this supplier?')) {
    logger.info('Supplier deleted', { id })
  }
}

const viewSupplierOrders = (supplier: Supplier) => {
  logger.debug('View orders for supplier', { id: supplier.id })
}
</script>

<style scoped>
.suppliers-page {
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

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.filters-bar {
  margin-bottom: 25px;
}

.filter-input {
  width: 100%;
  max-width: 400px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.suppliers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.supplier-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.supplier-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.supplier-header {
  padding: 15px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.supplier-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
}

.supplier-actions {
  display: flex;
  gap: 5px;
}

.supplier-body {
  padding: 15px;
  flex: 1;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 10px;
  font-size: 13px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: #6b7280;
}

.info-row span:last-child {
  color: #1f2937;
  word-break: break-word;
}

.supplier-footer {
  padding: 10px 15px;
  border-top: 1px solid #f3f4f6;
  background-color: #f9fafb;
}

.btn-link {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.2s ease;
}

.btn-link:hover {
  color: #2563eb;
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

.btn-delete {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.empty-state {
  grid-column: 1 / -1;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
  }

  .suppliers-grid {
    grid-template-columns: 1fr;
  }

  .filter-input {
    max-width: 100%;
  }
}
</style>
