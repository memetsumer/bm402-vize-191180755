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

  const key = "region";
  const value = await redis.get(key);
  if (value) {
    return new Response(JSON.stringify({ region: value }));
  } else {
    await redis.set(key, region);
  }

  return new Response(JSON.stringify({ hello: "world" }));
}
