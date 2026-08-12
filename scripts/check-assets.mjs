import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const publicDir = join(root, "public");
const manifest = JSON.parse(
  await readFile(join(root, "src/media/manifest.json"), "utf8"),
);
const homepageHeroMedia = JSON.parse(
  await readFile(join(root, "src/media/homepage-hero-media.json"), "utf8"),
);
const raster = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"]);
const video = new Set([".mp4", ".webm"]);
const supported = new Set([...raster, ...video, ".svg", ".ico"]);
const failures = [];

try {
  await stat(join(publicDir, "media/review"));
  failures.push("public/media/review must not exist in a production bundle");
} catch {}

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
  if (name.startsWith("public/media/menu/") && size > 300_000)
    failures.push(`${name}: prepared menu image exceeds 300 KB`);
  if (name.startsWith("public/media/menu/") && extension !== ".webp")
    failures.push(`${name}: menu output must be a prepared WebP source`);
  if (name.startsWith("public/media/bar/") && size > 450_000)
    failures.push(`${name}: prepared bar image exceeds 450 KB`);
  if (name.startsWith("public/media/bar/") && extension !== ".webp")
    failures.push(`${name}: bar output must be a prepared WebP source`);
}

for (const record of manifest) {
  if (!(record.width > 0) || !(record.height > 0))
    failures.push(`${record.id}: dimensions are required`);
  if (record.kind === "image" && !record.decorative && !record.alt?.trim())
    failures.push(`${record.id}: meaningful image requires alt text`);
  if (record.productionReady && record.rightsStatus !== "approved")
    failures.push(`${record.id}: production-ready media must be approved`);
}

const foodRecords = manifest.filter(
  (record) =>
    record.kind === "image" && record.source?.startsWith("/media/menu/"),
);
const barRecords = manifest.filter(
  (record) =>
    record.kind === "image" && record.source?.startsWith("/media/bar/"),
);
if (
  foodRecords.some((record) =>
    /doordash|grubhub|toast|ubereats|cdn/i.test(record.source),
  )
)
  failures.push(
    "Prepared food media must not use third-party URLs or CDN paths.",
  );

if (barRecords.length > 0)
  failures.push(
    "Review-only bar category assets must not ship in public/media.",
  );

for (const record of manifest) {
  if (
    record.kind === "image" &&
    record.provider === "local" &&
    record.source?.startsWith("/media/") &&
    !record.productionReady
  )
    failures.push(`${record.id}: non-production media must not ship publicly`);
}

const priorityImages = manifest.filter(
  (record) => record.kind === "image" && record.priority,
);
if (priorityImages.length > 2)
  failures.push(
    "Only the route-specific homepage and bar LCP images may be prioritized.",
  );

const heroPlacements = [
  homepageHeroMedia.primary,
  ...homepageHeroMedia.supporting,
];
const primaryPlacements = heroPlacements.filter(
  (placement) => placement.role === "heroPrimary",
);
if (primaryPlacements.length !== 1)
  failures.push("Homepage hero must have exactly one primary LCP image.");

for (const placement of heroPlacements) {
  const record = manifest.find((item) => item.id === placement.imageId);
  if (!record) {
    failures.push(`${placement.imageId}: homepage hero media is missing`);
    continue;
  }
  if (record.rightsStatus !== "approved" || !record.productionReady)
    failures.push(
      `${record.id}: homepage hero media must be approved and ready`,
    );
  if (!record.focalPoint)
    failures.push(`${record.id}: homepage hero media requires a focal point`);
  if (/210px/.test(placement.sizes) || placement.sizes === record.sizes)
    failures.push(
      `${record.id}: homepage hero must not reuse menu-thumbnail sizes`,
    );
  if (placement.maxRenderedWidth > record.width)
    failures.push(`${record.id}: homepage hero source would be enlarged`);

  if (placement.role === "heroPrimary") {
    if (record.width < 1600 || record.height < 1000)
      failures.push(`${record.id}: hero primary must be at least 1600x1000`);
    if (
      record.venueMediaStatus !== "approved" ||
      record.sensitiveInformationFound !== false ||
      !["approved", "not-applicable"].includes(record.peopleApproval)
    )
      failures.push(`${record.id}: hero primary venue safety is not approved`);
    if (placement.quality !== 90 || placement.fetchPriority !== "high")
      failures.push(`${record.id}: hero primary quality/priority is incorrect`);
  } else {
    if (record.width < 900 || record.height < 540)
      failures.push(`${record.id}: hero support must be at least 900x540`);
    if (placement.quality !== 85 || placement.fetchPriority === "high")
      failures.push(`${record.id}: hero support quality/priority is incorrect`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Asset policy passed for ${manifest.length} manifest entries.`);
