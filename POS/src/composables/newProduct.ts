import { ref, computed } from 'vue'
import type { Product, Category, Supplier } from '@/types'

// Dummy Data Generator
const generateDummyProducts = (): Product[] => [
  {
    id: '1',
    name: 'Coca Cola 500ml',
    category_id: 1,
    category_name: 'Beverages',
    supplier_id: 1,
    supplier_name: 'Coca Cola Distributor',
    barcode: '5449000050127',
    stock_quantity: 245,
    min_stock_level: 50,
    price: 2.99,
    cost: 1.50,
    expiry_date: '2027-04-15',
    description: 'Refreshing cola beverage',
    dailySales: 25
  },
  {
    id: '2',
    name: 'Wheat Bread Loaf',
    category_id: 2,
    category_name: 'Bakery',
    supplier_id: 2,
    supplier_name: 'Fresh Bakery Co',
    barcode: '6001234567890',
    stock_quantity: 42,
    min_stock_level: 30,
    price: 3.49,
    cost: 1.75,
    expiry_date: '2026-04-15',
    description: 'Fresh whole wheat bread',
    dailySales: 15
  },
  {
    id: '3',
    name: 'Organic Milk 1L',
    category_id: 3,
    category_name: 'Dairy',
    supplier_id: 3,
    supplier_name: 'Dairy Farms Ltd',
    barcode: '5412345678901',
    stock_quantity: 15,
    min_stock_level: 40,
    price: 4.29,
    cost: 2.20,
    expiry_date: '2026-04-20',
    description: 'Pure organic milk',
    dailySales: 8
  },
  {
    id: '4',
    name: 'Whole Wheat Pasta 500g',
    category_id: 4,
    category_name: 'Pantry',
    supplier_id: 4,
    supplier_name: 'Global Foods Inc',
    barcode: '8714567123456',
    stock_quantity: 89,
    min_stock_level: 25,
    price: 2.15,
    cost: 0.95,
    expiry_date: '2027-12-31',
    description: 'Healthy whole wheat pasta',
    dailySales: 12
  },
  {
    id: '5',
    name: 'Fresh Chicken Breast 1kg',
    category_id: 5,
    category_name: 'Meat & Poultry',
    supplier_id: 5,
    supplier_name: 'Premium Meat Suppliers',
    barcode: '7123456789012',
    stock_quantity: 8,
    min_stock_level: 20,
    price: 12.99,
    cost: 6.50,
    expiry_date: '2026-04-18',
    description: 'Premium fresh chicken',
    dailySales: 6
  },
  {
    id: '6',
    name: 'Greek Yogurt 500g',
    category_id: 3,
    category_name: 'Dairy',
    supplier_id: 3,
    supplier_name: 'Dairy Farms Ltd',
    barcode: '5400123456789',
    stock_quantity: 0,
    min_stock_level: 15,
    price: 3.99,
    cost: 1.95,
    expiry_date: '2026-04-25',
    description: 'Creamy Greek yogurt',
    dailySales: 10
  },
  {
    id: '7',
    name: 'Olive Oil 1L',
    category_id: 6,
    category_name: 'Oils & Condiments',
    supplier_id: 2,
    supplier_name: 'Fresh Bakery Co',
    barcode: '5410876543210',
    stock_quantity: 34,
    min_stock_level: 10,
    price: 8.99,
    cost: 4.50,
    expiry_date: '2027-12-22',
    description: 'Premium extra virgin olive oil',
    dailySales: 4
  },
  {
    id: '8',
    name: 'Cheddar Cheese 200g',
    category_id: 3,
    category_name: 'Dairy',
    supplier_id: 3,
    supplier_name: 'Dairy Farms Ltd',
    barcode: '5412098765432',
    stock_quantity: 22,
    min_stock_level: 12,
    price: 4.49,
    cost: 2.10,
    expiry_date: '2026-05-11',
    description: 'Aged cheddar cheese',
    dailySales: 9
  },
  {
    id: '9',
    name: 'Tomato Sauce Can 400g',
    category_id: 4,
    category_name: 'Pantry',
    supplier_id: 4,
    supplier_name: 'Global Foods Inc',
    barcode: '8712341234567',
    stock_quantity: 156,
    min_stock_level: 30,
    price: 1.29,
    cost: 0.55,
    expiry_date: '2027-10-15',
    description: 'Authentic tomato sauce',
    dailySales: 18
  },
  {
    id: '10',
    name: 'Orange Juice 1L',
    category_id: 1,
    category_name: 'Beverages',
    supplier_id: 1,
    supplier_name: 'Coca Cola Distributor',
    barcode: '5449876543210',
    stock_quantity: 67,
    min_stock_level: 25,
    price: 3.79,
    cost: 1.85,
    expiry_date: '2026-05-13',
    description: 'Fresh orange juice',
    dailySales: 14
  }
]

