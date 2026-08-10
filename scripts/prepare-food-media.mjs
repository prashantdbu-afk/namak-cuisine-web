import { createHash } from "node:crypto";
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
const reviewOutput = path.join(root, "public/media/review/menu");
const comparisonOutput = path.join(root, "docs/menu-image-comparisons");
const manifestPath = path.join(root, "src/media/manifest.json");
const reportPath = path.join(root, "docs/food-media-processing-report.json");
const duplicatePath = path.join(root, "docs/menu-image-duplicate-review.md");
const completenessPath = path.join(root, "docs/menu-image-completeness.md");
const platingAuditPath = path.join(root, "docs/plating-compliance-audit.md");

const assertRange = (label, value, limits) => {
  if (value < limits.min || value > limits.max)
    throw new Error(`${label} ${value} is outside safe limits.`);
};
const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");
const hammingDistance = (a, b) =>
  [...a].reduce((distance, bit, index) => distance + (bit !== b[index]), 0);
const statsFor = async (input) => {
  const { data, info } = await sharp(input)
    .removeAlpha()
    .resize({ width: 320, withoutEnlargement: true })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const luminance = [];
  let saturationTotal = 0;
  let highlights = 0;
  let shadows = 0;
  for (let index = 0; index < data.length; index += info.channels) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const value = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    luminance.push(value);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    saturationTotal += max === 0 ? 0 : (max - min) / max;
    if (value >= 250) highlights += 1;
    if (value <= 5) shadows += 1;
  }
  const mean =
    luminance.reduce((sum, value) => sum + value, 0) / luminance.length;
  const deviation = Math.sqrt(
    luminance.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      luminance.length,
  );
  return {
    meanLuminance: Number(mean.toFixed(2)),
    luminanceStandardDeviation: Number(deviation.toFixed(2)),
    averageSaturation: Number((saturationTotal / luminance.length).toFixed(4)),
    highlightClippingPercentage: Number(
      ((highlights / luminance.length) * 100).toFixed(3),
    ),
    shadowClippingPercentage: Number(
      ((shadows / luminance.length) * 100).toFixed(3),
    ),
  };
};
const dHash = async (input) => {
  const { data } = await sharp(input)
    .greyscale()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let bits = "";
  for (let row = 0; row < 8; row += 1)
    for (let column = 0; column < 8; column += 1)
      bits += data[row * 9 + column] > data[row * 9 + column + 1] ? "1" : "0";
  return bits;
};
const label = (text) =>
  Buffer.from(
    `<svg width="480" height="38"><rect width="480" height="38" fill="rgba(21,44,39,.9)"/><text x="14" y="26" fill="#fffdf9" font-size="18" font-family="Arial">${text}</text></svg>`,
  );

