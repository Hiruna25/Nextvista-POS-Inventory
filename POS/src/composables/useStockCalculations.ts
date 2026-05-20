import type { Product } from '@/types'

export function useStockCalculations() {
  const getCurrentBranchStock = (product: Product, _selectedBranch: number): number => {
    // For now, return the main stock quantity since we don't have branch-specific stock
    return product.stock_quantity ?? (product as any).stockQuantity ?? 0
  }

  const getBranchStock = (product: Product, _branchId: number): number => {
    // For now, return the main stock quantity since we don't have branch-specific stock
    return product.stock_quantity ?? (product as any).stockQuantity ?? 0
  }

  const updateBranchStock = (product: Product, _branchId: number, newStock: number): void => {
    // For now, update the main stock quantity since we don't have branch-specific stock
    if ('stock_quantity' in product) {
      product.stock_quantity = newStock
    } else {
      ;(product as any).stockQuantity = newStock
    }
  }



  const isExpiringSoon = (expiryDate: string): boolean => {
    if (!expiryDate) return false
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffDays = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }

  const isExpired = (expiryDate: string): boolean => {
    if (!expiryDate) return false
    const today = new Date()
    const expiry = new Date(expiryDate)
    return expiry < today
  }

  const isExpiringThisMonth = (expiryDate: string): boolean => {
    if (!expiryDate) return false
    const today = new Date()
    const expiry = new Date(expiryDate)
    return (
      expiry.getMonth() === today.getMonth() && expiry.getFullYear() === today.getFullYear()
    )
  }

  const calculateStockDaysLeft = (product: Product, branchId: number): number => {
    const currentStock = getBranchStock(product, branchId)
    const dailySales = product.dailySales || 1 // Default to 1 if not set
    if (currentStock <= 0 || dailySales <= 0) return 0
    return Math.floor(currentStock / dailySales)
  }

  const calculateSuggestedOrder = (product: Product, branchId: number): number => {
    const currentStock = getBranchStock(product, branchId)
    const daysLeft = calculateStockDaysLeft(product, branchId)
    const lowStockThreshold = product.lowStockThreshold || 10 // Default threshold
    const safetyStock = lowStockThreshold * 2

    if (daysLeft <= 7) {
      return Math.max(safetyStock - currentStock, 0)
    } else if (daysLeft <= 14) {
      return Math.max(lowStockThreshold * 3 - currentStock, 0)
    }
    return 0
  }

  return {
    getCurrentBranchStock,
    getBranchStock,
    updateBranchStock,
    isExpiringSoon,
    isExpired,
    isExpiringThisMonth,
    calculateStockDaysLeft,
    calculateSuggestedOrder
  }
}
