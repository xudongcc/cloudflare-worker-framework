import { ContextRequest } from "./ContextRequest";
import { ContextResponse } from "./ContextResponse";

console;

export class Context {
  req: Request;

  request: ContextRequest;
  response: ContextResponse;

  params: Record<string, any> = {};

  constructor(readonly event: FetchEvent) {
    this.req = event.request;
    this.request = new ContextRequest(this);
    this.response = new ContextResponse(this);
  }

  logger(message: string, context?: Record<string, any>) {}
}
