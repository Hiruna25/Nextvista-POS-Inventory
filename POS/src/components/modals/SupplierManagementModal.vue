<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleClose" @keydown.esc="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h3><i class="fas fa-truck-loading"></i> Supplier Management</h3>
        <button @click="handleClose" class="close-btn" title="Close (ESC)">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="supplier-grid">
          <section class="supplier-form-panel">
            <h4>Add a Supplier</h4>
            <form @submit.prevent="submitSupplier" class="supplier-form">
              <div class="form-group">
                <label>Name *</label>
                <input v-model="form.name" type="text" placeholder="Supplier name" />
                <span v-if="errors.name" class="error">{{ errors.name }}</span>
              </div>
              <div class="form-group">
                <label>Contact</label>
                <input v-model="form.contact" type="text" placeholder="Contact person" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="form.email" type="email" placeholder="Email address" />
              </div>
              <div class="form-group">
                <label>Address</label>
                <input v-model="form.address" type="text" placeholder="Supplier address" />
              </div>
              <div class="form-actions">
                <Button type="submit" variant="success" size="md">
                  <i class="fas fa-plus"></i> Add Supplier
                </Button>
                <Button type="button" variant="secondary" size="md" @click="resetForm">
                  <i class="fas fa-redo"></i> Reset
                </Button>
              </div>
            </form>
          </section>

          <section class="supplier-summary-panel">
            <h4>Supplier Directory</h4>
            <div v-if="suppliers.length === 0" class="empty-list">
              No suppliers available yet.
            </div>
            <div v-for="supplier in suppliers" :key="supplier.id" class="supplier-card">
              <div class="supplier-header">
                <div>
                  <h5>{{ supplier.name }}</h5>
                  <p>{{ supplier.contact || 'No contact provided' }}</p>
                </div>
                <button class="delete-btn" @click="confirmRemoveSupplier(supplier.id)">Remove</button>
              </div>
              <div class="supplier-info">
                <p><strong>Email:</strong> {{ supplier.email || 'N/A' }}</p>
                <p><strong>Address:</strong> {{ supplier.address || 'N/A' }}</p>
                <p><strong>Products supplied:</strong> {{ assignedProducts(supplier.id).length }}</p>
                <p><strong>Products supplied last month:</strong> {{ supplier.items_supplied_last_month?.length || 0 }}</p>
                <p><strong>Total units last month:</strong> {{ supplierMonthlyUnits(supplier) }}</p>
              </div>

              <div class="product-list" v-if="assignedProducts(supplier.id).length > 0">
                <h6>Assigned Products</h6>
                <ul>
                  <li v-for="product in assignedProducts(supplier.id)" :key="product.id">
                    {{ product.name }} (Stock: {{ product.stock_quantity }})
                  </li>
                </ul>
              </div>

              <div class="supply-list" v-if="supplier.items_supplied_last_month && supplier.items_supplied_last_month.length > 0">
                <h6>Supply last month</h6>
                <ul>
                  <li v-for="item in supplier.items_supplied_last_month" :key="item.product_id">
                    {{ item.product_name }}: {{ item.quantity }} units
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Supplier, Product } from '@/types'
import Button from '@/components/shared/Button.vue'

interface Props {
  isOpen: boolean
  suppliers: Supplier[]
  products: Product[]
}

interface Emits {
  close: []
  'add-supplier': [supplier: Omit<Supplier, 'id'>]
  'remove-supplier': [supplierId: number]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref({
  name: '',
  contact: '',
  email: '',
  address: ''
})

const errors = ref({
  name: ''
})

const handleClose = () => {
  emit('close')
}

const resetForm = () => {
  form.value = {
    name: '',
    contact: '',
    email: '',
    address: ''
  }
  errors.value.name = ''
}

const validateForm = () => {
  errors.value.name = ''
  if (!form.value.name.trim()) {
    errors.value.name = 'Supplier name is required'
    return false
  }
  return true
}

const submitSupplier = () => {
  if (!validateForm()) return
  emit('add-supplier', {
    name: form.value.name.trim(),
    contact: form.value.contact.trim() || undefined,
    email: form.value.email.trim() || undefined,
    address: form.value.address.trim() || undefined,
    items_supplied_last_month: []
  })
  resetForm()
}

const confirmRemoveSupplier = (id: number) => {
  if (confirm('Remove this supplier and unassign its products?')) {
    emit('remove-supplier', id)
  }
}

const assignedProducts = (supplierId: number) => {
  return props.products.filter(product => product.supplier_id === supplierId)
}

const supplierMonthlyUnits = (supplier: Supplier) => {
  return supplier.items_supplied_last_month?.reduce((sum: number, entry: { product_id: string; product_name: string; quantity: number }) => sum + (entry.quantity || 0), 0) ?? 0
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
  z-index: 1100;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 1100px;
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 24px;
}

.supplier-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
}

.supplier-form-panel,
.supplier-summary-panel {
  background: #f8fafc;
  border: 1px solid #e8ecf1;
  border-radius: 12px;
  padding: 20px;
}

.supplier-summary-panel {
  max-height: calc(80vh - 80px);
  overflow-y: auto;
}

.supplier-summary-panel::-webkit-scrollbar {
  width: 10px;
}

.supplier-summary-panel::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.35);
  border-radius: 10px;
}

.supplier-summary-panel::-webkit-scrollbar-track {
  background: transparent;
}

.supplier-form h4,
.supplier-summary-panel h4 {
  margin-top: 0;
  margin-bottom: 18px;
  font-size: 18px;
  color: #2c3e50;
}

.supplier-form .form-group {
  margin-bottom: 14px;
}

.supplier-form label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  color: #34495e;
}

.supplier-form input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dbe2ea;
  border-radius: 8px;
  background: white;
}

.error {
  display: block;
  margin-top: 4px;
  color: #c0392b;
  font-size: 13px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.supplier-card {
  background: white;
  border: 1px solid #e3eaf3;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 16px;
}

.supplier-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
}

.supplier-header h5 {
  margin: 0 0 6px 0;
  font-size: 16px;
}

.supplier-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.delete-btn {
  background: #ff5c5c;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.supplier-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #34495e;
}

.product-list,
.supply-list {
  margin-top: 16px;
}

.product-list h6,
.supply-list h6 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #2c3e50;
}

.product-list ul,
.supply-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-list li,
.supply-list li {
  margin: 6px 0;
  font-size: 14px;
  color: #515a6b;
}

.empty-list {
  font-size: 14px;
  color: #7f8c8d;
}

@media (max-width: 960px) {
  .supplier-grid {
    grid-template-columns: 1fr;
  }
}
</style>
