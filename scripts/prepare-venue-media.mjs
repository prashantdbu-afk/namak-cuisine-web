import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  SAFE_VENUE_ADJUSTMENT_LIMITS,
  venueProcessingConfig,
} from "../src/media/venue-processing-config.ts";

const root = process.cwd();
const incoming = path.join(root, "incoming-media/venue");
const production = path.join(root, "public/media/venue");
const review = path.join(root, "public/media/review/venue");
const manifestPath = path.join(root, "src/media/manifest.json");
const reportPath = path.join(root, "docs/venue-media-processing-report.json");
const auditPath = path.join(root, "docs/venue-media-audit.md");
const augmentationPath = path.join(
  root,
  "docs/bar-shelf-augmentation-review.md",
);
const visualPath = path.join(root, "visual-review/venue");

const sha = (value) => createHash("sha256").update(value).digest("hex");
const escapeCell = (value) =>
  String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
const assertRange = (key, value) => {
  const range = SAFE_VENUE_ADJUSTMENT_LIMITS[key];
  if (value < range.min || value > range.max)
    throw new Error(`${key} ${value} is outside ${range.min}–${range.max}`);
};
const transform = (buffer, record, width, quality) => {
  let pipeline = sharp(buffer).rotate();
  pipeline = pipeline
    .resize({ width, withoutEnlargement: true })
    .linear(record.contrast, 128 * (1 - record.contrast))
    .modulate({ brightness: record.brightness, saturation: record.saturation });
  if (record.gamma !== 1) pipeline = pipeline.gamma(record.gamma);
  return pipeline
    .sharpen({ sigma: record.sharpenSigma })
    .webp({ quality, smartSubsample: true });
};

await Promise.all([
  mkdir(production, { recursive: true }),
  mkdir(review, { recursive: true }),
  mkdir(visualPath, { recursive: true }),
]);
const sources = (await readdir(incoming)).sort();
const configured = venueProcessingConfig
  .map((record) => record.sourceFilename)
  .sort();
if (JSON.stringify(sources) !== JSON.stringify(configured))
  throw new Error(
    "Venue source directory and explicit processing config do not match exactly.",
  );

