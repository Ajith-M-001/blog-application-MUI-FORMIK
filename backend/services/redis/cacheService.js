import ConfigRedisClient from "../../config/redis.config.js";

export const redisService = {
  // Set a key with optional expiry time (in seconds)
  async set(key, value, expiry = null) {
    try {
      if (expiry) {
        await ConfigRedisClient.set(key, JSON.stringify(value), { EX: expiry });
      } else {
        await ConfigRedisClient.set(key, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      console.error("Redis SET Error:", error);
      return false;
    }
  },

  // Get a value by key
  async get(key) {
    try {
      const value = await ConfigRedisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Redis GET Error:", error);
      return null;
    }
  },

  // Delete a key
  async del(key) {
    try {
      await ConfigRedisClient.del(key);
      return true;
    } catch (error) {
      console.error("Redis DEL Error:", error);
      return false;
    }
  },

  // Check if a key exists
  async exists(key) {
    try {
      return await ConfigRedisClient.exists(key);
    } catch (error) {
      console.error("Redis EXISTS Error:", error);
      return false;
    }
  },

  // Set expiry time on a key (in seconds)
  async expire(key, seconds) {
    try {
      await ConfigRedisClient.expire(key, seconds);
      return true;
    } catch (error) {
      console.error("Redis EXPIRE Error:", error);
      return false;
    }
  },

  // Increment a counter
  async incr(key) {
    try {
      return await ConfigRedisClient.incr(key);
    } catch (error) {
      console.error("Redis INCR Error:", error);
      return null;
    }
  },
};
