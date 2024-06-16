import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import ImageModule from 'docxtemplater-image-module-free';

// Paths
const pdfPath = path.resolve(__dirname, 'test_docs/Resume_Anonymous.pdf');
const docxPath = path.resolve(__dirname, 'output/Resume_Anonymous.docx');
const imagePath = path.resolve(__dirname, 'output/signature.png');
const finalPdfPath = path.resolve(__dirname, 'output/Resume_Anonymous_signed.pdf');

// Convert PDF to DOCX using LibreOffice
function convertPdfToDocx(pdfPath: string, docxPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const cmd = `soffice --headless --convert-to docx "${pdfPath}" --outdir "${path.dirname(docxPath)}"`;
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(`Error converting PDF to DOCX: ${stderr}`);
            } else {
                resolve();
            }
        });
    });
}

// Insert image into DOCX using docxtemplater
async function insertImageIntoDocx(docxPath: string, imagePath: string): Promise<void> {
    const content = fs.readFileSync(docxPath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        modules: [new ImageModule({
            centered: true,
            getImage: () => fs.readFileSync(imagePath),
            getSize: () => [150, 150]
        })]
    });

    // Assuming you want to add the image at the end of the document
    doc.setData({});
    doc.render();

    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(docxPath, buf);
}

// Convert DOCX back to PDF using LibreOffice
function convertDocxToPdf(docxPath: string, pdfPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const cmd = `soffice --headless --convert-to pdf "${docxPath}" --outdir "${path.dirname(pdfPath)}"`;
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(`Error converting DOCX to PDF: ${stderr}`);
            } else {
                resolve();
            }
        });
    });
}

// Main function to execute the workflow
async function main() {
    try {
        await convertPdfToDocx(pdfPath, docxPath);
        await insertImageIntoDocx(docxPath, imagePath);
        await convertDocxToPdf(docxPath, finalPdfPath);
        console.log('PDF conversion and signature insertion complete.');
    } catch (error) {
        console.error(error);
    }
}

// Run the main function and handle errors
main().catch(console.error);
