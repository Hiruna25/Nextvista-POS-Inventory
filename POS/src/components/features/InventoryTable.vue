<template>
  <div class="inventory-table-container">
    <table class="inventory-table">
      <thead>
        <tr>
          <th @click="$emit('sort', 'name')">Product Name</th>
          <th @click="$emit('sort', 'category')">Category</th>
          <th @click="$emit('sort', 'supplier')">Supplier</th>
          <th @click="$emit('sort', 'stock')">Stock</th>
          <th @click="$emit('sort', 'price')">Price</th>
          <th @click="$emit('sort', 'value')">Value</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in inventory" :key="item.id">
          <td>
            <div>{{ item.name }}</div>
            <div style="font-size: 12px">{{ item.barcode }}</div>
          </td>
          <td>{{ item.category_name || getCategoryNameHelper(item.category_id) }}</td>
          <td>{{ item.supplier_name || getSupplierNameHelper(item.supplier_id) }}</td>
          <td>{{ getCurrentBranchStock(item, props.selectedBranch) }}</td>
          <td>{{ formatCurrency(item.price) }}</td>
          <td>{{ formatCurrency(getCurrentBranchStock(item, props.selectedBranch) * item.cost) }}</td>
          <td>
            <span v-if="getCurrentBranchStock(item, props.selectedBranch) === 0" class="badge badge-danger">
              Out of Stock
            </span>
            <span v-else-if="getCurrentBranchStock(item, props.selectedBranch) <= (item.min_stock_level || 10)" class="badge badge-warning">
              Low Stock
            </span>
            <span v-else class="badge badge-success">In Stock</span>
          </td>
          <td>
            <Button @click="$emit('edit', item)" variant="edit" size="sm">
              <i class="fas fa-edit"></i>
            </Button>
            <Button @click="$emit('adjust-stock', item)" variant="stock" size="sm">
              <i class="fas fa-boxes"></i>
            </Button>
            <Button @click="$emit('view-history', item)" variant="primary" size="sm">
              <i class="fas fa-history"></i>
            </Button>
            <Button @click="$emit('delete', item)" variant="danger" size="sm">
              <i class="fas fa-trash"></i>
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Product, Category, Supplier, Branch } from '@/types'
import { useFormatting } from '@/composables/useFormatting'
import { useStockCalculations } from '@/composables/useStockCalculations'
import { getCategoryName, getSupplierName } from '@/utils/helpers'
import Button from '@/components/shared/Button.vue'

const props = defineProps<{
  inventory: Product[]
  categories: Category[]
  suppliers: Supplier[]
  branches: Branch[]
  selectedBranch: number
  sortField: string
  sortDirection: string
}>()

defineEmits<{
  sort: [field: string]
  edit: [product: Product]
  'adjust-stock': [product: Product]
  'view-history': [product: Product]
  'show-barcode': [product: Product]
  delete: [product: Product]
}>()

const { formatCurrency } = useFormatting()
const { getCurrentBranchStock } = useStockCalculations()

// Create helpers to avoid TypeScript inference issues
const getCategoryNameHelper = (category_id: number | string | undefined) => getCategoryName(category_id, props.categories)
const getSupplierNameHelper = (supplier_id: number | string | undefined) => getSupplierName(supplier_id, props.suppliers)
</script>

<style scoped>
.inventory-table-container {
  overflow-x: auto;
  margin-bottom: 20px;
  border-radius: 6px;
  border: 1px solid #e0e6ed;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.inventory-table th,
.inventory-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e6ed;
}

.inventory-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #2c3e50;
  cursor: pointer;
  user-select: none;
}

.inventory-table th:hover {
  background-color: #f1f5f9;
}

.inventory-table tr:hover {
  background-color: #f8fafc;
}

.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.badge-success {
  background-color: #27ae60;
}

.badge-warning {
  background-color: #f39c12;
}

.badge-danger {
  background-color: #e74c3c;
}

@media (max-width: 768px) {
  .inventory-table th,
  .inventory-table td {
    padding: 8px 10px;
    font-size: 12px;
  }
}
</style>
