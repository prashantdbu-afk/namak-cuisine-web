import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  foodProcessingConfig,
  SAFE_FOOD_ADJUSTMENT_LIMITS,
} from "../src/media/food-processing-config.ts";

const root = process.cwd();
const incoming = path.join(root, "incoming-media");
const output = path.join(root, "public/media/menu");
const manifestPath = path.join(root, "src/media/manifest.json");
const reportPath = path.join(root, "docs/food-media-processing-report.json");

const assertRange = (label, value, limits) => {
  if (value < limits.min || value > limits.max)
    throw new Error(`${label} ${value} is outside safe limits.`);
};

await mkdir(output, { recursive: true });
const sourceFiles = (await readdir(incoming)).sort();
const configuredFiles = foodProcessingConfig
  .map((record) => record.sourceFilename)
  .sort();
if (JSON.stringify(sourceFiles) !== JSON.stringify(configuredFiles))
  throw new Error(
    "incoming-media and food processing config do not match exactly.",
  );

const prepared = [];
const foodManifest = [];
for (const record of foodProcessingConfig) {
  assertRange(
    "brightness",
    record.brightness,
    SAFE_FOOD_ADJUSTMENT_LIMITS.brightness,
  );
  assertRange(
    "saturation",
    record.saturation,
    SAFE_FOOD_ADJUSTMENT_LIMITS.saturation,
  );
  assertRange(
    "outputQuality",
    record.outputQuality,
    SAFE_FOOD_ADJUSTMENT_LIMITS.outputQuality,
  );

  const sourcePath = path.join(incoming, record.sourceFilename);
  const sourceMetadata = await sharp(sourcePath).metadata();
  const maxWidth = record.uses.includes("homepage-hero") ? 1600 : 1200;
  const outputPath = path.join(output, `${record.imageId}.webp`);
  await sharp(sourcePath)
    .rotate()
    .resize({
      width: Math.min(sourceMetadata.width ?? maxWidth, maxWidth),
      withoutEnlargement: true,
    })
    .modulate({ brightness: record.brightness, saturation: record.saturation })
    .webp({ quality: record.outputQuality, smartSubsample: true })
    .toFile(outputPath);

  const finalMetadata = await sharp(outputPath).metadata();
  const outputBytes = (await stat(outputPath)).size;
  const budget = record.uses.includes("homepage-hero") ? 450_000 : 300_000;
  if (outputBytes > budget)
    throw new Error(`${record.imageId} exceeds ${budget} bytes.`);
  const width = finalMetadata.width ?? 0;
  const height = finalMetadata.height ?? 0;
  const productionReady = record.status === "approved";
  prepared.push({
    imageId: record.imageId,
    sourceFilename: record.sourceFilename,
    sourceWidth: sourceMetadata.width,
    sourceHeight: sourceMetadata.height,
    outputFile: `/media/menu/${record.imageId}.webp`,
    width,
    height,
    outputBytes,
    status: record.status,
    styleFamily: record.styleFamily,
    generativeAlteration: false,
    metadataRetained: false,
  });
  foodManifest.push({
    id: record.imageId,
    kind: "image",
    provider: "local",
    source: `/media/menu/${record.imageId}.webp`,
    width,
    height,
    aspectRatio: width / height,
    alt: productionReady ? record.alt : "",
    decorative: !productionReady,
    focalPoint: record.focalPoint,
    sizes: record.uses.includes("homepage-hero")
      ? "(max-width: 760px) 100vw, 55vw"
      : "(max-width: 760px) 100vw, 600px",
    priority: record.uses.includes("homepage-hero") || undefined,
    rightsStatus: "approved",
    productionReady,
    foodStyleFamily: record.styleFamily,
    foodMediaStatus: record.status,
  });
}

const currentManifest = JSON.parse(await readFile(manifestPath, "utf8"));
const retained = currentManifest
  .filter(
    (record) =>
      !record.id.startsWith("food-") && record.id !== "venue-main-outdoor",
  )
  .map((record) =>
    record.id === "hero-poster" ? { ...record, priority: false } : record,
  );
await writeFile(
  manifestPath,
  `${JSON.stringify([...retained, ...foodManifest], null, 2)}\n`,
);
await writeFile(
  reportPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: "Owner-supplied files in ignored incoming-media directory",
      total: prepared.length,
      approved: prepared.filter((entry) => entry.status === "approved").length,
      review: prepared.filter((entry) => entry.status === "review").length,
      hold: prepared.filter((entry) => entry.status === "hold").length,
      totalOutputBytes: prepared.reduce(
        (sum, entry) => sum + entry.outputBytes,
        0,
      ),
      records: prepared,
    },
    null,
    2,
  )}\n`,
);
console.log(`Prepared ${prepared.length} owner-approved source files.`);
console.log(`Report: ${path.relative(root, reportPath)}`);
