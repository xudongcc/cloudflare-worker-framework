import Router from "trek-router";
import { Context } from "./Context";
import { Middleware } from "./interfaces/Middleware";
import { compose } from "./utils/compose";

export class Application {
  private middlewares: Middleware[] = [];
  private router = new Router();

  constructor() {}

  use(middleware: Middleware) {
    if (typeof middleware !== "function") {
      throw new TypeError("middleware must be a function!");
    }

    this.middlewares.push(middleware);
    return this;
  }

  get(path: string, ...middlewares: Middleware[]) {
    this.router.add("GET", path, compose(middlewares));
  }

  post(path: string, ...middlewares: Middleware[]) {
    this.router.add("POST", path, compose(middlewares));
  }

  put(path: string, ...middlewares: Middleware[]) {
    this.router.add("PUT", path, compose(middlewares));
  }

  patch(path: string, ...middlewares: Middleware[]) {
    this.router.add("PATCH", path, compose(middlewares));
  }

  delete(path: string, ...middlewares: Middleware[]) {
    this.router.add("DELETE", path, compose(middlewares));
  }

  listen() {
    const middleware = compose([
      ...this.middlewares,
      async (ctx, next) => {
        const [handler, params] = this.router.find(
          ctx.request.method,
          ctx.request.path
        );

        if (handler) {
          ctx.params = params;
          await handler(ctx, next);
        } else {
          await next();
        }
      },
    ]);

    const next = async () => {};

    addEventListener("fetch", (event: FetchEvent) => {
      const ctx = new Context(event);

      event.respondWith(
        middleware(ctx, next).then(() => {
          if (ctx.response.res) {
            return ctx.response.res;
          }

          if (ctx.response.body === null) {
            return new Response("", {
              status: ctx.response.status,
              headers: ctx.response.headers,
            });
          }

          if (typeof ctx.response.body === "string") {
            return new Response(ctx.response.body, {
              status: ctx.response.status,
              headers: ctx.response.headers,
            });
          }

          return new Response(JSON.stringify(ctx.response.body), {
            status: ctx.response.status,
            headers: ctx.response.headers,
          });
        })
      );
    });
  }
}
