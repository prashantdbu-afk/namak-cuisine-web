import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const groups = [
  {
    title: "Previous homepage",
    ids: [
      "venue-dining-wide-02",
      "venue-dining-wide-07",
      "venue-bar-wide-01",
      "venue-seating-01",
      "venue-dining-bar-01",
      "venue-exterior-day-03",
    ],
  },
  {
    title: "Revised homepage",
    ids: [
      "venue-dining-wide-02",
      "venue-entrance-interior-01",
      "venue-bar-wide-01",
      "venue-seating-01",
      "venue-bar-wide-05",
      "venue-exterior-day-04",
    ],
  },
  {
    title: "Previous Our Story",
    ids: ["venue-dining-wide-07", "venue-dining-window-02"],
  },
  {
    title: "Revised Our Story",
    ids: [
      "venue-architecture-01",
      "food-hyderabadi-chicken-dum-biryani",
      "venue-seating-03",
      "venue-bar-wide-03",
      "venue-entrance-exterior-02",
    ],
  },
];

const manifest = JSON.parse(await readFile("src/media/manifest.json", "utf8"));
const records = new Map(manifest.map((record) => [record.id, record]));
const width = 1600;
const cardWidth = 480;
const cardHeight = 360;
const gutter = 40;
const sectionGap = 74;
const headingHeight = 62;
const rows = groups.reduce(
  (total, group) => total + Math.ceil(group.ids.length / 3),
  0,
);
const height =
  70 +
  groups.length * (headingHeight + sectionGap) +
  rows * (cardHeight + gutter);
const canvas = sharp({
  create: { width, height, channels: 4, background: "#f4efe5" },
});
const composites = [];
let top = 55;

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

for (const group of groups) {
  composites.push({
    input: Buffer.from(
      `<svg width="${width}" height="${headingHeight}"><text x="40" y="38" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#143f34">${escapeXml(group.title)}</text></svg>`,
    ),
    left: 0,
    top,
  });
  top += headingHeight;
  for (const [index, id] of group.ids.entries()) {
    const record = records.get(id);
    if (!record) throw new Error(`Unknown media ID: ${id}`);
    const imagePath = path.join("public", record.source.replace(/^\//, ""));
    const thumbnail = await sharp(imagePath)
      .resize(cardWidth, 300, { fit: "cover" })
      .extend({ bottom: 60, background: "#102f29" })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${cardWidth}" height="60"><rect width="100%" height="100%" fill="#102f29"/><text x="18" y="37" font-family="Arial, sans-serif" font-size="19" font-weight="700" fill="#fffaf0">${escapeXml(id)}</text></svg>`,
          ),
          top: 300,
          left: 0,
        },
      ])
      .png()
      .toBuffer();
    composites.push({
      input: thumbnail,
      left: 40 + (index % 3) * (cardWidth + gutter),
      top: top + Math.floor(index / 3) * (cardHeight + gutter),
    });
  }
  top += Math.ceil(group.ids.length / 3) * (cardHeight + gutter) + sectionGap;
}

await mkdir("visual-review", { recursive: true });
await canvas
  .composite(composites)
  .png()
  .toFile("visual-review/venue-placement-contact-sheet.png");

console.log("Created visual-review/venue-placement-contact-sheet.png");
