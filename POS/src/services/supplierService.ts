/**
 * Supplier Service
 * API service for supplier operations
 */

import { apiService } from '@/services/api'
import type { Supplier, CreateSupplierInput } from '@/schemas/validation'
import { validateSchema, CreateSupplierSchema } from '@/schemas/validation'
import { logger } from '@/utils/logger'

class SupplierService {
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await apiService.get<Supplier[]>('/suppliers')

      if (response.success && response.data) {
        logger.debug('Suppliers fetched', { count: response.data.length })
        return response.data
      }

      return []
    } catch (error) {
      logger.error('Get suppliers error', error)
      return []
    }
  }

  async getSupplier(id: string): Promise<Supplier | null> {
    try {
      const response = await apiService.get<Supplier>(`/suppliers/${id}`)

      if (response.success && response.data) {
        logger.debug('Supplier fetched', { id })
        return response.data
      }

      return null
    } catch (error) {
      logger.error('Get supplier error', error)
      return null
    }
  }

  async createSupplier(data: CreateSupplierInput): Promise<Supplier | null> {
    try {
      // Validate input
      const validation = await validateSchema(CreateSupplierSchema, data)
      if (!validation.success) {
        logger.warn('Supplier validation failed', validation.errors)
        throw new Error(Object.values(validation.errors || {}).join(', '))
      }

      const response = await apiService.post<Supplier>('/suppliers', data)

      if (response.success && response.data) {
        logger.success('Supplier created', { id: response.data.id, name: response.data.name })
        return response.data
      }

      return null
    } catch (error) {
      logger.error('Create supplier error', error)
      throw error
    }
  }

  async updateSupplier(id: string, data: Partial<CreateSupplierInput>): Promise<Supplier | null> {
    try {
      const response = await apiService.put<Supplier>(`/suppliers/${id}`, data)

      if (response.success && response.data) {
        logger.success('Supplier updated', { id })
        return response.data
      }

      return null
    } catch (error) {
      logger.error('Update supplier error', error)
      throw error
    }
  }

  async deleteSupplier(id: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/suppliers/${id}`)

      if (response.success) {
        logger.success('Supplier deleted', { id })
        return true
      }

      return false
    } catch (error) {
      logger.error('Delete supplier error', error)
      throw error
    }
  }

  async getSupplierProducts(supplierId: string) {
    try {
      const response = await apiService.get(`/suppliers/${supplierId}/products`)

      if (response.success) {
        logger.debug('Supplier products fetched', { supplierId })
        return response.data
      }

      return []
    } catch (error) {
      logger.error('Get supplier products error', error)
      return []
    }
  }
}

export const supplierService = new SupplierService()
export default supplierService
