import Redis from "ioredis";
import { getServerEnv } from "../lib/env";

const redis = new Redis(getServerEnv().REDIS_URL);
export default redis;
