import mime from "mime";
import { Context } from "./Context";

export class ContextResponse {
  res?: Response;

  status?: number;

  private _headers: Headers = new Headers();
  private _body: any;

  constructor(private readonly ctx: Context) {}

  get headers() {
    return this._headers;
  }

  get type() {
    const type = this._headers.get("Content-Type");
    if (!type) return "";
    return type.split(";", 1)[0];
  }

  set type(type: string) {
    const contentType = mime.getType(type);

    if (contentType) {
      this._headers.set("Content-Type", contentType);
    } else {
      this._headers.delete("Content-Type");
    }
  }

  get body() {
    return this._body;
  }

  set body(newBody: any) {
    const oldBody = this._body;
    this._body = newBody;

    // no content
    if (newBody == null) {
      this.status = 204;
      this._headers.delete("Content-Type");
      this._headers.delete("Content-Length");
      this._headers.delete("Transfer-Encoding");
      return;
    }

    // set the status
    if (typeof this.status === "undefined") {
      this.status = 200;
    }

    // set the content-type only if not yet set
    const hasContentType = !this._headers.has("Content-Type");

    // string
    if (typeof newBody === "string") {
      if (hasContentType) {
        this.type = /^\s*</.test(newBody) ? "html" : "text";
      }
      return;
    }

    // json
    this._headers.delete("Content-Length");
    this.type = "json";
  }
}
