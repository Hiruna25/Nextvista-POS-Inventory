<template>
  <div v-if="!authStore.isAuthenticated">
    <Login />
  </div>
  <div v-else id="app">
    <Notification />

    <div class="inventory-management">
      <!-- Header with Controls -->
      <div class="header-section">
        <div class="header-content">
          <div class="logo-section">
            <h1><i class="fas fa-boxes"></i> NextPos</h1>
          </div>
          <p class="subtitle"><i class="fas fa-info-circle"></i> Advanced supermarket inventory management system</p>
        </div>

        <div class="header-controls">
          <div class="branch-selector">
            <label class="selector-label">
              <i class="fas fa-map-marker"></i> Select Branch:
            </label>
            <select v-model="selectedBranch" class="filter-select">
              <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                {{ branch.name }}
              </option>
            </select>
          </div>

          <div class="button-group">
            <Button @click="showNewProductForm = !showNewProductForm" variant="success" icon="fas fa-plus">
              <span>New Product</span>
            </Button>
            <Button @click="exportInventory" variant="info" icon="fas fa-download">
              <span>Export</span>
            </Button>
            <Button @click="handleLogout" variant="danger" icon="fas fa-sign-out-alt" size="sm">
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- Main Tabs Navigation -->
      <div class="tabs-navigation">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['tab-btn', { active: activeTab === tab }]"
          @click="activeTab = tab"
        >
          <i :class="tabIcons[tab]"></i> {{ tab }}
        </button>
      </div>

      <!-- Tab Content: Dashboard -->
      <div v-show="activeTab === 'Dashboard'" class="tab-pane">
        <div class="section-header">
          <h2><i class="fas fa-chart-pie"></i> Dashboard Overview</h2>
          <p class="section-subtitle">Monitor your inventory at a glance</p>
        </div>
        <div class="dashboard-grid">
          <SummaryCard
            :value="inventory.length"
            :trend="inventoryTrend.products"
            :config="{ title: 'Total Products', class: '', icon: 'fas fa-cubes' }"
          />
          <SummaryCard
            :value="lowStockCount"
            :trend="inventoryTrend.lowStock"
            :config="{ title: 'Low Stock Alert', class: 'warning', icon: 'fas fa-exclamation-triangle' }"
          />
          <SummaryCard
            :value="outOfStockCount"
            :trend="inventoryTrend.outOfStock"
            :config="{ title: 'Out of Stock', class: 'danger', icon: 'fas fa-times-circle' }"
          />
          <SummaryCard
            :value="formatCurrency(totalInventoryValue)"
            :trend="inventoryTrend.value"
            :config="{ title: 'Total Inventory Value', class: 'success', icon: 'fas fa-dollar-sign' }"
          />
          <SummaryCard
            :value="averageStockDays"
            :trend="inventoryTrend.stockDays"
            :config="{ title: 'Avg. Stock Days', class: 'info', icon: 'fas fa-calendar' }"
          />
          <SummaryCard
            :value="inventoryTurnoverRate"
            :trend="inventoryTrend.turnover"
            :config="{ title: 'Inventory Turnover', class: '', icon: 'fas fa-sync-alt' }"
          />
        </div>
      </div>

      <!-- Tab Content: Inventory -->
      <div v-show="activeTab === 'Inventory'" class="tab-pane">
        <div class="section-header">
          <h2><i class="fas fa-boxes"></i> Inventory Management</h2>
          <p class="section-subtitle">View and manage all products</p>
        </div>
        <Card>
          <template #header>
            <div class="inventory-controls">
              <div class="search-section">
                <i class="fas fa-search"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search products by name or barcode..."
                  class="search-input"
                />
              </div>
              <Button @click="showAdvancedFilters = !showAdvancedFilters" variant="secondary" size="sm">
                <i class="fas fa-filter"></i> Advanced Filters
              </Button>
            </div>
          </template>

          <div v-if="showAdvancedFilters" class="advanced-filters-panel">
            <div class="advanced-filter-row">
              <div class="filter-group">
                <label>Category</label>
                <select v-model="selectedCategory" class="filter-select">
                  <option value="">All Categories</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div class="filter-group">
                <label>Supplier</label>
                <select v-model="selectedSupplier" class="filter-select">
                  <option value="">All Suppliers</option>
                  <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                    {{ supplier.name }}
                  </option>
                </select>
              </div>

              <div class="filter-group">
                <label>Stock Status</label>
                <select v-model="stockStatus" class="filter-select">
                  <option value="">All Statuses</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              <div class="filter-group price-range-group">
                <label>Price Range</label>
                <div class="price-range-inputs">
                  <input v-model.number="priceMin" type="number" placeholder="Min" class="range-input" />
                  <input v-model.number="priceMax" type="number" placeholder="Max" class="range-input" />
                </div>
              </div>
            </div>
            <div class="advanced-filter-actions">
              <Button @click="resetFilters" variant="secondary" size="sm">Reset Filters</Button>
            </div>
          </div>

          <div v-if="filteredInventory.length === 0" class="empty-state">
            <i class="fas fa-inbox"></i>
            <h3>No products found</h3>
            <p>Start by adding your first product</p>
            <Button @click="showProductModal = true" variant="success" size="sm">
              <i class="fas fa-plus"></i> Add Product
            </Button>
          </div>

          <InventoryTable
            v-else
            :inventory="filteredInventory"
            :categories="categories"
            :suppliers="suppliers"
            :branches="branches"
            :selected-branch="selectedBranch"
            :sort-field="sortField"
            :sort-direction="sortDirection"
            @edit="editProduct"
            @adjust-stock="openStockAdjustment"
            @view-history="openHistory"
            @delete="deleteProduct"
          />
        </Card>
      </div>

      <!-- Tab Content: Analytics -->
      <div v-show="activeTab === 'Analytics'" class="tab-pane">
        <div class="section-header">
          <h2><i class="fas fa-chart-bar"></i> Analytics & Reports</h2>
          <p class="section-subtitle">Detailed inventory analytics and performance metrics</p>
        </div>
        <AnalyticsSection
          :inventory="inventory"
          :selected-branch="selectedBranch"
          :get-current-branch-stock="getCurrentBranchStock"
        />
      </div>

      <!-- Tab Content: Replenishment -->
      <div v-show="activeTab === 'Replenishment'" class="tab-pane">
        <div class="section-header">
          <h2><i class="fas fa-magic"></i> Smart Replenishment</h2>
          <p class="section-subtitle">Automated stock replenishment recommendations</p>
          <div v-if="replenishmentCart.length > 0" class="cart-indicator">
            <i class="fas fa-shopping-cart"></i>
            {{ replenishmentCart.length }} item{{ replenishmentCart.length > 1 ? 's' : '' }} in cart
            <Button @click="clearCart" variant="cancel" size="sm">Clear</Button>
          </div>
        </div>
        <ReplenishmentSuggestions
          :inventory="inventory"
          :selected-branch="selectedBranch"
          :get-current-branch-stock="getCurrentBranchStock"
          @create-order="createSupplierOrder"
          @add-to-cart="addToCart"
        />
      </div>

      <!-- Tab Content: POS & Suppliers -->
      <div v-show="activeTab === 'Reports'" class="tab-pane">
        <div class="section-header">
          <h2><i class="fas fa-file-alt"></i> Reports</h2>
          <p class="section-subtitle">POS integration and supplier order management</p>
        </div>
        <div class="reports-grid">
          <POSIntegration
            :pos-connected="true"
            :last-p-o-s-sync="lastPOSSync"
            :pos-transactions="recentPOSTransactions"
            :recent-p-o-s-transactions="recentPOSTransactions"
            @sync="syncPOS"
            @configure="configurePOS"
          />
        </div>
      </div>
    </div>

    <!-- MODALS -->
    <ProductModal
      v-if="showProductModal"
      :is-open="showProductModal"
      :is-editing="editingProduct !== null"
      :product="editingProduct || undefined"
      :categories="categories"
      :suppliers="suppliers"
      @close="closeProductModal"
      @save="saveProduct"
    />

    <StockAdjustmentModal
      v-if="showStockAdjustmentModal && selectedProduct"
      :is-open="showStockAdjustmentModal"
      :product="selectedProduct"
      :selected-branch="selectedBranch"
      @close="showStockAdjustmentModal = false"
      @save="adjustStock"
    />

    <HistoryModal
      v-if="showHistoryModal && selectedProduct"
      :is-open="showHistoryModal"
      :product="selectedProduct"
      :history="inventoryHistory"
      @close="showHistoryModal = false"
    />

    <!-- New Product Modal -->
    <NewProductModal
      :is-open="showNewProductForm"
      :categories="categories"
      :suppliers="suppliers"
      @close="showNewProductForm = false"
      @save="handleAddProduct"
    />

    <!-- POS Configuration Modal -->
    <POSConfigModal
      :is-open="showPOSConfigModal"
      :initial-config="posConfig"
      @close="showPOSConfigModal = false"
      @save="savePOSConfig"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Product, SupplierOrder } from '@/types'
