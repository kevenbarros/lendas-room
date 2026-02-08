import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const baseUrl = (process.env.SITE_URL || "https://lendas-room.vercel.app").replace(/\/$/, "");

async function prerender() {
  const indexPath = path.resolve(root, "dist", "index.html");
  const serverEntryPath = path.resolve(root, "dist", "server", "entry-server.js");

  const template = await fs.readFile(indexPath, "utf-8");

  const serverModuleUrl = pathToFileURL(serverEntryPath).href;
  const { render } = await import(serverModuleUrl);
  const { html: appHtml, head } = await render();

  // Try to add preload for hero image (section-one.*) if present
  const assetsDir = path.resolve(root, "dist", "assets");
  let heroPreload = "";
  try {
    const files = await fs.readdir(assetsDir);
    const heroFile = files.find((f) => /section-one-.*\.(png|webp|avif)$/i.test(f));
    if (heroFile) {
      heroPreload = `<link rel="preload" as="image" href="/assets/${heroFile}" fetchpriority="high" />`;
    }
  } catch { }

  const withHead = template.replace(/<\/head>/i, `${head}${heroPreload}</head>`);
  const finalHtml = withHead.replace(
    "<div id=\"root\"></div>",
    `<div id="root">${appHtml}</div>`,
  );

  await fs.writeFile(indexPath, finalHtml, "utf-8");
  console.log("SSG: prerendered dist/index.html");


}

prerender().catch((err) => {
  console.error(err);
  process.exit(1);
});
