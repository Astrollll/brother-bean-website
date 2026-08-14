// Runs the admin Vite dev server / build from the admin/ directory so that
// PostCSS + Tailwind resolve admin/tailwind.config.js (the admin content globs).
// Usage: node scripts/admin.mjs [build] [vite flags...]

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const adminDir = path.join(root, "admin");
const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");

const args = process.argv.slice(2);
const child = spawn(process.execPath, [viteBin, ...args], {
  stdio: "inherit",
  cwd: adminDir,
});

child.on("error", (err) => {
  console.error("Failed to start admin vite:", err.message);
  process.exit(1);
});
child.on("exit", (code) => process.exit(code ?? 0));
