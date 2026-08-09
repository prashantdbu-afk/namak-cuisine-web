import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const publicDir = join(root, "public");
const manifest = JSON.parse(
  await readFile(join(root, "src/media/manifest.json"), "utf8"),
);
const raster = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"]);
const video = new Set([".mp4", ".webm"]);
const supported = new Set([...raster, ...video, ".svg", ".ico"]);
const failures = [];

async function walk(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(path)));
    else found.push(path);
  }
  return found;
}

for (const path of await walk(publicDir)) {
  const extension = extname(path).toLowerCase();
  const size = (await stat(path)).size;
  const name = relative(root, path);
  if (!supported.has(extension))
    failures.push(`${name}: unsupported media type`);
  if (video.has(extension) && size > 5 * 1024 * 1024)
    failures.push(`${name}: committed video exceeds 5 MB`);
  if (raster.has(extension) && size > 1024 * 1024)
    failures.push(`${name}: committed raster image exceeds 1 MB`);
}

for (const record of manifest) {
  if (!(record.width > 0) || !(record.height > 0))
    failures.push(`${record.id}: dimensions are required`);
  if (record.kind === "image" && !record.decorative && !record.alt?.trim())
    failures.push(`${record.id}: meaningful image requires alt text`);
  if (record.productionReady && record.rightsStatus !== "approved")
    failures.push(`${record.id}: production-ready media must be approved`);
}

const priorityImages = manifest.filter(
  (record) => record.kind === "image" && record.priority,
);
if (priorityImages.length > 1)
  failures.push(
    "Only one priority/LCP image is allowed in the current route manifest.",
  );

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Asset policy passed for ${manifest.length} manifest entries.`);
