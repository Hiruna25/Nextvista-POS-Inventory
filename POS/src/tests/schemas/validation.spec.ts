/**
 * Test: Validation Schemas
 */

import { describe, it, expect } from 'vitest'
import {
  LoginSchema,
  ProductSchema,
  validateSchema,
} from '@/schemas/validation'

describe('Validation Schemas', () => {
  describe('LoginSchema', () => {
    it('should validate correct login credentials', async () => {
      const valid = {
        username: 'testuser',
        password: 'password123',
      }

      const result = await validateSchema(LoginSchema, valid)
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should reject short username', async () => {
      const invalid = {
        username: 'ab',
        password: 'password123',
      }

      const result = await validateSchema(LoginSchema, invalid)
      expect(result.success).toBe(false)
      expect(result.errors?.username).toBeDefined()
    })

    it('should reject short password', async () => {
      const invalid = {
        username: 'testuser',
        password: '123',
      }

      const result = await validateSchema(LoginSchema, invalid)
      expect(result.success).toBe(false)
      expect(result.errors?.password).toBeDefined()
    })

    it('should reject missing fields', async () => {
      const invalid = {
        username: '',
        password: '',
      }

      const result = await validateSchema(LoginSchema, invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('ProductSchema', () => {
    it('should validate correct product data', async () => {
      const valid = {
        id: '1',
        name: 'Test Product',
        sku: 'SKU123',
        price: 29.99,
        quantity: 10,
        category: 'Electronics',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await validateSchema(ProductSchema, valid)
      expect(result.success).toBe(true)
    })

    it('should reject negative price', async () => {
      const invalid = {
        id: '1',
        name: 'Test Product',
        sku: 'SKU123',
        price: -10,
        quantity: 10,
        category: 'Electronics',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await validateSchema(ProductSchema, invalid)
      expect(result.success).toBe(false)
      expect(result.errors?.price).toBeDefined()
    })

    it('should reject negative quantity', async () => {
      const invalid = {
        id: '1',
        name: 'Test Product',
        sku: 'SKU123',
        price: 10,
        quantity: -5,
        category: 'Electronics',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await validateSchema(ProductSchema, invalid)
      expect(result.success).toBe(false)
    })

    it('should reject missing required fields', async () => {
      const invalid = {
        id: '1',
        name: '',
        sku: '',
        price: 10,
        quantity: 10,
        category: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await validateSchema(ProductSchema, invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('validateSchema function', () => {
    it('should handle validation errors gracefully', async () => {
      const invalid = {
        username: '',
        password: '',
      }

      const result = await validateSchema(LoginSchema, invalid)
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(typeof result.errors).toBe('object')
    })

    it('should return validated data on success', async () => {
      const valid = {
        username: 'testuser',
        password: 'password123',
      }

      const result = await validateSchema(LoginSchema, valid)
      expect(result.success).toBe(true)
      expect((result.data as any)?.username).toBe('testuser')
    })
  })
})
