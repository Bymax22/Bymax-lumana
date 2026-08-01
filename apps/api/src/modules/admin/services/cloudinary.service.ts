import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly hasCloudinaryConfig = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'lumana',
  ): Promise<{ url: string; publicId: string } | null> {
    if (!this.hasCloudinaryConfig) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          if (!result || !result.secure_url || !result.public_id) {
            reject(new Error('Cloudinary upload failed'));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );
      stream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder: string = 'lumana',
  ): Promise<{ url: string; publicId: string }[]> {
    const results = await Promise.all(files.map((file) => this.uploadImage(file, folder)));
    return results.filter(
      (result): result is { url: string; publicId: string } => result !== null,
    );
  }
}
