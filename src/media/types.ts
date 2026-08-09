export type MediaProvider = "local" | "cloudinary";
export type RightsStatus = "pending" | "approved" | "rejected";
export type FocalPoint = { x: number; y: number };

type MediaBase = {
  id: string;
  provider: MediaProvider;
  width: number;
  height: number;
  rightsStatus: RightsStatus;
  productionReady: boolean;
};

export type ImageRecord = MediaBase & {
  kind: "image";
  source: string;
  aspectRatio: number;
  alt: string;
  decorative: boolean;
  focalPoint?: FocalPoint;
  sizes: string;
  priority?: boolean;
  foodStyleFamily?: "ivory-plate" | "indian-vessel" | "bread-basket";
  foodMediaStatus?: "approved" | "review" | "hold" | "reshoot";
};

export type VideoRecord = MediaBase & {
  kind: "video";
  desktopSource: string;
  mobileSource: string;
  webmSource?: string;
  mp4Fallback: string;
  posterId: string;
  durationSeconds: number;
  muted: true;
  decorative: boolean;
};

export type MediaRecord = ImageRecord | VideoRecord;
export type ResolvedVideo = VideoRecord & {
  desktopUrl: string;
  mobileUrl: string;
  webmUrl?: string;
  mp4Url: string;
};