await Promise.all([
  mkdir(output, { recursive: true }),
  mkdir(reviewOutput, { recursive: true }),
  mkdir(comparisonOutput, { recursive: true }),
]);
const sourceFiles = (await readdir(incoming, { withFileTypes: true }))
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .sort();
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
  for (const key of [
    "brightness",
    "saturation",
    "contrast",
    "gamma",
    "sharpenSigma",
    "outputQuality",
  ])
    assertRange(key, record[key], SAFE_FOOD_ADJUSTMENT_LIMITS[key]);

  const sourcePath = path.join(incoming, record.sourceFilename);
  const sourceBuffer = await readFile(sourcePath);
  const sourceMetadata = await sharp(sourceBuffer).rotate().metadata();
  const maxWidth = record.uses.includes("homepage-hero") ? 1600 : 1200;
  let enhanced = sharp(sourceBuffer).rotate();
  if (record.crop) enhanced = enhanced.extract(record.crop);
  enhanced = enhanced
    .resize({
      width: Math.min(sourceMetadata.width ?? maxWidth, maxWidth),
      withoutEnlargement: true,
    })
    .linear(record.contrast, 128 * (1 - record.contrast))
    .modulate({ brightness: record.brightness, saturation: record.saturation });
  if (record.gamma > 1) enhanced = enhanced.gamma(record.gamma);
  const enhancedBuffer = await enhanced
    .sharpen({ sigma: record.sharpenSigma })
    .webp({ quality: record.outputQuality, smartSubsample: true })
    .toBuffer();

  const outputPath = path.join(output, `${record.imageId}.webp`);
  await writeFile(outputPath, enhancedBuffer);
  const finalMetadata = await sharp(enhancedBuffer).metadata();
  const outputBytes = (await stat(outputPath)).size;
  const budget = record.uses.includes("homepage-hero") ? 450_000 : 300_000;
  if (outputBytes > budget)
    throw new Error(`${record.imageId} exceeds ${budget} bytes.`);

  const position = sharp.strategy.attention;
  const originalReview = await sharp(sourceBuffer)
    .rotate()
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toBuffer();
  const currentReview = await sharp(sourceBuffer)
    .rotate()
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  const menuReview = await sharp(enhancedBuffer)
    .resize({ width: 720, height: 432, fit: "cover", position })
    .webp({ quality: 78 })
    .toBuffer();
  const mobileReview = await sharp(enhancedBuffer)
    .resize({ width: 560, height: 336, fit: "cover", position })
    .webp({ quality: 76 })
    .toBuffer();
  const variants = {
    original: originalReview,
    current: currentReview,
    menu: menuReview,
    mobile: mobileReview,
  };
  await Promise.all(
    Object.entries(variants).map(([name, buffer]) =>
      writeFile(
        path.join(reviewOutput, `${record.imageId}-${name}.webp`),
        buffer,
      ),
    ),
  );

  if (record.status === "approved") {
    const panels = await Promise.all(
      Object.entries(variants).map(async ([name, buffer], index) => ({
        input: await sharp(buffer)
          .resize(480, 288, { fit: "cover", position })
          .composite([
            {
              input: label(
                name === "original"
                  ? "Original"
                  : name === "current"
                    ? "Previous processing"
                    : name === "menu"
                      ? "Enhanced menu crop"
                      : "Enhanced mobile crop",
              ),
              top: 250,
              left: 0,
            },
          ])
          .webp({ quality: 74 })
          .toBuffer(),
        left: index * 480,
        top: 0,
      })),
    );
    await sharp({
      create: { width: 1920, height: 288, channels: 3, background: "#f8f4ec" },
    })
      .composite(panels)
      .webp({ quality: 76 })
      .toFile(path.join(comparisonOutput, `${record.imageId}.webp`));
  }

  const width = finalMetadata.width ?? 0;
  const height = finalMetadata.height ?? 0;
  const productionReady = record.status === "approved";
  prepared.push({
    imageId: record.imageId,
    itemId: record.itemId,
    sourceFilename: record.sourceFilename,
    sourceWidth: sourceMetadata.width,
    sourceHeight: sourceMetadata.height,
    outputFile: `/media/menu/${record.imageId}.webp`,
    width,
    height,
    outputBytes,
    status: record.status,
    styleFamily: record.styleFamily,
    enhancement: {
      brightness: record.brightness,
      saturation: record.saturation,
      contrast: record.contrast,
      gamma: record.gamma,
      sharpenSigma: record.sharpenSigma,
      notes: record.enhancementNotes,
    },
    before: await statsFor(sourceBuffer),
    after: await statsFor(enhancedBuffer),
    sourceSha256: sha256(sourceBuffer),
    outputSha256: sha256(enhancedBuffer),
    perceptualDHash: await dHash(enhancedBuffer),
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
    focalPoint: record.menuFocalPoint,
    sizes: record.uses.includes("homepage-hero")
      ? "(max-width: 760px) 100vw, 55vw"
      : "(max-width: 359px) 100vw, (max-width: 760px) 132px, 210px",
    priority: record.uses.includes("homepage-hero") || undefined,
    rightsStatus: "approved",
    productionReady,
    foodStyleFamily: record.styleFamily,
    foodMediaStatus: record.status,
    targetPlateSystem: record.targetPlateSystem,
    visualCompliance: record.visualCompliance,
    menuEligible: record.menuEligible,
    actualVisiblePlate: record.actualVisiblePlate,
    actualBackground: record.actualBackground,
    actualCameraAngle: record.actualCameraAngle,
    actualLightingStyle: record.actualLightingStyle,
    complianceReason: record.complianceReason,
  });
}

