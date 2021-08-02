import qs, { ParsedQs } from "qs";
import { Cookies } from "./Cookies";

export class Context {
  private _url?: URL;
  private _query?: ParsedQs;
  private _cookies?: Cookies;

  constructor(
    readonly request: Request,
    readonly params: Record<string, any>
  ) {}

  private get url() {
    if (!this._url) {
      this._url = new URL(this.request.url);
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
    return this.request.method;
  }

  get headers() {
    return this.request.headers;
  }

  get query() {
    if (!this._query) {
      this._query = qs.parse(this.url.search, { ignoreQueryPrefix: true });
    }

    return this._query;
  }

  get cookies() {
    if (!this._cookies) {
      this._cookies = new Cookies(this.request);
    }

    return this._cookies;
  }
}
