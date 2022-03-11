import { Middleware } from "../interfaces/Middleware";

interface ProxyOptions {
  target: string;
}

export function proxy(options: ProxyOptions): Middleware {
  return async (ctx) => {
    const requestUrl = new URL(ctx.req.url);
    const targetUrl = new URL(options.target);

    targetUrl.pathname = requestUrl.pathname;
    targetUrl.search = requestUrl.search;

    const proxyRequestHeaders = new Headers(ctx.req.headers);

    proxyRequestHeaders.set(
      "x-forwarded-for",
      ctx.req.headers.get("cf-connecting-ip") as string
    );

    ctx.response.res = await fetch(targetUrl.toString(), {
      method: ctx.req.method,
      headers: proxyRequestHeaders,
      body: ctx.req.body,
    });
  };
}
