export type MediaProvider = "local" | "cloudinary";
export type RightsStatus = "pending" | "approved" | "rejected";
export type FocalPoint = { x: number; y: number };
export type StockProvider = "pexels" | "unsplash";
export type StockMediaMetadata = {
  provider: StockProvider;
  assetId: string;
  sourcePageUrl: string;
  photographer: string;
  photographerProfileUrl: string | null;
  licenseName: string;
  licenseUrl: string;
  licenseCheckedAt: string;
  representation: "editorial-generic";
};

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
  displayCaption?: string;
  decorative: boolean;
  focalPoint?: FocalPoint;
  sizes: string;
  priority?: boolean;
  stock?: StockMediaMetadata;
  usageRole?: string;
  foodStyleFamily?: "ivory-coupe" | "charcoal-kadhai" | "bread-basket";
  foodMediaStatus?: "approved" | "review" | "hold" | "reshoot";
  targetPlateSystem?: "ivory-coupe" | "charcoal-kadhai" | "bread-basket";
  visualCompliance?: "pass" | "temporary" | "reject";
  menuEligible?: boolean;
  actualVisiblePlate?: string;
  actualBackground?: string;
  actualCameraAngle?: string;
  actualLightingStyle?: string;
  complianceReason?: string;
  venueCategory?: string;
  venueUses?: string[];
  venueMediaStatus?: "approved" | "review" | "hold" | "reject";
  peopleApproval?: "not-applicable" | "approved" | "unknown" | "rejected";
  sensitiveInformationFound?: boolean;
  qualityScore?: number;
  generativeEdit?: boolean;
  ownerApprovedEdit?: boolean;
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
