// Unit tests for validation middleware
const { schemas, validate } = require('../middleware/validation');

describe('Validation Middleware', () => {
  describe('Product Schema', () => {
    test('should validate a correct product', () => {
      const product = {
        name: 'Laptop',
        price: 999.99,
        cost: 500,
        stockQuantity: 10,
      };
      const { error } = schemas.createProduct.validate(product);
      expect(error).toBeUndefined();
    });

    test('should fail if name is missing', () => {
      const product = {
        price: 999.99,
        cost: 500,
        stockQuantity: 10,
      };
      const { error } = schemas.createProduct.validate(product);
      expect(error).toBeDefined();
    });

    test('should fail if price is negative', () => {
      const product = {
        name: 'Laptop',
        price: -10,
        cost: 500,
        stockQuantity: 10,
      };
      const { error } = schemas.createProduct.validate(product);
      expect(error).toBeDefined();
    });
  });

  describe('Auth Schema', () => {
    test('should validate correct login credentials', () => {
      const login = {
        username: 'admin',
        password: 'password123',
      };
      const { error } = schemas.login.validate(login);
      expect(error).toBeUndefined();
    });

    test('should fail if password is missing', () => {
      const login = {
        username: 'admin',
      };
      const { error } = schemas.login.validate(login);
      expect(error).toBeDefined();
    });

    test('should validate correct registration', () => {
      const register = {
        username: 'newuser',
        email: 'user@example.com',
        password: 'Password123',
        roles: ['user'],
      };
      const { error } = schemas.register.validate(register);
      expect(error).toBeUndefined();
    });

    test('should fail if password is too weak', () => {
      const register = {
        username: 'newuser',
        email: 'user@example.com',
        password: 'weak',
        roles: ['user'],
      };
      const { error } = schemas.register.validate(register);
      expect(error).toBeDefined();
    });
  });

  describe('Pagination Schema', () => {
    test('should validate correct pagination', () => {
      const pagination = {
        page: 1,
        limit: 10,
      };
      const { error } = schemas.pagination.validate(pagination);
      expect(error).toBeUndefined();
    });

    test('should use defaults if not provided', () => {
      const { value } = schemas.pagination.validate({});
      expect(value.page).toBe(1);
      expect(value.limit).toBe(10);
    });

    test('should fail if page is 0', () => {
      const pagination = {
        page: 0,
        limit: 10,
      };
      const { error } = schemas.pagination.validate(pagination);
      expect(error).toBeDefined();
    });

    test('should fail if limit exceeds 100', () => {
      const pagination = {
        page: 1,
        limit: 200,
      };
      const { error } = schemas.pagination.validate(pagination);
      expect(error).toBeDefined();
    });
  });
});
