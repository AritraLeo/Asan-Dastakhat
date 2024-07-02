import { PDFDocument, PDFImage } from 'pdf-lib';
import * as fs from 'fs';

export async function signPdf(pdfUrl: string, signatureUrl: string) {
    const pdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
    const signatureBytes = await fetch(signatureUrl).then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const signatureImage = await pdfDoc.embedPng(signatureBytes);

    const page = pdfDoc.getPage(0);
    const { width, height } = page.getSize();

    page.drawImage(signatureImage, {
        x: width / 2 - signatureImage.width / 2,
        y: height / 2 - signatureImage.height / 2,
    });

    const signedPdfBytes = await pdfDoc.save();
    const signedPdfPath = 'path/to/signed.pdf';
    fs.writeFileSync(signedPdfPath, signedPdfBytes);

    return signedPdfPath;
}
