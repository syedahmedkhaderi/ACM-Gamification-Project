const Redis = require('ioredis');
const { promisify } = require('util');

// Initialize Redis client
let redisClient;
let getAsync;
let setAsync;

const initializeCache = () => {
  try {
    // Check if Redis URI is provided in environment variables
    const redisUri = process.env.REDIS_URI;
    
    if (!redisUri) {
      console.log('⚠️ No REDIS_URI found, caching disabled');
      return false;
    }
    
    redisClient = new Redis(redisUri);
    
    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully - caching enabled');
    });
    
    redisClient.on('error', (err) => {
      console.error('❌ Redis connection error:', err.message);
      console.log('⚠️ Caching disabled due to Redis connection error');
    });
    
    // Promisify Redis methods
    getAsync = promisify(redisClient.get).bind(redisClient);
    setAsync = promisify(redisClient.set).bind(redisClient);
    
    return true;
  } catch (error) {
    console.error('❌ Redis initialization error:', error.message);
    console.log('⚠️ Caching disabled');
    return false;
  }
};

// Cache middleware
const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    if (!redisClient) {
      return next();
    }
    
    // Create a unique key based on the route and query parameters
    const key = `cache:${req.originalUrl || req.url}`;
    
    try {
      // Check if data exists in cache
      const cachedData = await getAsync(key);
      
      if (cachedData) {
        // Return cached data
        const data = JSON.parse(cachedData);
        return res.json(data);
      }
      
      // If not in cache, modify res.json to cache the response
      const originalJson = res.json;
      res.json = function(data) {
        // Cache the data
        setAsync(key, JSON.stringify(data), 'EX', duration);
        // Call the original json method
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Clear cache for specific routes
const clearCache = async (pattern) => {
  if (!redisClient) return false;
  
  try {
    const keys = await redisClient.keys(`cache:${pattern || '*'}`);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Cleared ${keys.length} cache entries`);
    }
    return true;
  } catch (error) {
    console.error('Clear cache error:', error);
    return false;
  }
};

module.exports = {
  initializeCache,
  cacheMiddleware,
  clearCache,
  getRedisClient: () => redisClient
};