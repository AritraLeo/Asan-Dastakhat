import * as fs from 'fs';
import { PDFDocument, PDFImage } from 'pdf-lib';

async function convertPdfToDoc(filePath: string) {

    const existingPdfBytes = await fs.readFileSync(filePath);

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    let page = pdfDoc.getPage(0);

    let img = fs.readFileSync('test_docs/signature.png');

    let EmbedImg: PDFImage = await pdfDoc.embedPng(img);

    const { width, height } = page.getSize();

    EmbedImg.scale(1);

    page.drawImage(EmbedImg, {
        x: page.getWidth() / 2 - width / 2,
        y: page.getHeight() / 2 - height / 2,
    })

    fs.writeFileSync('./output/signed.pdf', await pdfDoc.save());

}


convertPdfToDoc('test_docs/Resume_Anonymous.pdf');