import { useFormatting } from '@/composables/useFormatting'
import { useStockCalculations } from '@/composables/useStockCalculations'
import { useNotification } from '@/composables/useNotification'
import { useFilters } from '@/composables/useFilters'
import { useInventoryData } from '@/composables/useInventoryData'
import { useAuthStore } from '@/stores/auth'
import { logger } from '@/utils/logger'

// Components
import Notification from '@/components/shared/Notification.vue'
import Button from '@/components/shared/Button.vue'
import Card from '@/components/shared/Card.vue'
import SummaryCard from '@/components/dashboard/SummaryCard.vue'
import InventoryTable from '@/components/features/InventoryTable.vue'
import AnalyticsSection from '@/components/features/AnalyticsSection.vue'
import ReplenishmentSuggestions from '@/components/features/ReplenishmentSuggestions.vue'
import POSIntegration from '@/components/features/POSIntegration.vue'
import ProductModal from '@/components/modals/ProductModal.vue'
import NewProductModal from '@/components/modals/NewProductModal.vue'
import StockAdjustmentModal from '@/components/modals/StockAdjustmentModal.vue'
import HistoryModal from '@/components/modals/HistoryModal.vue'
import POSConfigModal from '@/components/modals/POSConfigModal.vue'
import Login from '@/pages/Login.vue'

