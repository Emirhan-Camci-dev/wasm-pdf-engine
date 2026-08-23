// Copyright (c) 2026 Emirhan CAMCI. All rights reserved.
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const btnSplit = document.getElementById('btnSplit') as HTMLButtonElement;
const btnWatermark = document.getElementById('btnWatermark') as HTMLButtonElement;
const btnCompress = document.getElementById('btnCompress') as HTMLButtonElement;
const btnOCR = document.getElementById('btnOCR') as HTMLButtonElement;
const logs = document.getElementById('logs') as HTMLDivElement;

let pdfWorker: Worker;

function log(msg: string) {
  logs.textContent += `\n[${new Date().toLocaleTimeString()}] ${msg}`;
  logs.scrollTop = logs.scrollHeight;
}

function initWorker() {
  pdfWorker = new Worker(new URL('./pdf-worker.ts', import.meta.url), { type: 'module' });
  
  pdfWorker.onmessage = (e) => {
    const { type, payload, error } = e.data;
    
    if (type === 'LOG') {
      log(payload);
    } else if (type === 'SUCCESS') {
      log(`Operation complete. Processing time: ${payload.time}ms`);
      // Trigger download if a file buffer was returned
      if (payload.buffer) {
        const blob = new Blob([payload.buffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = payload.filename || 'output.pdf';
        a.click();
        URL.revokeObjectURL(url);
      }
      resetButtons();
    } else if (type === 'ERROR') {
      log(`ERROR: ${error}`);
      resetButtons();
    } else if (type === 'OCR_RESULT') {
        log(`Operation complete. Processing time: ${payload.time}ms`);
        log(`OCR Text:\n${payload.text}`);
        resetButtons();
    }
  };
}

let currentFile: File | null = null;

function resetButtons() {
  if (currentFile) {
    btnSplit.disabled = false;
    btnWatermark.disabled = false;
    btnCompress.disabled = false;
    btnOCR.disabled = false;
  }
  btnSplit.innerHTML = 'Split Pages 1-5';
  btnWatermark.innerHTML = 'Add Watermark';
  btnCompress.innerHTML = 'Compress PDF';
  btnOCR.innerHTML = 'OCR (First Page)';
}

function setLoading(btn: HTMLButtonElement, text: string) {
  btnSplit.disabled = true;
  btnWatermark.disabled = true;
  btnCompress.disabled = true;
  btnOCR.disabled = true;
  btn.innerHTML = `<span class="spinner"></span>${text}...`;
}

fileInput.addEventListener('change', (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    currentFile = file;
    log(`Selected file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    resetButtons();
  }
});

btnSplit.addEventListener('click', async () => {
  if (!currentFile) return;
  setLoading(btnSplit, 'Splitting');
  const buffer = await currentFile.arrayBuffer();
  pdfWorker.postMessage({ type: 'SPLIT', buffer });
});

btnWatermark.addEventListener('click', async () => {
  if (!currentFile) return;
  setLoading(btnWatermark, 'Watermarking');
  const buffer = await currentFile.arrayBuffer();
  pdfWorker.postMessage({ type: 'WATERMARK', buffer });
});

btnCompress.addEventListener('click', async () => {
  if (!currentFile) return;
  setLoading(btnCompress, 'Compressing');
  const buffer = await currentFile.arrayBuffer();
  pdfWorker.postMessage({ type: 'COMPRESS', buffer });
});

btnOCR.addEventListener('click', async () => {
    if (!currentFile) return;
    setLoading(btnOCR, 'Running OCR');
    const buffer = await currentFile.arrayBuffer();
    pdfWorker.postMessage({ type: 'OCR', buffer });
});

initWorker();
log('System initialized. Waiting for PDF...');
