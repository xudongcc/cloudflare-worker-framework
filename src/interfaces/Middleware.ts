import { Context } from "../Context";

export type Middleware = (ctx: Context, next: () => Promise<any>) => any;
