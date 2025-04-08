// redis.config.js
import { createClient } from "redis";
import { authConfig } from "./auth.config.js";

const ConfigRedisClient = createClient({
  username: authConfig.REDIS_USERNAME,
  password: authConfig.REDIS_PASSWORD,
  socket: {
    host: authConfig.REDIS_HOST,
    port: authConfig.REDIS_PORT,
  },
});

ConfigRedisClient.on("error", (err) => console.log("Redis Client Error", err));

const connectRedis = async () => {
  try {
    await ConfigRedisClient.connect();
    console.log("Connected to Redis successfully.");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
};

connectRedis();

export default ConfigRedisClient;
