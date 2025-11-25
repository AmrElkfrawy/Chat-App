import { ENV } from "./env.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME as string,
  api_key: ENV.CLOUDINARY_API_KEY as string,
  api_secret: ENV.CLOUDINARY_API_SECRET as string,
});

interface uploadOptions {
  folder: string;
  resource_type?: "image" | "video" | "raw";
  overwrite?: boolean;
  transformation: Array<Record<string, string | number>>;
}

const uploadToCloudinary = (
  buffer: Buffer,
  options: uploadOptions
): Promise<any> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resource_type ?? "image",
        transformation: options.transformation,
      },
      (error: any, result: any) => {
        if (error || !result)
          return reject(error ?? new Error("Image upload failed"));
        resolve(result);
      }
    );

    stream.end(buffer);
  });

export default cloudinary;
export { uploadToCloudinary };