const manifest = JSON.parse(await readFile(manifestPath, "utf8")).filter(
  (record) =>
    record.kind !== "image" ||
    (!record.source.startsWith("/media/venue/") &&
      !record.source.startsWith("/media/review/venue/")),
);
const report = [];
for (const record of venueProcessingConfig) {
  for (const key of [
    "brightness",
    "saturation",
    "contrast",
    "gamma",
    "sharpenSigma",
  ])
    assertRange(key, record[key]);
  const inputPath = path.join(incoming, record.sourceFilename);
  const input = await readFile(inputPath);
  const sourceMeta = await sharp(input).rotate().metadata();
  const maxWidth = record.uses.some((use) => use.startsWith("homepage"))
    ? 1800
    : 1600;
  let output = await transform(input, record, maxWidth, 80).toBuffer();
  const budget = record.uses.some((use) => use.startsWith("homepage"))
    ? 500_000
    : 450_000;
  for (const quality of [76, 72, 68]) {
    if (output.byteLength <= budget) break;
    output = await transform(input, record, maxWidth, quality).toBuffer();
  }
  if (output.byteLength > budget)
    throw new Error(`${record.imageId} exceeds its ${budget} byte budget.`);

  const natural = await transform(input, record, 900, 74).toBuffer();
  const reviewFile = `${record.imageId}-natural.webp`;
  await writeFile(path.join(review, reviewFile), natural);
  const publicSource = record.productionReady
    ? `/media/venue/${record.imageId}.webp`
    : `/media/review/venue/${reviewFile}`;
  if (record.productionReady)
    await writeFile(path.join(production, `${record.imageId}.webp`), output);
  const finalMeta = await sharp(
    record.productionReady ? output : natural,
  ).metadata();
  manifest.push({
    id: record.imageId,
    kind: "image",
    provider: "local",
    source: publicSource,
    width: finalMeta.width,
    height: finalMeta.height,
    aspectRatio: finalMeta.width / finalMeta.height,
    alt: record.alt,
    displayCaption: record.displayCaption,
    decorative: false,
    focalPoint: record.focalPoint,
    sizes: "(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 760px",
    rightsStatus: record.rightsStatus,
    productionReady: record.productionReady,
    venueCategory: record.category,
    venueUses: record.uses,
    venueMediaStatus: record.status,
    peopleApproval: record.peopleApproval,
    sensitiveInformationFound: record.sensitiveInformationFound,
    qualityScore: record.qualityScore,
    generativeEdit: record.generativeEdit,
    ownerApprovedEdit: record.ownerApprovedEdit,
  });
  report.push({
    imageId: record.imageId,
    sourceFilename: record.sourceFilename,
    sourceDimensions: [sourceMeta.width, sourceMeta.height],
    output: publicSource,
    outputDimensions: [finalMeta.width, finalMeta.height],
    outputBytes: record.productionReady
      ? output.byteLength
      : natural.byteLength,
    status: record.status,
    corrections: {
      brightness: record.brightness,
      saturation: record.saturation,
      contrast: record.contrast,
      gamma: record.gamma,
      sharpenSigma: record.sharpenSigma,
    },
    sourceSha256: sha(input),
    outputSha256: sha(record.productionReady ? output : natural),
    metadataRetained: false,
    generativeEdit: false,
  });
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(
  reportPath,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), count: report.length, report }, null, 2)}\n`,
);
const rows = venueProcessingConfig.map(
  (record) =>
    `| ${escapeCell(record.sourceFilename)} | ${record.imageId} | ${record.category} | ${record.status} | ${record.qualityScore}/5 | ${record.peopleApproval} | ${record.sensitiveInformationFound ? escapeCell(record.sensitiveInformationNotes) : "No"} | ${escapeCell(record.visualAudit.websiteSuitability)} | ${escapeCell(record.visualAudit.reshootRecommendation)} |`,
);
await writeFile(
  auditPath,
  `# Venue media audit\n\nEvery supplied image was reviewed individually. Production publication requires approved rights, approved/absent people, no sensitive operational information, and an approved status. Corrections are restrained and non-generative; exact values are recorded in \`venue-media-processing-report.json\`.\n\nNo genuine evening exterior, chef action, plating action, event setup, or private-dining photograph was supplied. Those needs are marked for reshoot rather than fabricated.\n\n| Source | ID | Category | Status | Quality | People | Sensitive info | Suitability | Reshoot |\n|---|---|---|---|---:|---|---|---|---|\n${rows.join("\n")}\n`,
);
const candidates = venueProcessingConfig.filter(
  (record) => record.augmentationCandidate,
);
await writeFile(
  augmentationPath,
  `# Bar-shelf augmentation review\n\nNo generative bar-shelf edit is approved or required for this delivery. Natural photography remains the source of truth. The optional edit script is disabled by default and cannot run without an explicit approved configuration.\n\n${candidates.map((record) => `## ${record.imageId}\n\n- Source: ${record.sourceFilename}\n- Recommendation: ${record.augmentationReason}\n- Owner-approved edit: ${record.ownerApprovedEdit ? "Yes" : "No"}\n- Generative production asset: No\n`).join("\n") || "No candidates."}\n`,
);

const selected = [
  "venue-dining-wide-03",
  "venue-bar-wide-01",
  "venue-exterior-day-03",
  "venue-kitchen-wide-01",
];
for (const id of selected) {
  const record = venueProcessingConfig.find((item) => item.imageId === id);
  const input = await readFile(path.join(incoming, record.sourceFilename));
  const after = await readFile(path.join(review, `${id}-natural.webp`));
  const panels = await Promise.all(
    [input, after].map((buffer) =>
      sharp(buffer)
        .rotate()
        .resize(720, 480, { fit: "cover" })
        .webp({ quality: 76 })
        .toBuffer(),
    ),
  );
  await sharp({
    create: { width: 1440, height: 480, channels: 3, background: "#f8f3e9" },
  })
    .composite([
      { input: panels[0], left: 0, top: 0 },
      { input: panels[1], left: 720, top: 0 },
    ])
    .webp({ quality: 78 })
    .toFile(path.join(visualPath, `${id}-before-after.webp`));
}

console.log(
  `Prepared ${report.length} venue records (${venueProcessingConfig.filter((record) => record.productionReady).length} approved).`,
);
