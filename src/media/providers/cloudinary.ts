const imageTransforms = "f_auto,q_auto,c_fill";

function cloudinaryUrl(
  resourceType: "image" | "video",
  publicId: string,
  transforms: string,
) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return undefined;
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transforms}/${encodeURIComponent(publicId)}`;
}

export function resolveCloudinaryImage(publicId: string, width?: number) {
  return cloudinaryUrl(
    "image",
    publicId,
    `${imageTransforms}${width ? `,w_${width}` : ""}`,
  );
}

export function resolveCloudinaryVideo(publicId: string) {
  return cloudinaryUrl("video", publicId, "q_auto");
}
