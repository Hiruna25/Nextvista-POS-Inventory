// Unit tests for error handling middleware
const { AppError, catchAsyncErrors } = require('../middleware/errorHandler');

describe('Error Handling', () => {
  describe('AppError', () => {
    test('should create error with message and status code', () => {
      const error = new AppError('Not found', 404);
      expect(error.message).toBe('Not found');
      expect(error.statusCode).toBe(404);
    });

    test('should extend Error class', () => {
      const error = new AppError('Test error', 400);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('catchAsyncErrors', () => {
    test('should catch promise rejections', async () => {
      const mockReq = {};
      const mockRes = {};
      const mockNext = jest.fn();

      const asyncFn = catchAsyncErrors(async (req, res, next) => {
        throw new Error('Async error');
      });

      await asyncFn(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test('should pass errors to next middleware', async () => {
      const mockReq = {};
      const mockRes = {};
      const mockNext = jest.fn();
      const testError = new Error('Test error');

      const asyncFn = catchAsyncErrors(async (req, res, next) => {
        throw testError;
      });

      await asyncFn(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(testError);
    });

    test('should work with successful async operations', async () => {
      const mockReq = {};
      const mockRes = { json: jest.fn() };
      const mockNext = jest.fn();

      const asyncFn = catchAsyncErrors(async (req, res, next) => {
        res.json({ success: true });
      });

      await asyncFn(mockReq, mockRes, mockNext);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('Error Types', () => {
    test('should handle validation errors', () => {
      const error = new AppError('Validation failed', 400);
      error.name = 'ValidationError';
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('ValidationError');
    });

    test('should handle authorization errors', () => {
      const error = new AppError('Unauthorized', 401);
      expect(error.statusCode).toBe(401);
    });

    test('should handle forbidden errors', () => {
      const error = new AppError('Forbidden', 403);
      expect(error.statusCode).toBe(403);
    });

    test('should handle server errors', () => {
      const error = new AppError('Internal Server Error', 500);
      expect(error.statusCode).toBe(500);
    });
  });
});
