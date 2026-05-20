/**
 * Product Service
 * API service for product operations
 */

import { apiService } from '@/services/api'
import { ProductSchema, validateSchema } from '@/schemas/validation'
import type { Product, CreateProductInput, UpdateProductInput } from '@/schemas/validation'
import { logger } from '@/utils/logger'

class ProductService {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>('/products')

      if (response.success && response.data) {
        logger.debug('Products fetched', { count: response.data.length })
        return response.data
      }

      return []
    } catch (error) {
      logger.error('Get products error', error)
      return []
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const response = await apiService.get<Product>(`/products/${id}`)

      if (response.success && response.data) {
        logger.debug('Product fetched', { id })
        return response.data
      }

      return null
    } catch (error) {
      logger.error('Get product error', error)
      return null
    }
  }

  async createProduct(data: CreateProductInput): Promise<Product | null> {
    try {
      // Validate input
      const validation = await validateSchema(ProductSchema.omit({ id: true, createdAt: true, updatedAt: true }), data)
      if (!validation.success) {
        logger.warn('Product validation failed', validation.errors)
        throw new Error(Object.values(validation.errors || {}).join(', '))
      }

      const response = await apiService.post<Product>('/products', data)

      if (response.success && response.data) {
        logger.success('Product created', { id: response.data.id, name: response.data.name })
        return response.data
      }

      return null
    } catch (error) {
      logger.error('Create product error', error)
      throw error
    }
  }

  async updateProduct(id: string, data: UpdateProductInput): Promise<Product | null> {
    try {
      const response = await apiService.put<Product>(`/products/${id}`, data)

      if (response.success && response.data) {
        logger.success('Product updated', { id })
        return response.data
      }

      return null
    } catch (error) {
      logger.error('Update product error', error)
      throw error
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/products/${id}`)

      if (response.success) {
        logger.success('Product deleted', { id })
        return true
      }

      return false
    } catch (error) {
      logger.error('Delete product error', error)
      throw error
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>(`/products/search`, {
        params: { q: query },
      })

      if (response.success && response.data) {
        logger.debug('Products searched', { query, count: response.data.length })
        return response.data
      }

      return []
    } catch (error) {
      logger.error('Search products error', error)
      return []
    }
  }
}

export const productService = new ProductService()
export default productService
