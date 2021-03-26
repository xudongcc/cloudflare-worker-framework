import { Context } from "../Context";

export type Handler = (ctx: Context) => Promise<any>;
