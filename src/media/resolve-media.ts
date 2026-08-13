import {
  resolveCloudinaryImage,
  resolveCloudinaryVideo,
} from "./providers/cloudinary";
import { resolveLocalSource } from "./providers/local";
import type { ImageRecord, ResolvedVideo, VideoRecord } from "./types";

function resolveImageSource(
  provider: ImageRecord["provider"],
  source: string,
  width?: number,
) {
  return provider === "local"
    ? resolveLocalSource(source)
    : resolveCloudinaryImage(source, width);
}

function resolveVideoSource(provider: VideoRecord["provider"], source: string) {
  return provider === "local"
    ? resolveLocalSource(source)
    : resolveCloudinaryVideo(source);
}

export function resolveImage(record: ImageRecord) {
  return (
    resolveImageSource(record.provider, record.source, record.width) ??
    "/media/media-fallback.svg"
  );
}

export function resolveVideo(record: VideoRecord): ResolvedVideo {
  const resolve = (source: string) =>
    resolveVideoSource(record.provider, source) ?? "";
  return {
    ...record,
    desktopUrl: resolve(record.desktopSource),
    mobileUrl: resolve(record.mobileSource),
    webmUrl: record.webmSource ? resolve(record.webmSource) : undefined,
    mp4Url: resolve(record.mp4Fallback),
  };
}
