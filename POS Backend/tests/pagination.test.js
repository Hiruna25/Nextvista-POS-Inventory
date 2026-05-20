// Unit tests for pagination middleware
const { paginate, paginationResponse } = require('../middleware/pagination');

describe('Pagination Middleware', () => {
  describe('paginate', () => {
    test('should set default pagination values', (done) => {
      const mockReq = { query: {} };
      const mockRes = {};
      const mockNext = jest.fn(() => {
        expect(mockReq.pagination.page).toBe(1);
        expect(mockReq.pagination.limit).toBe(10);
        expect(mockReq.pagination.skip).toBe(0);
        done();
      });

      paginate(mockReq, mockRes, mockNext);
    });

    test('should parse page and limit from query', (done) => {
      const mockReq = { query: { page: '2', limit: '20' } };
      const mockRes = {};
      const mockNext = jest.fn(() => {
        expect(mockReq.pagination.page).toBe(2);
        expect(mockReq.pagination.limit).toBe(20);
        expect(mockReq.pagination.skip).toBe(20);
        done();
      });

      paginate(mockReq, mockRes, mockNext);
    });

    test('should calculate skip correctly', (done) => {
      const mockReq = { query: { page: '3', limit: '10' } };
      const mockRes = {};
      const mockNext = jest.fn(() => {
        expect(mockReq.pagination.skip).toBe(20);
        done();
      });

      paginate(mockReq, mockRes, mockNext);
    });

    test('should reject invalid pagination values', (done) => {
      const mockReq = { query: { page: '0', limit: '10' } };
      const mockRes = {
        status: jest.fn(function() {
          return this;
        }),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      paginate(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      done();
    });

    test('should reject limit exceeding maximum', (done) => {
      const mockReq = { query: { page: '1', limit: '200' } };
      const mockRes = {
        status: jest.fn(function() {
          return this;
        }),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      paginate(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      done();
    });
  });

  describe('paginationResponse', () => {
    test('should format pagination response correctly', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const total = 100;
      const page = 1;
      const limit = 10;

      const response = paginationResponse(data, total, page, limit);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
      expect(response.pagination.page).toBe(1);
      expect(response.pagination.limit).toBe(10);
      expect(response.pagination.total).toBe(100);
      expect(response.pagination.totalPages).toBe(10);
    });

    test('should indicate next page availability', () => {
      const response = paginationResponse([], 100, 1, 10);
      expect(response.pagination.hasNextPage).toBe(true);
      expect(response.pagination.hasPrevPage).toBe(false);
    });

    test('should indicate previous page availability', () => {
      const response = paginationResponse([], 100, 5, 10);
      expect(response.pagination.hasNextPage).toBe(true);
      expect(response.pagination.hasPrevPage).toBe(true);
    });

    test('should indicate last page', () => {
      const response = paginationResponse([], 100, 10, 10);
      expect(response.pagination.hasNextPage).toBe(false);
      expect(response.pagination.hasPrevPage).toBe(true);
    });

    test('should calculate total pages correctly', () => {
      const response1 = paginationResponse([], 50, 1, 10);
      expect(response1.pagination.totalPages).toBe(5);

      const response2 = paginationResponse([], 51, 1, 10);
      expect(response2.pagination.totalPages).toBe(6);
    });
  });
});
