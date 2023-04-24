import { Redis } from "@upstash/redis";

export const getRedis = (region: string) => {
  if (region.toLowerCase() === "eu") {
    return !!process.env.UPSTASH_REDIS_REST_URL_EU &&
      !!process.env.UPSTASH_REDIS_REST_TOKEN_EU
      ? new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL_EU,
          token: process.env.UPSTASH_REDIS_REST_TOKEN_EU,
        })
      : undefined;
  }

  return !!process.env.UPSTASH_REDIS_REST_URL_US &&
    !!process.env.UPSTASH_REDIS_REST_TOKEN_US
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL_US,
        token: process.env.UPSTASH_REDIS_REST_TOKEN_US,
      })
    : undefined;
};
