import records from "./manifest.json";
import type { ImageRecord, MediaRecord, VideoRecord } from "./types";

export const mediaManifest = records as MediaRecord[];
export const imageMedia = mediaManifest.filter(
  (record): record is ImageRecord => record.kind === "image",
);
export const videoMedia = mediaManifest.filter(
  (record): record is VideoRecord => record.kind === "video",
);

export function getImageRecord(id: string) {
  const record = imageMedia.find((item) => item.id === id);
  if (!record) throw new Error(`Unknown image media ID: ${id}`);
  return record;
}

export function getVideoRecord(id: string) {
  const record = videoMedia.find((item) => item.id === id);
  if (!record) throw new Error(`Unknown video media ID: ${id}`);
  return record;
}
