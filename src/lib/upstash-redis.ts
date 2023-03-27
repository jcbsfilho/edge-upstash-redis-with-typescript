import { Redis, RedisConfigNodejs } from "@upstash/redis/nodejs";
import type { Request } from "node-fetch";

export interface MethodRouterRedis {
  [x:string]: (search: string, config: RedisConfigNodejs) => Promise<ResultProps>;
}

export interface RedisConfig extends RedisConfigNodejs {}

export interface ResultProps {
  result?: string;
  status?: number;
}

export async function redisGet(search: string, config: RedisConfigNodejs): Promise<ResultProps> {
  try {
    const redis = new Redis(config);
    const result = await redis.get<string>(search);
    if (!result) {
      return { status: 404 };
    }
    return { result, status: 200 };
  } catch (error:any) {
    return { result: error?.message || 'fail get item', status: 500 };
  }
}
