import { ref } from 'vue'
import axios from 'axios'
import type {
  Product,
  Category,
  Supplier,
  Branch,
  InventoryHistoryEntry,
  SupplierOrder,
  POSTransaction
} from '@/types'

const API_BASE = 'http://localhost:3001/api'

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token')
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json'
    }
  }
}

export function useInventoryData() {
  const inventory = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const suppliers = ref<Supplier[]>([])
  const branches = ref<Branch[]>([])
  const inventoryHistory = ref<InventoryHistoryEntry[]>([])
  const supplierOrders = ref<SupplierOrder[]>([])
  const recentPOSTransactions = ref<POSTransaction[]>([])

  const normalizeProduct = (product: any): Product => {
    if (!product) return product

    return {
      ...product,
      stock_quantity: product.stock_quantity ?? product.stockQuantity ?? 0,
      min_stock_level: product.min_stock_level ?? product.minStockLevel ?? 10,
      max_stock_level: product.max_stock_level ?? product.maxStockLevel ?? 100,
      category_id: product.category_id ?? product.category?._id ?? product.category?.id,
      category_name: product.category_name ?? product.category?.name,
      supplier_id: product.supplier_id ?? product.supplier?._id ?? product.supplier?.id,
      supplier_name: product.supplier_name ?? product.supplier?.name,
      branch_id: product.branch_id ?? product.branch?._id ?? product.branch?.id,
      branch_name: product.branch_name ?? product.branch?.name,
    }
  }

  const normalizeProducts = (products: any[]): Product[] => {
    if (!Array.isArray(products)) return []
    return products.map(normalizeProduct)
  }

  const loadInitialData = async () => {
    try {
      const authHeaders = getAuthHeaders()
      const [productsRes, categoriesRes, suppliersRes, branchesRes, historyRes, ordersRes, posRes] = await Promise.all([
        axios.get(`${API_BASE}/products`, authHeaders),
        axios.get(`${API_BASE}/categories`, authHeaders),
        axios.get(`${API_BASE}/suppliers`, authHeaders),
        axios.get(`${API_BASE}/branches`, authHeaders),
        axios.get(`${API_BASE}/inventory-history`, authHeaders),
        axios.get(`${API_BASE}/supplier-orders`, authHeaders),
        axios.get(`${API_BASE}/pos-transactions`, authHeaders)
      ])

      // Handle both direct data and wrapped data responses
      inventory.value = normalizeProducts(productsRes.data.data || productsRes.data)
      categories.value = categoriesRes.data.data || categoriesRes.data
      suppliers.value = suppliersRes.data.data || suppliersRes.data
      branches.value = branchesRes.data.data || branchesRes.data
      inventoryHistory.value = historyRes.data.data || historyRes.data
      supplierOrders.value = ordersRes.data.data || ordersRes.data
      recentPOSTransactions.value = posRes.data.data || posRes.data
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const response = await axios.post(`${API_BASE}/products`, product, getAuthHeaders())
      const created = normalizeProduct(response.data.data || response.data)
      inventory.value.push(created)
      return created
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  }

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const response = await axios.put(`${API_BASE}/products/${id}`, product, getAuthHeaders())
      const updated = normalizeProduct(response.data.data || response.data)
      const index = inventory.value.findIndex(p => p.id === id)
      if (index !== -1) {
        inventory.value[index] = updated
      }
      return updated
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/products/${id}`, getAuthHeaders())
      inventory.value = inventory.value.filter(p => p.id !== id)
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  const addInventoryHistory = async (entry: Omit<InventoryHistoryEntry, 'id'>) => {
    try {
      const response = await axios.post(`${API_BASE}/inventory-history`, entry, getAuthHeaders())
      inventoryHistory.value.unshift(response.data.data || response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('Error adding inventory history:', error)
      throw error
    }
  }

  const addPOSTransaction = async (transaction: Omit<POSTransaction, 'id'>) => {
    try {
      const response = await axios.post(`${API_BASE}/pos-transactions`, transaction, getAuthHeaders())
      recentPOSTransactions.value.unshift(response.data.data || response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('Error adding POS transaction:', error)
      throw error
    }
  }

  const addSupplierOrder = async (order: Omit<SupplierOrder, 'id'>) => {
    try {
      const response = await axios.post(`${API_BASE}/supplier-orders`, order, getAuthHeaders())
      supplierOrders.value.unshift(response.data.data || response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('Error adding supplier order:', error)
      throw error
    }
  }

  return {
    inventory,
    categories,
    suppliers,
    branches,
    inventoryHistory,
    supplierOrders,
    recentPOSTransactions,
    loadInitialData,
    addProduct,
    updateProduct,
    deleteProduct,
    addInventoryHistory,
    addPOSTransaction,
    addSupplierOrder
  }
}
