import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

const storage = new Storage({
    keyFilename: process.env.GCS_KEY_FILE,
    projectId: process.env.GCS_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export async function uploadFile(file: Express.Multer.File) {
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream();

    return new Promise<string>((resolve, reject) => {
        blobStream.on('error', reject);

        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
        });

        blobStream.end(file.buffer);
    });
}
