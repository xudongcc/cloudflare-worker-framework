import FindMyWay, { Instance, HTTPMethod } from "find-my-way";
import { Context } from "./Context";
import { Handler } from "./interfaces/Handler";

export class Application {
  private router: Instance<any>;

  constructor() {
    this.router = FindMyWay({
      ignoreTrailingSlash: true,
    });
  }

  get(path: string, handler: Handler) {
    this.router.on("GET", path, handler as any);
    return this;
  }

  post(path: string, handler: Handler) {
    this.router.on("POST", path, handler as any);
    return this;
  }

  put(path: string, handler: Handler) {
    this.router.on("PUT", path, handler as any);
    return this;
  }

  patch(path: string, handler: Handler) {
    this.router.on("PATCH", path, handler as any);
    return this;
  }

  delete(path: string, handler: Handler) {
    this.router.on("DELETE", path, handler as any);
    return this;
  }

  async respond(event: FetchEvent): Promise<Response> {
    const url = new URL(event.request.url);

    const { handler, params } =
      ((this.router.find(
        event.request.method as HTTPMethod,
        url.pathname
      ) as unknown) as {
        handler: Handler;
        params: Record<string, any>;
      }) || {};

    if (handler) {
      const ctx = new Context(event.request, params);

      const result = await handler(ctx);

      return typeof result === "string"
        ? new Response(result, { status: 200 })
        : result;
    }

    return new Response("404", { status: 404 });
  }

  listen() {
    addEventListener("fetch", (event) => {
      event.respondWith(this.respond(event));
    });
  }
}
