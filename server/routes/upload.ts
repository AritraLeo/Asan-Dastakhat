/*
import express from 'express';
import { Storage, TransferManager } from '@google-cloud/storage';
import dotenv from 'dotenv';
import { isAuthenticated } from '../server';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

dotenv.config();

const router = express.Router();

const storage = new Storage({
    keyFilename: path.join(__dirname, process.env.GCS_KEY_FILE?.toString()),
    projectId: process.env.GCS_PROJECT_ID,
});

const bucketName: string = process.env.GCS_BUCKET_NAME!;
const bucket = storage.bucket(bucketName);

const upload = multer({
    storage: multer.memoryStorage()
})

// async function uploadFile(file: Express.Multer.File) {
//     const blob = bucket.file(file.originalname);
//     const blobStream = blob.createWriteStream({
//         metadata: {
//             contentType: file.mimetype
//         }
//     });

//     return new Promise<string>((resolve, reject) => {
//         blobStream.on('error', reject);

//         blobStream.on('finish', () => {
//             const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.originalname}`;
//             resolve(publicUrl);
//         });

//         blobStream.end(file.buffer);
//     });
// }


async function uploadFile(file: Express.Multer.File) {
    try {
        if (!file) {
            console.error('No file provided');
            throw new Error('No file provided');
        }

        const blob = bucket.file(file.originalname);
        console.log('Blob:', blob);
        const blobStream = blob.createWriteStream();

        return new Promise<string>((resolve, reject) => {
            blobStream.on('error', (err) => {
                console.error('Error uploading file:', err);
                reject(err);
            });

            blobStream.on('finish', () => {
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.originalname}`;
                console.log('File uploaded:', publicUrl);
                resolve(publicUrl);
            });

            blobStream.end(file.buffer);
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

router.post('/signature', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        console.log('File:', file);
        if (!file) {
            console.error('No file provided');
            return res.status(400).json({ error: 'No file provided' });
        }

        const signatureUrl = await uploadFile(file);
        res.json({ signatureUrl });
    } catch (error) {
        console.error('Error uploading signature:', error);
        res.status(500).json({ error: 'Error uploading signature' });
    }
});


// router.post('/signature', isAuthenticated, async (req, res) => {
//     try {
//         const { file } = req.files as { file: Express.Multer.File[] };
//         const signatureUrl = await uploadFile(file[0]);
//         res.json({ signatureUrl });
//     } catch (error) {
//         console.error('Error uploading signature:', error);
//         res.status(500).json({ error: 'Error uploading signature' });
//     }
// });



router.post('/document', isAuthenticated, async (req, res) => {
    try {
        const { file } = req.files as { file: Express.Multer.File[] };
        const documentUrl = await uploadFile(file[0]);
        res.json({ documentUrl });
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ error: 'Error uploading document' });
    }
});

export default router;

*/


import express from 'express';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import { isAuthenticated } from '../server';
import path from 'path';
import multer from 'multer';

dotenv.config();

const router = express.Router();

const keyFilePath = process.env.GCS_KEY_FILE;
if (!keyFilePath) {
    throw new Error('GCS_KEY_FILE environment variable is not defined');
}

const storage = new Storage({
    keyFilename: path.resolve(__dirname, keyFilePath),
    projectId: process.env.GCS_PROJECT_ID,
});

const bucketName = process.env.GCS_BUCKET_NAME;
if (!bucketName) {
    throw new Error('GCS_BUCKET_NAME environment variable is not defined');
}

const bucket = storage.bucket(bucketName);

const upload = multer({
    storage: multer.memoryStorage(),
});

async function uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
        throw new Error('No file provided');
    }

    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
    });

    return new Promise<string>((resolve, reject) => {
        blobStream.on('error', (err) => {
            console.error('Error uploading file:', err);
            reject(err);
        });

        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.originalname}`;
            console.log('File uploaded:', publicUrl);
            resolve(publicUrl);
        });

        blobStream.end(file.buffer);
    });
}

router.post('/signature', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            console.error('No file provided');
            return res.status(400).json({ error: 'No file provided' });
        }

        console.log('File:', file);

        const signatureUrl = await uploadFile(file);
        res.json({ signatureUrl });
    } catch (error) {
        console.error('Error uploading signature:', error);
        res.status(500).json({ error: 'Error uploading signature' });
    }
});

router.post('/document', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            console.error('No file provided');
            return res.status(400).json({ error: 'No file provided' });
        }

        const documentUrl = await uploadFile(file);
        res.json({ documentUrl });
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ error: 'Error uploading document' });
    }
});

export default router;
