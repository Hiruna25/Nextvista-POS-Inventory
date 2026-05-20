import type { Category, Supplier, Branch, Product } from '@/types'

export function getCategoryName(categoryId: number | string | undefined, categories: Category[]): string {
  const category = categories.find((c) => c.id == categoryId)
  return category ? category.name : 'Unknown'
}

export function getSupplierName(supplierId: number | string | undefined, suppliers: Supplier[]): string {
  const supplier = suppliers.find((s) => s.id == supplierId)
  return supplier ? supplier.name : 'Unknown'
}

export function getProductName(productId: number | string, inventory: Product[]): string {
  const product = inventory.find((p) => p.id == productId)
  return product ? product.name : 'Unknown'
}

export function getProductCost(productId: number | string, inventory: Product[]): number {
  const product = inventory.find((p) => p.id == productId)
  return product ? product.cost : 0
}

export function getBranchName(branchId: number | string, branches: Branch[]): string {
  const branch = branches.find((b) => b.id == branchId)
  return branch ? branch.name : 'Unknown'
}

export function getBranchInitial(branchId: number | string, branches: Branch[]): string {
  const branch = branches.find((b) => b.id == branchId)
  return branch ? branch.name.charAt(0) : '?'
}

export function getRandomColor(): string {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)
  return `rgba(${r}, ${g}, ${b}, 0.2)`
}

export function getSortIcon(field: string, sortField: string, sortDirection: string): string {
  return sortField === field
    ? sortDirection === 'asc'
      ? 'fas fa-sort-up'
      : 'fas fa-sort-down'
    : 'fas fa-sort'
}
