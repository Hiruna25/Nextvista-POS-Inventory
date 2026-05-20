import type { Product } from '@/types'

export function useFilters() {
  const applyFilters = (
    inventory: Product[],
    searchQuery: string,
    categoryId?: string | number,
    supplierId?: string | number,
    stockStatus?: string,
    priceRange?: { min: number; max: number },
    getCurrentBranchStock?: Function,
    selectedBranch?: number
  ) => {
    return inventory.filter((item) => {
      const itemCategoryId = (item as any).category_id ?? (item as any).categoryId
      const itemSupplierId = (item as any).supplier_id ?? (item as any).supplierId
      const lowStockThreshold = (item as any).lowStockThreshold ?? (item as any).min_stock_level ?? 0

      // Search filter
      const normalizedSearch = searchQuery?.toString().toLowerCase() || ''
      const matchesSearch =
        item.name.toLowerCase().includes(normalizedSearch) ||
        (item.barcode && item.barcode.toLowerCase().includes(normalizedSearch))

      // Category filter
      const matchesCategory = !categoryId || itemCategoryId == categoryId

      // Supplier filter
      const matchesSupplier = !supplierId || itemSupplierId == supplierId

      // Stock status filter
      let matchesStockStatus = true
      if (stockStatus && getCurrentBranchStock && selectedBranch !== undefined && selectedBranch !== null) {
        const stock = getCurrentBranchStock(item, selectedBranch)
        switch (stockStatus) {
          case 'in-stock':
            matchesStockStatus = stock > lowStockThreshold
            break
          case 'low-stock':
            matchesStockStatus = stock > 0 && stock <= lowStockThreshold
            break
          case 'out-of-stock':
            matchesStockStatus = stock === 0
            break
        }
      }

      // Price range filter
      let matchesPriceRange = true
      if (priceRange) {
        matchesPriceRange = item.price >= priceRange.min && item.price <= priceRange.max
      }

      return matchesSearch && matchesCategory && matchesSupplier && matchesStockStatus && matchesPriceRange
    })
  }

  const sortBy = (items: Product[], sortField: string, sortDirection: 'asc' | 'desc' = 'asc') => {
    const sorted = [...items]
    sorted.sort((a, b) => {
      let aValue = (a as any)[sortField]
      let bValue = (b as any)[sortField]

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }

  const paginate = (items: Product[], page: number, pageSize: number) => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return {
      items: items.slice(start, end),
      totalPages: Math.ceil(items.length / pageSize),
      totalItems: items.length,
      currentPage: page
    }
  }

  return {
    applyFilters,
    sortBy,
    paginate
  }
}