const generateDummyCategories = (): Category[] => [
  { id: 1, name: 'Beverages', description: 'Soft drinks, juices, water' },
  { id: 2, name: 'Bakery', description: 'Bread, pastries, cakes' },
  { id: 3, name: 'Dairy', description: 'Milk, cheese, yogurt' },
  { id: 4, name: 'Pantry', description: 'Dry goods, pasta, rice' },
  { id: 5, name: 'Meat & Poultry', description: 'Fresh meat products' },
  { id: 6, name: 'Oils & Condiments', description: 'Cooking oils, sauces' }
]

const generateDummySuppliers = (): Supplier[] => [
  {
    id: 1,
    name: 'Coca Cola Distributor',
    contact: 'John Smith',
    email: 'john@cocacola-dist.com',
    address: '456 Market St, Downtown'
  },
  {
    id: 2,
    name: 'Fresh Bakery Co',
    contact: 'Maria Garcia',
    email: 'maria@freshbakery.com',
    address: '789 Bakery Lane, Industrial Zone'
  },
  {
    id: 3,
    name: 'Dairy Farms Ltd',
    contact: 'Robert Brown',
    email: 'robert@dairyfarms.com',
    address: '123 Farm Road, Rural Area'
  },
  {
    id: 4,
    name: 'Global Foods Inc',
    contact: 'Lisa Wong',
    email: 'lisa@globalfoods.com',
    address: '321 Commerce Ave, Port Area'
  },
  {
    id: 5,
    name: 'Premium Meat Suppliers',
    contact: 'Ahmed Hassan',
    email: 'ahmed@premiummeats.com',
    address: '567 Wholesale Blvd, District 5'
  }
]

