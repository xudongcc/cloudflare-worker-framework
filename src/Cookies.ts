export class Cookies {
  private _cookies: Record<string, string> = {};

  constructor(private readonly request: Request) {}

  get(key: string): string {
    if (!this._cookies) {
      this._cookies =
        this.request.headers
          .get("cookie")
          ?.split("; ")
          .reduce((previousValue, str) => {
            const [key, value] = str.split("=");

            return {
              ...previousValue,
              [decodeURIComponent(key)]: decodeURIComponent(value),
            };
          }, {} as Record<string, string>) || {};
    }

    return this._cookies[key];
  }
}
