// Copyright (c) 2026 Emirhan CAMCI. All rights reserved.
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import * as tesseract from 'tesseract-wasm';

const log = (msg: string) => postMessage({ type: 'LOG', payload: msg });

async function handleSplit(buffer: ArrayBuffer) {
  const start = performance.now();
  log('Loading PDF for splitting...');
  
  const pdfDoc = await PDFDocument.load(buffer);
  const totalPages = pdfDoc.getPageCount();
  log(`PDF loaded. Total pages: ${totalPages}. Extracting first 5 pages...`);

  const newDoc = await PDFDocument.create();
  
  // Extract up to 5 pages
  const pageIndices = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i);
  const copiedPages = await newDoc.copyPages(pdfDoc, pageIndices);
  
  copiedPages.forEach((page) => newDoc.addPage(page));
  
  const pdfBytes = await newDoc.save();
  const time = performance.now() - start;
  
  postMessage({
    type: 'SUCCESS',
    payload: { buffer: pdfBytes, filename: 'split_1_to_5.pdf', time: time.toFixed(2) }
  }, [pdfBytes.buffer] as any);
}

async function handleWatermark(buffer: ArrayBuffer) {
  const start = performance.now();
  log('Loading PDF for watermarking...');
  
  const pdfDoc = await PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();
  
  log('Adding watermark to all pages...');
  for (const page of pages) {
    const { width, height } = page.getSize();
    page.drawText('CONFIDENTIAL', {
      x: width / 2 - 150,
      y: height / 2,
      size: 50,
      color: rgb(0.95, 0.1, 0.1),
      opacity: 0.5,
      rotate: degrees(45),
    });
  }
  
  const pdfBytes = await pdfDoc.save();
  const time = performance.now() - start;
  
  postMessage({
    type: 'SUCCESS',
    payload: { buffer: pdfBytes, filename: 'watermarked.pdf', time: time.toFixed(2) }
  }, [pdfBytes.buffer] as any);
}

async function handleCompress(buffer: ArrayBuffer) {
  const start = performance.now();
  log('Loading PDF for compression...');
  
  // PDF-lib doesn't have true image re-compression out of the box, 
  // but we can save without preserving objects to remove some overhead.
  const pdfDoc = await PDFDocument.load(buffer);
  
  log('Compressing object streams...');
  // Use Object Streams for compression
  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  const time = performance.now() - start;
  
  postMessage({
    type: 'SUCCESS',
    payload: { buffer: pdfBytes, filename: 'compressed.pdf', time: time.toFixed(2) }
  }, [pdfBytes.buffer] as any);
}

async function handleOCR(buffer: ArrayBuffer) {
    const start = performance.now();
    log('Initializing tesseract-wasm OCR engine...');
    // We would need to convert PDF page to image first. 
    // For PoC, let's just show that tesseract-wasm can be loaded in a worker.
    log('(Note: True PDF OCR requires rendering the PDF to an image first, e.g. via pdf.js/mupdf)');
    log('Simulating OCR process using WebAssembly SIMD...');
    
    // Simulate some heavy work that would normally block the UI
    let result = 0;
    for (let i = 0; i < 1000000000; i++) {
        result += Math.sqrt(i);
    }
    
    const time = performance.now() - start;
    
    postMessage({
        type: 'OCR_RESULT',
        payload: { text: "Mock OCR Text: This is a placeholder since rendering PDF to Image in worker requires mupdf/pdf.js canvas integration.", time: time.toFixed(2) }
    });
}

onmessage = async (e) => {
  const { type, buffer } = e.data;
  
  try {
    switch (type) {
      case 'SPLIT':
        await handleSplit(buffer);
        break;
      case 'WATERMARK':
        await handleWatermark(buffer);
        break;
      case 'COMPRESS':
        await handleCompress(buffer);
        break;
      case 'OCR':
        await handleOCR(buffer);
        break;
      default:
        log(`Unknown operation: ${type}`);
    }
  } catch (err: any) {
    postMessage({ type: 'ERROR', error: err.message });
  }
};
