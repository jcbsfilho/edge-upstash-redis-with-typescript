import { Request, Response } from "node-fetch";
import { MethodRouterRedis, redisGet } from "../lib/upstash-redis";

export interface Args {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

/**
 * https://www.azion.com/en/documentation/products/edge-application/rules-engine/#variables
 * ${geoip_country_code}
 * ${geoip_city}
 * ${geoip_region}
 * 
 */
interface CustomRequest extends Request {
  metadata: {
    [x:string]: string
  };
}

async function handleRequest(request: CustomRequest, args: Args) {
  const method = request.method;
  const country = request?.metadata["geoip_country_code"] || "US";

  if (!methodRouter[method]) {
    return new Response(
      JSON.stringify({
        message: "METHOD NOT ALLOWED",
      }),
      {
        status: 404,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  const { result: resultRedis, status } = await methodRouter[method](country, {
    url: args?.UPSTASH_REDIS_REST_URL || "",
    token: args?.UPSTASH_REDIS_REST_TOKEN || "",
  });

  const result = resultRedis || `Hello ${country}!`

  return new Response(result, {
    status: status || 500,
    headers: {
      "content-type": "application/json",
    },
  });
}

const methodRouter: MethodRouterRedis = {
  GET: redisGet,
};

export { handleRequest };
