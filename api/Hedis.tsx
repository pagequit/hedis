import { Application } from "oak";
import { render } from "preact-render-to-string";

export function Hedis({ foo }: { foo: string }) {
  return <div>{foo}</div>;
}

const app = new Application();

app.use((ctx) => {
  ctx.response.type = "text/html";
  ctx.response.body = `<!DOCTYPE html>
<html>
  <head><title>Hedis</title></head>
  <body>${render(<Hedis foo="bar" />)}</body>
</html>`;
});

await app.listen({ port: 8080 });
