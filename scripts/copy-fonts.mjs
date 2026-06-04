/**
 * Копирует кириллические .woff-шрифты из @fontsource в public/fonts.
 *
 * Зачем: @react-pdf/renderer на клиенте грузит шрифты по URL.
 * Внешние Google Fonts URL ломаются от CORS/хешей версий, поэтому
 * шрифты обслуживаются с того же origin под /fonts/*.
 *
 * Вызывается автоматически перед `dev`/`build` через npm-скрипты.
 */
import { mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "fonts");

const sources = [
  // Inter — body PDF
  "@fontsource/inter/files/inter-cyrillic-400-normal.woff",
  "@fontsource/inter/files/inter-cyrillic-500-normal.woff",
  "@fontsource/inter/files/inter-cyrillic-600-normal.woff",
  // Cormorant Garamond — heading в PDF
  "@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-500-normal.woff",
  "@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-500-italic.woff",
];

await mkdir(outDir, { recursive: true });

let copied = 0;
for (const rel of sources) {
  const src = join(root, "node_modules", rel);
  const name = rel.split("/").pop();
  const dest = join(outDir, name);
  if (!existsSync(src)) {
    console.warn(`[copy-fonts] missing: ${rel}`);
    continue;
  }
  await copyFile(src, dest);
  copied++;
}

console.log(`[copy-fonts] copied ${copied}/${sources.length} fonts to /public/fonts/`);
