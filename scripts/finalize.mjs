import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "../dist");

async function ensureDist() {
  if (!existsSync(dist)) {
    await mkdir(dist, { recursive: true });
  }
}

async function patchRoutesJson() {
  const file = path.join(dist, "_routes.json");
  let routes = { version: 1, include: ["/*"], exclude: [] };
  if (existsSync(file)) {
    routes = JSON.parse(await readFile(file, "utf8"));
  }
  routes.exclude = Array.from(new Set([...(routes.exclude ?? []), "/admin/*", "/_headers", "/_redirects"]));
  await writeFile(file, JSON.stringify(routes, null, 2));
  console.log("✔ patched dist/_routes.json", JSON.stringify(routes.exclude));
}

async function writeRedirects() {
  const file = path.join(dist, "_redirects");
  const content = ["/admin /admin/ 302", ""].join("\n");
  await writeFile(file, content);
  console.log("✔ wrote dist/_redirects");
}

async function main() {
  await ensureDist();
  await patchRoutesJson();
  await writeRedirects();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
