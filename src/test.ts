import { Application } from "./";

const app = new Application();

app.get("/", (ctx) => {
  ctx.response.body = ctx.request.cookies;
});

app.listen();
