/**
 * Validation Schemas
 * Type-safe validation using Zod
 */

import { z } from 'zod'

// Auth Schemas
export const LoginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
})

export type LoginInput = z.infer<typeof LoginSchema>

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
})

export type User = z.infer<typeof UserSchema>

// Product Schemas
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  supplierId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Product = z.infer<typeof ProductSchema>

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateProductInput = z.infer<typeof CreateProductSchema>

export const UpdateProductSchema = CreateProductSchema.partial()

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>

// Inventory Schemas
export const InventorySchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number().int().min(0),
  reorderLevel: z.number().int().min(0),
  reorderQuantity: z.number().int().positive(),
  lastRestockedAt: z.string(),
})

export type Inventory = z.infer<typeof InventorySchema>

export const CreateInventorySchema = InventorySchema.omit({
  id: true,
  lastRestockedAt: true,
})

export type CreateInventoryInput = z.infer<typeof CreateInventorySchema>

// Supplier Schemas
export const SupplierSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Supplier name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  paymentTerms: z.string().optional(),
  createdAt: z.string(),
})

export type Supplier = z.infer<typeof SupplierSchema>

export const CreateSupplierSchema = SupplierSchema.omit({
  id: true,
  createdAt: true,
})

export type CreateSupplierInput = z.infer<typeof CreateSupplierSchema>

// Validation helper
export const validateSchema = async <T>(schema: z.ZodSchema<T>, data: unknown): Promise<{ success: boolean; data?: T; errors?: Record<string, string> }> => {
  try {
    const validatedData = await schema.parseAsync(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return { success: false, errors }
    }
    return { success: false, errors: { _general: 'Validation failed' } }
  }
}