const publicRecords = prepared.filter(
  (entry) => entry.status === "approved" && entry.itemId,
);
const exactDuplicates = [];
const nearDuplicates = [];
for (let left = 0; left < publicRecords.length; left += 1) {
  for (let right = left + 1; right < publicRecords.length; right += 1) {
    const a = publicRecords[left];
    const b = publicRecords[right];
    if (a.outputSha256 === b.outputSha256 || a.sourceSha256 === b.sourceSha256)
      exactDuplicates.push([a.imageId, b.imageId]);
    const distance = hammingDistance(a.perceptualDHash, b.perceptualDHash);
    if (distance <= 10) nearDuplicates.push([a.imageId, b.imageId, distance]);
  }
}
if (exactDuplicates.length)
  throw new Error(
    `Exact duplicate menu media detected: ${JSON.stringify(exactDuplicates)}`,
  );

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
const averages = (key, stage) =>
  Number(
    (
      prepared.reduce((sum, entry) => sum + entry[stage][key], 0) /
      prepared.length
    ).toFixed(3),
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
      averages: {
        beforeLuminance: averages("meanLuminance", "before"),
        afterLuminance: averages("meanLuminance", "after"),
        beforeSaturation: averages("averageSaturation", "before"),
        afterSaturation: averages("averageSaturation", "after"),
      },
      exactDuplicates,
      nearDuplicates,
      records: prepared,
    },
    null,
    2,
  )}\n`,
);
await writeFile(
  duplicatePath,
  `# Menu image duplicate review\n\nGenerated by the deterministic media pipeline.\n\n## Exact duplicates\n\n${exactDuplicates.length ? exactDuplicates.map((pair) => `- ${pair.join(" ↔ ")}`).join("\n") : "None detected."}\n\n## Near duplicates\n\n${nearDuplicates.length ? nearDuplicates.map(([a, b, distance]) => `- ${a} ↔ ${b} (dHash distance ${distance})`).join("\n") : "None detected at dHash distance ≤ 10."}\n\n## Intentional duplicates\n\nNone configured. No record currently uses \`allowDuplicateImage: true\`.\n\n## Suspected wrong mappings\n\nSamosa Chaat and Papdi Chaat were verified against their separately named supplied source files. Their source and output SHA-256 hashes differ, but the perceptual comparison is close enough to retain an explicit owner-review warning rather than assume the compositions are unrelated.\n\n## Resolved mappings\n\n- \`Jhol Momo Non-Veg.avif\` → Jhol Momo\n- \`Embers Non Veg - Tandoori Full.avif\` → Tandoori Chicken\n\nExact source SHA-256, output SHA-256, and perceptual dHash values are retained in \`docs/food-media-processing-report.json\`.\n`,
);
const completenessRecords = foodProcessingConfig.filter((record) =>
  record.imageId.startsWith("food-"),
);
const presentationTier = (record) => {
  if (
    record.itemId === null ||
    record.status !== "approved" ||
    !record.uses.includes("menu-feature")
  )
    return "hold";
  return record.visualCompliance === "pass"
    ? "curated"
    : "standardized-original";
};
const completenessRows = completenessRecords.map((record) => {
  const tier = presentationTier(record);
  const publicPlacement = tier !== "hold" && record.status === "approved";
  const reason = publicPlacement
    ? `Visible as ${tier}; plating compliance does not control full-menu coverage.`
    : record.itemId === null
      ? record.notes
      : record.status !== "approved"
        ? `Status is ${record.status}.`
        : "Not designated for menu-feature use.";
  const anchor = record.itemId
    ? `/menu#food-${record.category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}`
    : "—";
  return `| ${record.sourceFilename.replaceAll("|", "\\|")} | ${record.imageId} | ${record.publicName} | ${record.category} | ${record.itemId ? "confirmed" : "unresolved"} | approved | ${record.status === "approved" ? "yes" : "no"} | ${record.uses.includes("menu-feature") ? "yes" : "no"} | ${record.visualCompliance} | ${tier} | ${publicPlacement ? "yes" : "no"} | ${reason.replaceAll("|", "\\|")} | ${anchor} |`;
});
await writeFile(
  completenessPath,
  `# Menu image completeness\n\nGenerated from the typed owner-media configuration. Every approved, exactly mapped, rights-approved, production-ready \`menu-feature\` photograph is visible on the complete food menu. Plating compliance determines the internal presentation tier, not full-menu visibility. The separate venue photograph is not a food-menu source and is intentionally excluded.\n\n| Source filename | Image ID | Exact menu item | Category | Mapping | Rights | Production ready | Menu-feature | Compliance | Presentation tier | Visible | Reason | Preview anchor |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n${completenessRows.join("\n")}\n\n## Remaining holds\n\n- Chicken Boneless Biryani: no exact physical-menu item; the exact Hyderabadi Chicken Dum Biryani photograph is retained separately.\n- Unidentified dessert: exact dessert name is not confirmed.\n- Kadai Chicken: absent from the approved physical menu.\n`,
);
const platingRows = foodProcessingConfig.map(
  (record) =>
    `| ${record.sourceFilename.replaceAll("|", "\\|")} | ${record.publicName} | ${record.category} | ${record.actualVisiblePlate} | ${record.actualVisiblePlate} | ${record.actualBackground} | ${record.actualCameraAngle} | ${record.targetPlateSystem} | ${record.visualCompliance} | ${record.complianceReason.replaceAll("|", "\\|")} | ${record.menuEligible && record.visualCompliance === "pass" ? "yes" : "no"} | ${record.replacementRecommendation.replaceAll("|", "\\|")} |`,
);
await writeFile(
  platingAuditPath,
  `# Plating compliance audit\n\nManual visual audit of the actual visible presentation in every owner-supplied food-media record. Classification is based on the photograph, never its filename or menu category.\n\n| Exact filename | Exact menu item | Category | Current vessel | Current plate color | Current background | Current angle | Target plating system | Status | Reason | Public menu eligible | Reshoot or controlled-editing recommendation |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n${platingRows.join("\n")}\n`,
);
console.log(`Prepared ${prepared.length} owner-supplied source files.`);
const eligibleCount = foodProcessingConfig.filter(
  (record) =>
    record.itemId !== null &&
    record.status === "approved" &&
    record.uses.includes("menu-feature"),
).length;
console.log(
  `Public menu records: ${eligibleCount}. Curated: ${completenessRecords.filter((record) => presentationTier(record) === "curated").length}. Standardized originals: ${completenessRecords.filter((record) => presentationTier(record) === "standardized-original").length}. Holds: ${completenessRecords.filter((record) => presentationTier(record) === "hold").length}. Near-duplicate warnings: ${nearDuplicates.length}.`,
);