export default {
  setup() {
    // State
    const products = ref<Product[]>(generateDummyProducts())
    const categories = ref<Category[]>(generateDummyCategories())
    const suppliers = ref<Supplier[]>(generateDummySuppliers())
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const successMessage = ref<string | null>(null)
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const selectedStatus = ref('active')

    // New Product Form
    const newProduct = ref<Partial<Product>>({
      name: '',
      category_id: undefined,
      supplier_id: undefined,
      barcode: '',
      stock_quantity: 0,
      min_stock_level: 10,
      max_stock_level: 100,
      price: 0,
      cost: 0,
      description: '',
      dailySales: 0,
      lowStockThreshold: 10
    })

    // Computed Properties
    const filteredProducts = computed(() => {
      return products.value.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            product.barcode?.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesCategory = !selectedCategory.value || product.category_id?.toString() === selectedCategory.value
        return matchesSearch && matchesCategory
      })
    })

    const lowStockItems = computed(() => {
      return products.value.filter(p => p.stock_quantity > 0 && p.stock_quantity <= (p.min_stock_level || 10))
    })

    const outOfStockItems = computed(() => {
      return products.value.filter(p => p.stock_quantity === 0)
    })

    const totalInventoryValue = computed(() => {
      return products.value.reduce((sum, p) => sum + (p.stock_quantity * p.price), 0)
    })

    const averageProductPrice = computed(() => {
      return products.value.length > 0 ? products.value.reduce((sum, p) => sum + p.price, 0) / products.value.length : 0
    })

    // Methods
    const addProduct = async () => {
      // Clear previous errors
      error.value = ''
      
      // Validation
      if (!newProduct.value.name || newProduct.value.name.trim() === '') {
        error.value = 'Product name is required'
        return
      }
      
      if (newProduct.value.category_id === null || newProduct.value.category_id === undefined) {
        error.value = 'Please select a category'
        return
      }
      
      if (newProduct.value.supplier_id === null || newProduct.value.supplier_id === undefined) {
        error.value = 'Please select a supplier'
        return
      }
      
      if (newProduct.value.price === undefined || newProduct.value.price === null || newProduct.value.price <= 0) {
        error.value = 'Selling price must be greater than 0'
        return
      }
      
      if (newProduct.value.cost === undefined || newProduct.value.cost === null || newProduct.value.cost < 0) {
        error.value = 'Cost price cannot be negative'
        return
      }

      isLoading.value = true
      try {
        const productToAdd: Product = {
          id: `prod_${Date.now()}`,
          name: newProduct.value.name.trim(),
          category_id: newProduct.value.category_id,
          category_name: categories.value.find(c => c.id === newProduct.value.category_id)?.name,
          supplier_id: newProduct.value.supplier_id,
          supplier_name: suppliers.value.find(s => s.id === newProduct.value.supplier_id)?.name,
          barcode: newProduct.value.barcode?.trim() || undefined,
          stock_quantity: newProduct.value.stock_quantity || 0,
          min_stock_level: newProduct.value.min_stock_level || 10,
          max_stock_level: newProduct.value.max_stock_level || 100,
          price: newProduct.value.price,
          cost: newProduct.value.cost,
          description: newProduct.value.description?.trim() || undefined,
          dailySales: newProduct.value.dailySales || 0,
          lowStockThreshold: newProduct.value.lowStockThreshold || 10
        }

        products.value.push(productToAdd)
        successMessage.value = `Product "${productToAdd.name}" added successfully!`
        newProduct.value = {
          name: '',
          category_id: undefined,
          supplier_id: undefined,
          barcode: '',
          stock_quantity: 0,
          min_stock_level: 10,
          max_stock_level: 100,
          price: 0,
          cost: 0,
          description: '',
          dailySales: 0,
          lowStockThreshold: 10
        }
        setTimeout(() => successMessage.value = null, 3000)
      } catch (err) {
        error.value = 'Failed to add product'
        console.error('Error adding product:', err)
      } finally {
        isLoading.value = false
      }
    }

    const updateProduct = async (id: string, updates: Partial<Product>) => {
      isLoading.value = true
      try {
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
          products.value[index] = { ...products.value[index], ...updates }
          successMessage.value = 'Product updated successfully!'
          setTimeout(() => successMessage.value = null, 3000)
        }
      } catch (err) {
        error.value = 'Failed to update product'
        console.error('Error updating product:', err)
      } finally {
        isLoading.value = false
      }
    }

    const deleteProduct = async (id: string) => {
      if (!confirm('Are you sure you want to delete this product?')) return

      isLoading.value = true
      try {
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
          const productName = products.value[index].name
          products.value.splice(index, 1)
          successMessage.value = `Product "${productName}" deleted successfully!`
          setTimeout(() => successMessage.value = null, 3000)
        }
      } catch (err) {
        error.value = 'Failed to delete product'
        console.error('Error deleting product:', err)
      } finally {
        isLoading.value = false
      }
    }

    const updateStock = async (id: string, newQuantity: number, reason: string) => {
      isLoading.value = true
      try {
        const product = products.value.find(p => p.id === id)
        if (product) {
          const oldQuantity = product.stock_quantity
          product.stock_quantity = newQuantity
          successMessage.value = `Stock updated: ${oldQuantity} → ${newQuantity} units (Reason: ${reason})`
          setTimeout(() => successMessage.value = null, 4000)
        }
      } catch (err) {
        error.value = 'Failed to update stock'
        console.error('Error updating stock:', err)
      } finally {
        isLoading.value = false
      }
    }

    const restockProduct = async (id: string, quantity: number) => {
      const product = products.value.find(p => p.id === id)
      if (product) {
        await updateStock(id, product.stock_quantity + quantity, 'Restock Order')
      }
    }

    const adjustPrice = async (id: string, newPrice: number) => {
      await updateProduct(id, { price: newPrice })
    }

    const exportProducts = () => {
      const csv = [
        ['ID', 'Name', 'Category', 'SKU', 'Quantity', 'Price', 'Cost'],
        ...products.value.map(p => [p.id, p.name, p.category_name, p.barcode, p.stock_quantity, p.price, p.cost])
      ]
      const csvContent = csv.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `products-${Date.now()}.csv`
      link.click()
      successMessage.value = 'Products exported successfully!'
      setTimeout(() => successMessage.value = null, 3000)
    }

    const clearError = () => error.value = null
    const clearSuccess = () => successMessage.value = null

    return {
      // State
      products,
      categories,
      suppliers,
      isLoading,
      error,
      successMessage,
      searchQuery,
      selectedCategory,
      selectedStatus,
      newProduct,
      
      // Computed
      filteredProducts,
      lowStockItems,
      outOfStockItems,
      totalInventoryValue,
      averageProductPrice,
      
      // Methods
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      restockProduct,
      adjustPrice,
      exportProducts,
      clearError,
      clearSuccess
    }
    }
}

