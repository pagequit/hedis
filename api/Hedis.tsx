import { Application } from "oak";
import { render } from "preact-render-to-string";
import { JSX } from "preact";
import { Signal, useSignal } from "@preact/signals";
import { inline, install } from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetTailwind from "@twind/preset-tailwind";

install({
  presets: [presetTailwind(), presetAutoprefix()],
});

interface CounterProps {
  count: Signal<number>;
}

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      class="px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors"
    />
  );
}

export function Counter(props: CounterProps) {
  return (
    <div class="flex gap-8 py-6">
      <Button onClick={() => props.count.value -= 1}>-1</Button>
      <p class="text-3xl">{props.count}</p>
      <Button onClick={() => props.count.value += 1}>+1</Button>
    </div>
  );
}

export function Hedis() {
  const count = useSignal(3);
  return (
    <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
      <h1 class="text-4xl font-bold">Welcome to Fresh</h1>
      <p class="my-4">
        Try updating this message in the
        <code class="mx-2">./routes/index.tsx</code> file, and refresh.
      </p>
      <Counter count={count} />
    </div>
  );
}

const app = new Application();

app.use((ctx) => {
  const body = `<!DOCTYPE html>
<html>
  <head><title>Hedis</title></head>
  <body>${render(<Hedis />)}</body>
</html>`;

  ctx.response.type = "text/html";
  ctx.response.body = inline(body);
});

await app.listen({ port: 8080 });
