import { Context } from "../Context";
import { Middleware } from "../interfaces";

export function compose(middlewares: Middleware[]): Middleware {
  if (!Array.isArray(middlewares)) {
    throw new TypeError("Middleware stack must be an array!");
  }

  for (const middleware of middlewares) {
    if (typeof middleware !== "function")
      throw new TypeError("Middleware must be composed of functions!");
  }

  return (context: Context, next) => {
    // last called middleware #
    let index = -1;

    async function dispatch(i: number): Promise<any> {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }

      index = i;
      let middleware = middlewares[i];

      if (i === middlewares.length) {
        middleware = next;
      }

      if (!middleware) {
        return;
      }

      return middleware(context, dispatch.bind(null, i + 1));
    }

    return dispatch(0);
  };
}
