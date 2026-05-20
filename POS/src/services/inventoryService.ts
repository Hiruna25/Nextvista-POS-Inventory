/**
 * Inventory Service
 * API service for inventory operations
 */

import { apiService } from '@/services/api'
import type { Inventory, CreateInventoryInput } from '@/schemas/validation'
import { logger } from '@/utils/logger'

export interface StockAdjustmentRequest {
  productId: string
  quantity: number
  reason: string
}

class InventoryService {
  async getInventory(productId: string): Promise<Inventory | null> {
    try {
      const response = await apiService.get<Inventory>(`/products/${productId}`)

      if (response.success && response.data) {
        logger.debug('Inventory fetched', { productId })
        return response.data
      }

      return null
    } catch (error) {
      logger.error('Get inventory error', error)
      return null
    }
  }

  async getAllInventory(): Promise<Inventory[]> {
    try {
      const response = await apiService.get<Inventory[]>('/products')

      if (response.success && response.data) {
        logger.debug('All inventory fetched', { count: response.data.length })
        return response.data
      }

      return []
    } catch (error) {
      logger.error('Get all inventory error', error)
      return []
    }
  }

  async createInventory(data: CreateInventoryInput): Promise<Inventory | null> {
    try {
      const response = await apiService.post<Inventory>('/products', data)

      if (response.success && response.data) {
        logger.success('Inventory created', { productId: data.productId })
        return response.data
      }

      return null
    } catch (error) {
      logger.error('Create inventory error', error)
      throw error
    }
  }

  async adjustStock(adjustment: StockAdjustmentRequest): Promise<Inventory | null> {
    try {
      // Map frontend request format to backend endpoint format
      const response = await apiService.post<Inventory>(
        `/products/${adjustment.productId}/adjust-stock`,
        {
          quantity: adjustment.quantity,
          action: 'add', // or 'remove', 'set' based on adjustment type
          notes: adjustment.reason
        }
      )

      if (response.success && response.data) {
        logger.success('Stock adjusted', {
          productId: adjustment.productId,
          quantity: adjustment.quantity,
        })
        return response.data
      }

      return null
    } catch (error) {
      logger.error('Adjust stock error', error)
      throw error
    }
  }

  async getLowStockItems(): Promise<Inventory[]> {
    try {
      // TODO: Implement low-stock endpoint in backend
      // For now, return empty array. Backend should provide /products/low-stock or similar
      const allInventory = await this.getAllInventory()
      return allInventory.filter(item => item.quantity < (item.reorderLevel || 10))
    } catch (error) {
      logger.error('Get low stock items error', error)
      return []
    }
  }

  async getReplenishmentSuggestions(): Promise<Inventory[]> {
    try {
      // TODO: Implement replenishment suggestions endpoint in backend
      // For now, return items below min stock level
      const allInventory = await this.getAllInventory()
      return allInventory.filter(item => item.quantity < (item.reorderLevel || 10))
    } catch (error) {
      logger.error('Get replenishment suggestions error', error)
      return []
    }
  }
}

export const inventoryService = new InventoryService()
export default inventoryService
