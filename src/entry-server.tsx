import { renderToString } from "react-dom/server";
import { HelmetProvider } from "./lib/helmet";
import App from "./App";
import "./index.css";

export async function render() {
  const helmetContext: Record<string, unknown> = {};
  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <App />
    </HelmetProvider>,
  );
  const { helmet } = helmetContext as unknown as {
    helmet: {
      title: { toString: () => string };
      meta: { toString: () => string };
      link: { toString: () => string };
      script: { toString: () => string };
    };
  };
  const head = [
    helmet?.title?.toString?.() ?? "",
    helmet?.meta?.toString?.() ?? "",
    helmet?.link?.toString?.() ?? "",
    helmet?.script?.toString?.() ?? "",
  ].join("");
  return { html: appHtml, head };
}