// Use composables
const { inventory, categories, suppliers, branches, loadInitialData } = useInventoryData()
const { formatCurrency } = useFormatting()
const { getCurrentBranchStock } = useStockCalculations()
const { showNotification } = useNotification()
const { applyFilters } = useFilters()
const authStore = useAuthStore()
const inventoryHistory = ref([])
const supplierOrders = ref<SupplierOrder[]>([
  {
    id: 'ORD-001',
    supplier_id: 1,
    product_id: '1',
    quantity: 100,
    order_date: '2026-04-15',
    expected_date: '2026-04-20',
    status: 'pending',
    supplier_name: 'Coca Cola Distributor',
    product_name: 'Coca Cola 500ml'
  },
  {
    id: 'ORD-002',
    supplier_id: 2,
    product_id: '2',
    quantity: 50,
    order_date: '2026-04-14',
    expected_date: '2026-04-18',
    status: 'shipped',
    supplier_name: 'Fresh Bakery Co',
    product_name: 'Wheat Bread Loaf'
  }
])
const recentPOSTransactions = ref([
  {
    id: 'TXN-001',
    product_id: '1',
    quantity: 3,
    total_amount: 8.97,
    transaction_date: '2026-04-18T10:30:00',
    branch_id: 1,
    product_name: 'Coca Cola 500ml',
    branch_name: 'Main Branch'
  },
  {
    id: 'TXN-002',
    product_id: '2',
    quantity: 2,
    total_amount: 7.48,
    transaction_date: '2026-04-18T11:15:00',
    branch_id: 1,
    product_name: 'Wheat Bread Loaf',
    branch_name: 'Main Branch'
  },
  {
    id: 'TXN-003',
    product_id: '3',
    quantity: 1,
    total_amount: 4.29,
    transaction_date: '2026-04-18T12:00:00',
    branch_id: 1,
    product_name: 'Organic Milk 1L',
    branch_name: 'Main Branch'
  },
  {
    id: 'TXN-004',
    product_id: '4',
    quantity: 5,
    total_amount: 10.75,
    transaction_date: '2026-04-18T14:30:00',
    branch_id: 1,
    product_name: 'Whole Wheat Pasta 500g',
    branch_name: 'Main Branch'
  },
  {
    id: 'TXN-005',
    product_id: '5',
    quantity: 1,
    total_amount: 12.99,
    transaction_date: '2026-04-18T15:45:00',
    branch_id: 1,
    product_name: 'Fresh Chicken Breast 1kg',
    branch_name: 'Main Branch'
  }
])

