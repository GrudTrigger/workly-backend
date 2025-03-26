import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class FilesService {
  private s3: S3Client;
  private bucketName = process.env.YANDEX_BUCKET_NAME;

  constructor() {
    this.s3 = new S3Client({
      region: 'ru-central1',
      endpoint:
        process.env.YANDEX_ENDPOINT || 'https://storage.yandexcloud.net',
      credentials: {
        accessKeyId: process.env.YANDEX_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.YANDEX_SECRET_ACCESS_KEY || '',
      },
    });
  }
  async uploadFile(dataBuffer: Buffer, originalname: string, mimetype: string) {
    if (!originalname) {
      throw new Error('Файл отсутствует или не содержит имени');
    }
    const fileExt = path.extname(originalname);

    if (fileExt === '.svg') {
      const fileName = `${randomUUID()}${fileExt}`; // Генерация уникального имени

      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: dataBuffer,
        ContentType: mimetype,
      };

      await this.s3.send(new PutObjectCommand(uploadParams));

      return `${process.env.YANDEX_ENDPOINT}/${this.bucketName}/${fileName}`;
    } else {
      const fileName = `${randomUUID()}.webp`; // Генерация уникального имени
      const webpBuffer = await this.convertToWebp(dataBuffer);
      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: webpBuffer,
        ContentType: 'image/webp',
      };
      await this.s3.send(new PutObjectCommand(uploadParams));
      return `${process.env.YANDEX_ENDPOINT}/${this.bucketName}/${fileName}`;
    }
  }

  async convertToWebp(buffer: Buffer) {
    return sharp(buffer).toFormat('webp').toBuffer();
  }
}
