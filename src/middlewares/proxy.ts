import { Handler } from "../interfaces/Handler";

interface ProxyOptions {
  target: string;
}

export function proxy(options: ProxyOptions): Handler {
  return async (ctx) => {
    const requestUrl = new URL(ctx.request.url);
    const targetUrl = new URL(options.target);

    targetUrl.pathname = requestUrl.pathname;
    targetUrl.search = requestUrl.search;

    const proxyRequestHeaders = new Headers(ctx.request.headers);

    proxyRequestHeaders.set(
      "x-forwarded-for",
      ctx.request.headers.get("cf-connecting-ip") as string
    );

    return fetch(targetUrl.toString(), {
      method: ctx.request.method,
      headers: proxyRequestHeaders,
      body: ctx.request.body,
    });
  };
}
