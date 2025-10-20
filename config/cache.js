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
    
    // Configure Redis client with retry strategy
    redisClient = new Redis(redisUri, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      connectTimeout: 10000
    });
    
    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully - caching enabled');
    });
    
    redisClient.on('error', (err) => {
      console.error('❌ Redis connection error:', err.message);
      console.log('⚠️ Application will continue without caching');
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
    if (!redisClient || !redisClient.status || redisClient.status !== 'ready') {
      return next();
    }
    
    // Create a unique key based on the route and query parameters
    const key = `cache:${req.originalUrl || req.url}`;
    
    try {
      // Check if data exists in cache
      const cachedData = await getAsync(key).catch(() => null);
      
      if (cachedData) {
        try {
          // Return cached data
          const data = JSON.parse(cachedData);
          return res.json(data);
        } catch (parseError) {
          console.error('Cache parse error:', parseError);
          // Continue with request if parsing fails
        }
      }
      
      // If not in cache, modify res.json to cache the response
      const originalJson = res.json;
      res.json = function(data) {
        // Cache the data, but don't wait for it
        setAsync(key, JSON.stringify(data), 'EX', duration).catch(err => {
          console.error('Cache set error:', err.message);
        });
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
  if (!redisClient || !redisClient.status || redisClient.status !== 'ready') return false;
  
  try {
    const keys = await redisClient.keys(`cache:${pattern || '*'}`).catch(() => []);
    if (keys.length > 0) {
      await redisClient.del(keys).catch(err => {
        console.error('Cache delete error:', err.message);
      });
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