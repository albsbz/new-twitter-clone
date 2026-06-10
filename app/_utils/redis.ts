import Redis from "ioredis";
import { getServerEnv } from "../lib/env";

const redis = new Redis(getServerEnv().REDIS_URL, {
  lazyConnect: true,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 0,
});

redis.on("error", (error) => {
  console.error("Redis error:", error.message);
});

export default redis;
