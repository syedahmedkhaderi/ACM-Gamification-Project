const { cacheMiddleware, clearCache } = require('../config/cache');

// Apply cache to routes with specified duration in seconds
const applyCache = (duration = 300) => cacheMiddleware(duration);

// Clear cache when data is modified
const clearCacheMiddleware = (pattern) => {
  return async (req, res, next) => {
    // Save the original end function
    const originalEnd = res.end;
    
    // Override the end function
    res.end = async function(chunk, encoding) {
      // If the response is successful (2xx status code)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Clear the cache for the specified pattern
        await clearCache(pattern);
      }
      
      // Call the original end function
      originalEnd.call(this, chunk, encoding);
    };
    
    next();
  };
};

module.exports = {
  applyCache,
  clearCacheMiddleware
};