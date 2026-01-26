import { createServer as createHttpServer } from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, p);
const isProd =
  process.env.NODE_ENV === "production" || process.argv.includes("--prod");
const PORT = Number(process.env.PORT) || 4173;

async function createServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    const requestHandler = async (req, res) => {
      try {
        const url = req.originalUrl || req.url || "/";
        const template = await fs.readFile(resolve("index.html"), "utf-8");
        const transformedTemplate = await vite.transformIndexHtml(url, template);
        const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
        const { html: appHtml, head } = await render();
        const withHead = transformedTemplate.replace(
          /<\/head>/i,
          `${head}</head>`,
        );
        const html = withHead.replace(
          "<div id=\"root\"></div>",
          `<div id="root">${appHtml}</div>`,
        );
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error);
        console.error(error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    };

    const server = createHttpServer((req, res) => {
      vite.middlewares(req, res, () => requestHandler(req, res));
    });

    server.listen(PORT, () => {
      console.log(`Dev SSR server running at http://localhost:${PORT}`);
    });
    return;
  }

  const template = await fs.readFile(resolve("dist/index.html"), "utf-8");
  const { render } = await import("./dist/entry-server.js");
  const serveClient = sirv(resolve("dist"), {
    gzip: true,
    brotli: true,
  });

  const server = createHttpServer(async (req, res) => {
    if (!req || !res || !req.url) {
      res.statusCode = 400;
      res.end("Bad Request");
      return;
    }

    if (req.method !== "GET") {
      res.statusCode = 405;
      res.end("Method Not Allowed");
      return;
    }

    serveClient(req, res, async () => {
      try {
        const { html: appHtml, head } = await render();
        const withHead = template.replace(/<\/head>/i, `${head}</head>`);
        const html = withHead.replace(
          "<div id=\"root\"></div>",
          `<div id="root">${appHtml}</div>`,
        );
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(html);
      } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    });
  });

  server.listen(PORT, () => {
    console.log(`SSR server running at http://localhost:${PORT}`);
  });
}

createServer();
