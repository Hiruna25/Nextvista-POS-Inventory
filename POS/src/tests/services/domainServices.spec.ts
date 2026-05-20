/**
 * Test: Domain Services (ProductService, UserService)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { productService } from '@/services/productService'
import { userService } from '@/services/userService'
import * as apiService from '@/services/api'

vi.mock('@/services/api', () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Product Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch products', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', sku: 'SKU1', price: 10, quantity: 5, category: 'Cat1', createdAt: '', updatedAt: '' },
    ]

    vi.spyOn(apiService.apiService, 'get').mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    })

    const result = await productService.getProducts()
    expect(result).toEqual(mockProducts)
  })

  it('should create product with validation', async () => {
    const newProduct = {
      name: 'New Product',
      sku: 'SKU123',
      price: 25,
      quantity: 10,
      category: 'Electronics',
    }

    vi.spyOn(apiService.apiService, 'post').mockResolvedValueOnce({
      success: true,
      data: { id: '1', ...newProduct, createdAt: '', updatedAt: '' },
    })

    const result = await productService.createProduct(newProduct)
    expect(result?.name).toBe('New Product')
  })

  it('should handle invalid product data', async () => {
    const invalidProduct = {
      name: '',
      sku: '',
      price: -5,
      quantity: -1,
      category: '',
    }

    await expect(productService.createProduct(invalidProduct as any)).rejects.toThrow()
  })
})

describe('User Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should validate login credentials', async () => {
    const invalidCredentials = {
      username: 'ab',
      password: '123',
    }

    await expect(userService.login(invalidCredentials as any)).rejects.toThrow()
  })

  it('should handle successful login', async () => {
    const credentials = {
      username: 'testuser',
      password: 'password123',
    }

    const mockResponse = {
      token: 'test-token',
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        roles: ['user'],
        permissions: ['read'],
      },
    }

    vi.spyOn(apiService.apiService, 'post').mockResolvedValueOnce({
      success: true,
      data: mockResponse,
    })

    const result = await userService.login(credentials)
    expect(result?.token).toBe('test-token')
  })
})
