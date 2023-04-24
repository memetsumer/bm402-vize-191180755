import { getRedis } from "@/utils/redis";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  if (!region) {
    return new Response("Missing region", { status: 400 });
  }

  const redis = getRedis(region);

  if (!redis) {
    return new Response("Missing redis", { status: 500 });
  }

  const key = "counter";
  const value = await redis.get(key);
  if (value) {
    await redis.incr(key);
    return new Response(JSON.stringify({ counter: value }));
  } else {
    await redis.incr(key);
  }

  return new Response(JSON.stringify({ hello: "world" }));
}