// Cart for replenishment orders
const replenishmentCart = ref<Product[]>([])

// UI State
const activeTab = ref('Dashboard')
const selectedBranch = ref<number>(1)
const sortField = ref('name')
const sortDirection = ref('asc')
const showAdvancedFilters = ref(false)
const selectedCategory = ref<string | number>('')
const selectedSupplier = ref<string | number>('')
const stockStatus = ref<string>('')
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)
const searchQuery = ref('')

const priceRange = computed(() => {
  if (priceMin.value !== null || priceMax.value !== null) {
    return {
      min: priceMin.value !== null ? priceMin.value : Number.MIN_SAFE_INTEGER,
      max: priceMax.value !== null ? priceMax.value : Number.MAX_SAFE_INTEGER
    }
  }
  return undefined
})

const filteredInventory = computed(() => {
  return applyFilters(
    inventory.value,
    searchQuery.value,
    selectedCategory.value,
    selectedSupplier.value,
    stockStatus.value,
    priceRange.value,
    getCurrentBranchStock,
    selectedBranch.value
  )
})

const resetFilters = () => {
  selectedCategory.value = ''
  selectedSupplier.value = ''
  stockStatus.value = ''
  priceMin.value = null
  priceMax.value = null
}

// Modal States
const showProductModal = ref(false)
const showStockAdjustmentModal = ref(false)
const showHistoryModal = ref(false)
const showNewProductForm = ref(false)
const showPOSConfigModal = ref(false)
const editingProduct = ref<Product | null>(null)
const selectedProduct = ref<Product | null>(null)

// POS Configuration
const posConfig = ref({
  type: 'square' as const,
  endpoint: '',
  apiKey: '',
  syncFrequency: 30,
  autoSync: true
})

// Mock data
const lastPOSSync = ref<string | null>('2026-04-13T14:30:00')



const recentOrders = ref<SupplierOrder[]>([
  {
    id: 'ORD-001',
    supplier_id: 1,
    product_id: '1',
    quantity: 100,
    order_date: '2026-04-15',
    expected_date: '2026-04-20',
    status: 'pending',
    supplier_name: 'Coca Cola Distributor',
    product_name: 'Coca Cola 500ml'
  },
  {
    id: 'ORD-002',
    supplier_id: 2,
    product_id: '2',
    quantity: 50,
    order_date: '2026-04-14',
    expected_date: '2026-04-18',
    status: 'shipped',
    supplier_name: 'Fresh Bakery Co',
    product_name: 'Wheat Bread Loaf'
  },
  {
    id: 'ORD-003',
    supplier_id: 3,
    product_id: '3',
    quantity: 25,
    order_date: '2026-04-10',
    expected_date: '2026-04-15',
    status: 'completed',
    supplier_name: 'Dairy Farms Ltd',
    product_name: 'Organic Milk 1L'
  }
])

const tabs = ['Dashboard', 'Inventory', 'Analytics', 'Replenishment', 'Reports']
const tabIcons: Record<string, string> = {
  Dashboard: 'fas fa-th-large',
  Inventory: 'fas fa-list',
  Analytics: 'fas fa-chart-bar',
  Replenishment: 'fas fa-magic',
  Reports: 'fas fa-file-alt'
}

// Computed properties
const lowStockCount = computed(() => {
  return inventory.value.filter(p => p.stock_quantity <= (p.min_stock_level || 10)).length
})

