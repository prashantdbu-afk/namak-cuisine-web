import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  barStockCandidates,
  barStockPresentation,
  selectedBarStock,
} from "../src/media/bar-stock.ts";

const root = process.cwd();
const incoming = path.join(root, "incoming-media/stock-bar");
const output = path.join(root, "public/media/bar");
const manifestPath = path.join(root, "src/media/manifest.json");
const sourceNames = {
  "bar-stock-hero": "bar-hero-source.jpeg",
  "bar-stock-beer": "bar-beer-source.jpeg",
  "bar-stock-whiskey": "bar-whiskey-source.jpeg",
  "bar-stock-clear-spirits": "bar-clear-spirits-source.jpeg",
  "bar-stock-agave-rum": "bar-agave-rum-source.jpeg",
  "bar-stock-aperitivo": "bar-aperitivo-source.jpeg",
  "bar-stock-wine-glass": "bar-wine-glass-source.jpeg",
  "bar-stock-wine-list": "bar-wine-list-source.jpeg",
};

await mkdir(output, { recursive: true });
const records = [];
for (const candidate of selectedBarStock) {
  const presentation = barStockPresentation[candidate.slotId];
  const source = path.join(incoming, sourceNames[candidate.slotId]);
  const metadata = await sharp(source).metadata();
  const hero = candidate.slotId === "bar-stock-hero";
  const width = Math.min(
    metadata.width ?? (hero ? 1800 : 1400),
    hero ? 1800 : 1400,
  );
  const target = path.join(output, presentation.output);
  await sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .modulate({ brightness: 1.015, saturation: 0.99 })
    .linear(1.025, -3.2)
    .sharpen({ sigma: 0.5 })
    .webp({ quality: hero ? 78 : 72, smartSubsample: true })
    .toFile(target);
  const prepared = await sharp(target).metadata();
  const bytes = (await stat(target)).size;
  const maximum = hero ? 450_000 : 300_000;
  if (bytes > maximum)
    throw new Error(`${presentation.output} exceeds ${maximum} bytes.`);
  records.push({
    id: presentation.mediaId,
    kind: "image",
    provider: "local",
    source: `/media/bar/${presentation.output}`,
    width: prepared.width,
    height: prepared.height,
    aspectRatio: prepared.width / prepared.height,
    alt: presentation.alt,
    decorative: false,
    focalPoint: presentation.focalPoint,
    sizes: hero
      ? "(max-width: 760px) 100vw, 52vw"
      : "(max-width: 760px) 100vw, 420px",
    priority: hero || undefined,
    rightsStatus: "approved",
    productionReady: false,
  });
}
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const retained = manifest.filter(
  (record) => !record.id.startsWith("bar-stock-"),
);
await writeFile(
  manifestPath,
  `${JSON.stringify([...retained, ...records], null, 2)}\n`,
);
await writeFile(
  path.join(root, "docs/bar-stock-processing-report.json"),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      records: await Promise.all(
        records.map(async (record) => ({
          ...record,
          bytes: (await stat(path.join(root, "public", record.source))).size,
        })),
      ),
    },
    null,
    2,
  )}\n`,
);
const registerRows = barStockCandidates.map(
  (candidate) =>
    `| ${candidate.candidateId} | ${candidate.slotId} | Pexels | ${candidate.assetId} | [asset page](${candidate.sourcePageUrl}) | ${candidate.role === "recommended" ? candidate.directDownloadUrl : "Not downloaded"} | ${candidate.photographer} | ${candidate.photographerProfileUrl ?? "Not exposed by accessible page data"} | ${candidate.title} | ${candidate.role === "recommended" ? "See processing report" : "Not downloaded"} | Pexels License | [license](${candidate.licenseUrl}) | ${candidate.licenseCheckedAt} | no | yes | none | none | no known requirement | reviewed | Source page and search-index evidence checked ${candidate.licenseCheckedAt} | ${candidate.role} | — |`,
);
await writeFile(
  path.join(root, "docs/bar-stock-license-register.md"),
  `# Bar stock license register\n\nAll records are documented as: **Licensed stock image used for editorial bar-category presentation.** The restaurant does not claim copyright ownership. Pexels was sufficient for all eight slots; Unsplash was not used.\n\n| Candidate ID | Slot | Provider | Asset ID | Source page | Direct download used | Photographer | Profile | Title | Original dimensions | License | License page | Checked | Attribution required | Attribution recommended | Visible trademarks | Recognizable people | Separate releases | Commercial use | Evidence | Decision | Rejection reason |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n${registerRows.join("\n")}\n\n## Rejected during research\n\n- Pexels 30622216: rejected for a visibly branded beer glass.\n- Pexels 16142763: rejected for a prominent recognizable rum bottle and nightlife styling.\n- Pexels 14794082 and 9170933: rejected for readable wine labels.\n- People-forward beer and wine results were rejected before the candidate set because recognizable people or venue context reduced release and representation safety.\n\nNo image is mapped to an individual named menu item. Selected files are self-hosted; no selected image is hotlinked.\n`,
);
console.log(`Prepared ${records.length} licensed editorial bar images.`);
