import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function getCloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: string } = {}
): string {
  const { width, height, quality = "auto" } = options;
  const transforms = [`f_auto`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  return cloudinary.url(publicId, {
    transformation: transforms.join(","),
  });
}