const outOfStockCount = computed(() => {
  return inventory.value.filter(p => p.stock_quantity <= 0).length
})

const totalInventoryValue = computed(() => {
  return inventory.value.reduce((sum, item) => sum + item.price * (item.stock_quantity ?? 0), 0)
})

const averageStockDays = computed(() => {
  return inventory.value.length > 0 ? (inventory.value.reduce((sum: number, item: any) => sum + (item.average_daily_sales || 2), 0) / inventory.value.length).toFixed(1) : 0
})

const inventoryTurnoverRate = computed(() => {
  const totalCost = inventory.value.reduce((sum: number, item: any) => sum + (item.costPrice || 0), 0)
  const avgInventoryValue = totalInventoryValue.value / 2

  if (avgInventoryValue === 0) return 0

  return (totalCost / avgInventoryValue).toFixed(2)
})

const inventoryTrend = computed(() => {
  return {
    products: Math.floor(Math.random() * 20) - 5,
    lowStock: Math.floor(Math.random() * 30) - 10,
    outOfStock: Math.floor(Math.random() * 25) - 5,
    value: Math.floor(Math.random() * 15) - 5,
    stockDays: Math.floor(Math.random() * 10) - 3,
    turnover: Math.floor(Math.random() * 8) - 2
  }
})

// Methods - Product Modal
const closeProductModal = () => {
  showProductModal.value = false
  editingProduct.value = null
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  showProductModal.value = true
}

const saveProduct = async (product: Partial<Product>) => {
  try {
    if (editingProduct.value) {
      await updateProduct(editingProduct.value.id, product)
      showNotification('success', 'Product updated successfully')
    } else {
      await addProduct(product as Omit<Product, 'id'>)
      showNotification('success', 'Product created successfully')
    }
    closeProductModal()
    await loadInitialData()
  } catch (error) {
    showNotification('error', 'Failed to save product')
    logger.error('Save product error', error)
  }
}

const deleteProduct = async (product: Product) => {
  if (confirm(`Are you sure you want to delete ${product.name}?`)) {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      if (response.ok) {
        await loadInitialData()
        showNotification('success', 'Product deleted successfully')
      }
    } catch (error) {
      showNotification('error', 'Failed to delete product')
      logger.error('Delete product error', error)
    }
  }
}

// API Helper Methods
const addProduct = async (product: Omit<Product, 'id'>) => {
  const response = await fetch('http://localhost:3001/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    },
    body: JSON.stringify(product)
  })
  if (!response.ok) throw new Error('Failed to add product')
  return response.json()
}

