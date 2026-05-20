// Pagination middleware
const paginate = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Validate pagination params
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Invalid pagination parameters',
    });
  }

  req.pagination = {
    page,
    limit,
    skip: (page - 1) * limit,
  };

  next();
};

// Helper function to attach pagination metadata to response
const paginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = { paginate, paginationResponse };
