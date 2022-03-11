import qs, { ParsedQs } from "qs";
import { Context } from "./Context";
import { Cookies } from "./Cookies";

export class ContextRequest {
  private _url?: URL;
  private _query?: ParsedQs;
  private _cookies?: Cookies;

  params: Record<string, any> = {};

  constructor(private readonly ctx: Context) {}

  get url() {
    if (!this._url) {
      this._url = new URL(this.ctx.req.url);
    }

    return this._url;
  }

  get host() {
    return this.url.host;
  }

  get port() {
    return this.url.port;
  }

  get hostname() {
    return this.url.hostname;
  }

  get path() {
    return this.url.pathname;
  }

  get method() {
    return this.ctx.req.method;
  }

  get headers() {
    return this.ctx.req.headers;
  }

  get query() {
    if (!this._query) {
      this._query = qs.parse(this.url.search, { ignoreQueryPrefix: true });
    }

    return this._query;
  }

  get cookies() {
    if (!this._cookies) {
      this._cookies = new Cookies(this.ctx.req);
    }

    return this._cookies;
  }
}