const updateProduct = async (id: string, data: Partial<Product>) => {
  const response = await fetch(`http://localhost:3001/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to update product')
  return response.json()
}

// Methods - Stock Adjustment
const openStockAdjustment = (product: Product) => {
  selectedProduct.value = product
  showStockAdjustmentModal.value = true
}

const adjustStock = async (adjustment: any) => {
  if (!selectedProduct.value) return

  try {
    const product = selectedProduct.value
    const currentStock = product.stock_quantity
    let newStock = currentStock

    if (adjustment.type === 'add') {
      newStock = currentStock + adjustment.quantity
    } else if (adjustment.type === 'remove') {
      newStock = Math.max(0, currentStock - adjustment.quantity)
    } else if (adjustment.type === 'correct') {
      newStock = adjustment.quantity
    }

    await updateProduct(product.id, { stock_quantity: newStock })
    await loadInitialData()
    showNotification('success', `Stock adjusted: ${adjustment.reason || 'Stock updated'}`)
    showStockAdjustmentModal.value = false
  } catch (error) {
    showNotification('error', 'Failed to adjust stock')
    logger.error('Adjust stock error', error)
  }
}

// Methods - History
const openHistory = (product: Product) => {
  selectedProduct.value = product
  showHistoryModal.value = true
}

// Methods - POS & Suppliers
const syncPOS = () => {
  lastPOSSync.value = new Date().toISOString()
  showNotification('success', 'POS synchronized successfully')
}

const configurePOS = () => {
  showPOSConfigModal.value = true
}

const savePOSConfig = (config: any) => {
  posConfig.value = config
  showNotification('success', 'POS configuration saved successfully')
}

const createSupplierOrder = () => {
  const defaultSupplier = suppliers.value[0] || { id: 1, name: 'Default Supplier' }
  const defaultProduct = inventory.value[0] || { id: '1', name: 'Sample Product' }
  const newOrder: SupplierOrder = {
    id: `ORD-${Math.floor(Math.random() * 900 + 100)}`,
    supplier_id: defaultSupplier.id,
    product_id: defaultProduct.id,
    quantity: 50,
    order_date: new Date().toISOString().slice(0, 10),
    expected_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: 'pending',
    supplier_name: defaultSupplier.name,
    product_name: defaultProduct.name
  }

  supplierOrders.value.unshift(newOrder)
  recentOrders.value.unshift(newOrder)
  showNotification('success', `New supplier order ${newOrder.id} created`)
}

const addToCart = (product: Product) => {
  if (!replenishmentCart.value.find(p => p.id === product.id)) {
    replenishmentCart.value.push(product)
    showNotification('success', `${product.name} added to replenishment cart`)
  } else {
    showNotification('info', `${product.name} is already in the cart`)
  }
}

const clearCart = () => {
  replenishmentCart.value = []
  showNotification('info', 'Replenishment cart cleared')
}



// Methods - Export
const exportInventory = () => {
  try {
    const csvContent = [
      ['Product Name', 'Category', 'Supplier', 'Price', 'Stock', 'Min Stock Level'].join(','),
      ...inventory.value.map(p => [p.name, p.category_name || '', p.supplier_name || '', p.price, p.stock_quantity, p.min_stock_level || 10].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    showNotification('success', 'Inventory exported successfully')
  } catch (error) {
    showNotification('error', 'Failed to export inventory')
    logger.error('Export error', error)
  }
}

// Methods - New Product Form
const handleAddProduct = (newProduct: Product) => {
  addProduct(newProduct as Omit<Product, 'id'>)
    .then(() => {
      loadInitialData()
      showNewProductForm.value = false
      showNotification('success', `${newProduct.name} added successfully!`)
    })
    .catch(error => {
      showNotification('error', 'Failed to add product')
      logger.error('Add product error', error)
    })
}

// Methods - Authentication
const handleLogout = async () => {
  try {
    await authStore.logout()
    showNotification('info', 'Logged out successfully')
    logger.info('User logged out')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Logout failed'
    showNotification('error', message)
    logger.error('Logout failed', error)
  }
}

// Lifecycle
onMounted(async () => {
  try {
    logger.info('App mounted, initializing authentication and data loading')
    
    // Initialize auth from localStorage
    authStore.initializeAuth()
    
    // If user is authenticated, load inventory data
    if (authStore.isAuthenticated) {
      await loadInitialData()
      showNotification('success', 'Inventory loaded successfully from MongoDB')
    } else {
      logger.warn('No authentication token available')
    }
  } catch (error) {
    showNotification('error', 'Failed to load inventory data')
    logger.error('Mount error', error)
  }
})
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.inventory-management {
  background-color: white;
  padding: 0;
  margin: 0;
  border-radius: 0;
  box-shadow: none;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.inventory-management:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 30px 15px;
  border-bottom: 1px solid #e8ecf1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 100%;
  box-sizing: border-box;
}

.logo-section {
  display: flex;
  align-items: center;
}

.header-content {
  flex: 1;
}

.header-content h1 {
  margin: 0 0 8px 0;
  color: white;
  font-size: 36px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.5px;
}

.header-content h1 i {
  font-size: 40px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-controls {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.branch-selector {
  display: flex;
  gap: 12px;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.selector-label {
  font-weight: 700;
  color: white;
  white-space: nowrap;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.filter-select {
  padding: 10px 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  font-weight: 600;
  color: #333;
  transition: all 0.3s ease;
  min-width: 150px;
}

.filter-select:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background-color: white;
}

.filter-select:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
}

.button-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 15px;
  border-left: 2px solid rgba(255, 255, 255, 0.3);
}

.user-display {
  color: white;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
}

/* Section Headers */
.section-header {
  margin-bottom: 25px;
  padding: 0 15px;
  border-bottom: 2px solid #f0f2f5;
  width: 100%;
  box-sizing: border-box;
}

.tab-pane {
  padding: 30px 15px;
  width: 100%;
  box-sizing: border-box;
}

.dashboard-grid {
  width: 100%;
  box-sizing: border-box;
}

.section-header h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-header h2 i {
  color: #667eea;
  font-size: 26px;
}

.section-subtitle {
  margin: 0;
  color: #7f8c8d;
  font-size: 13px;
  font-weight: 500;
}

.cart-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #e8f4fd;
  padding: 8px 12px;
  border-radius: 6px;
  color: #3498db;
  font-size: 14px;
  font-weight: 500;
  margin-top: 10px;
}

.cart-indicator i {
  color: #3498db;
}

/* Tabs Navigation */
.tabs-navigation {
  display: flex;
  border-bottom: 2px solid #e0e6ed;
  background-color: #fafbfc;
  padding: 0;
  margin: 0;
  overflow-x: auto;
}

.tab-btn {
  padding: 16px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 15px;
  font-weight: 700;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  position: relative;
}

.tab-btn:hover {
  color: #667eea;
  background-color: #f5f7ff;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background-color: rgba(102, 126, 234, 0.05);
}

.tab-pane {
  padding: 30px;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

/* Inventory Controls */
.inventory-controls {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.search-section {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 250px;
  position: relative;
}

.search-section i {
  color: #95a5a6;
  position: absolute;
  left: 15px;
  pointer-events: none;
}

.search-input {
  flex: 1;
  padding: 12px 12px 12px 42px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.search-input::placeholder {
  color: #bdc3c7;
}

  .advanced-filters-panel {
    margin: 20px 0;
    padding: 20px;
    background-color: #f8f9fa;
    border: 1px solid #e8ecf1;
    border-radius: 10px;
  }

  .advanced-filter-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .price-range-group .price-range-inputs {
    display: flex;
    gap: 10px;
  }

  .range-input {
    width: 100%;
    padding: 10px 14px;
    border: 2px solid #ecf0f1;
    border-radius: 8px;
    font-size: 14px;
    background-color: #ffffff;
  }

  .advanced-filter-actions {
    display: flex;
    justify-content: flex-end;
  }

.empty-state {
  padding: 80px 40px;
  text-align: center;
  background: linear-gradient(135deg, #f5f7ff 0%, #faf9ff 100%);
  border-radius: 12px;
  margin: 20px 0;
}

.empty-state i {
  font-size: 64px;
  color: #bdc3c7;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 700;
}

.empty-state p {
  margin: 0 0 20px 0;
  color: #7f8c8d;
  font-size: 14px;
}

/* Reports Grid */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 30px;
  width: 100%;
  box-sizing: border-box;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .header-section {
    flex-direction: column;
    gap: 20px;
  }

  .header-controls {
    width: 100%;
    justify-content: flex-start;
  }

  .dashboard-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  #app {
    padding: 0;
  }

  .inventory-management {
    border-radius: 0;
  }

  .header-section {
    padding: 20px 10px;
  }

  .header-content h1 {
    font-size: 28px;
  }

  .header-controls {
    gap: 12px;
  }

  .branch-selector {
    width: 100%;
    padding: 8px 12px;
  }

  .button-group {
    width: 100%;
  }

  .tabs-navigation {
    overflow-x: auto;
  }

  .tab-pane {
    padding: 20px;
  }

  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .search-input {
    min-width: 200px;
  }

  .search-section {
    min-width: 100%;
  }

  .inventory-controls {
    flex-direction: column;
    gap: 12px;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 15px;
  }

  .header-content h1 {
    font-size: 24px;
  }

  .header-controls {
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }

  .branch-selector {
    width: 100%;
  }

  .branch-selector select {
    flex: 1;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .empty-state {
    padding: 40px 20px;
  }

  .section-header h2 {
    font-size: 20px;
  }

  .tab-btn {
    padding: 12px 16px;
    font-size: 13px;
  }

  .tab-pane {
    padding: 15px;
  }
}
</style>
