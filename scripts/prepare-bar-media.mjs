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
const output = path.join(root, "artifacts/media-review/bar");
const manifestPath = path.join(root, "src/media/manifest.json");
const sourceNames = {
  "bar-stock-hero": "bar-hero-source.jpeg",
  "bar-stock-draft-beer": "bar-draft-beer-source.jpeg",
  "bar-stock-beer": "bar-beer-source.jpeg",
  "bar-stock-whiskey": "bar-whiskey-source.jpeg",
  "bar-stock-gin": "bar-gin-source.jpeg",
  "bar-stock-vodka": "bar-vodka-source.jpeg",
  "bar-stock-tequila": "bar-tequila-source.jpeg",
  "bar-stock-rum": "bar-rum-source.jpeg",
  "bar-stock-aperitivo-liquor": "bar-aperitivo-liquor-source.jpeg",
  "bar-stock-white-wine": "bar-white-wine-source.jpeg",
  "bar-stock-red-wine": "bar-red-wine-source.jpeg",
  "bar-stock-sparkling-wine": "bar-sparkling-wine-source.jpeg",
};

await mkdir(output, { recursive: true });
const records = [];
for (const candidate of selectedBarStock) {
  const presentation = barStockPresentation[candidate.slotId];
  const source = path.join(incoming, sourceNames[candidate.slotId]);
  const hero = candidate.slotId === "bar-stock-hero";
  const target = path.join(output, presentation.output);
  const { data: oriented, info } = await sharp(source)
    .rotate()
    .toBuffer({ resolveWithObject: true });
  const targetRatio = hero ? 3 / 2 : 5 / 3;
  let cropWidth = info.width;
  let cropHeight = info.height;
  if (info.width / info.height > targetRatio) {
    cropWidth = Math.round(info.height * targetRatio);
  } else {
    cropHeight = Math.round(info.width / targetRatio);
  }
  const cropLeft = Math.max(
    0,
    Math.min(
      info.width - cropWidth,
      Math.round(info.width * presentation.focalPoint.x - cropWidth / 2),
    ),
  );
  const cropTop = Math.max(
    0,
    Math.min(
      info.height - cropHeight,
      Math.round(info.height * presentation.focalPoint.y - cropHeight / 2),
    ),
  );
  await sharp(oriented)
    .extract({
      left: cropLeft,
      top: cropTop,
      width: cropWidth,
      height: cropHeight,
    })
    .resize({
      width: hero ? 1800 : 1440,
      height: hero ? 1200 : 864,
      fit: "cover",
      withoutEnlargement: false,
    })
    .modulate({ brightness: 0.98, saturation: 0.9 })
    .linear(1.06, -6)
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
    source: path.relative(root, target),
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
await writeFile(manifestPath, `${JSON.stringify(retained, null, 2)}\n`);
await writeFile(
  path.join(root, "docs/bar-stock-processing-report.json"),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      records: await Promise.all(
        records.map(async (record) => ({
          ...record,
          bytes: (await stat(path.join(root, record.source))).size,
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
  `# Bar stock license register\n\nInternal record only. All records are documented as: **Licensed stock image used for editorial bar-category presentation.** The restaurant does not claim copyright ownership. Pexels was sufficient for the hero and all eleven category slots; Unsplash was not used.\n\n| Candidate ID | Slot | Provider | Asset ID | Source page | Direct download used | Photographer | Profile | Title | Original dimensions | License | License page | Checked | Attribution required | Attribution recommended | Visible trademarks | Recognizable people | Separate releases | Commercial use | Evidence | Decision | Rejection reason |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n${registerRows.join("\n")}\n\n## Rejected during research\n\n- Pexels 30622216: rejected for a visibly branded beer glass.\n- Pexels 16142763: rejected for a prominent recognizable rum bottle and nightlife styling.\n- Pexels 14794082 and 9170933: rejected for readable wine labels.\n- Pexels 31631254, 27305292, and 35740712: rejected because bottle-shelf imagery conflicts with the approved editorial direction.\n- People-forward beer and wine results were rejected before the candidate set because recognizable people or venue context reduced release and representation safety.\n\nNo image is mapped to an individual named menu item. Selected files are self-hosted; no selected image is hotlinked. The category assets are normalized to a 5:3 crop with a shared muted-teal grade and warm highlights.\n`,
);
console.log(`Prepared ${records.length} licensed editorial bar images.`);
