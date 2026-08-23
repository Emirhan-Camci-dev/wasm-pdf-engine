# BrowserPdf Core 🚀

**The fastest, client-side, browser-only PDF manipulation engine powered by WebAssembly.**

BrowserPdf Core is an open-source library (AGPLv3) that provides a blazing-fast architecture for splitting, merging, and rendering PDFs natively in the browser using Web Workers. 

No server required. Absolute privacy. 

## Features
- **Zero Server Costs:** 100% Client-side.
- **Non-blocking UI:** Engineered around Web Workers.
- **WASM Powered:** Handles 50MB+ PDFs smoothly.

## Installation

```bash
npm install @browserpdf/core
```

## Basic Usage

```typescript
import { PdfEngineCore } from '@browserpdf/core';

const engine = new PdfEngineCore();
await engine.init();

const splitBuffer = await engine.splitPdf(fileBuffer, 1, 5);
```

## 💎 Upgrade to BrowserPdf Pro / Enterprise

For demanding enterprise workloads, **BrowserPdf Pro** provides mission-critical features via a drop-in plugin architecture (no code rewrites required). 

| Feature | Core (Free) | Pro (Commercial) |
|---|---|---|
| **License** | AGPLv3 | Proprietary / Commercial |
| **Worker Threads** | Single Worker | Multi-threaded Pool |
| **GPU Acceleration** | ❌ | ✅ (WebGPU / WebGL) |
| **OCR (Tesseract SIMD)**| ❌ | ✅ |
| **Auto-Retry & Analytics**| ❌ | ✅ |

### How to get Pro?
Visit [https://browserpdf.com/pricing](https://browserpdf.com/pricing) to purchase a commercial license for closed-source distribution and enterprise support.

Once purchased, integration is just two lines of code:

```typescript
import { PdfEngineCore } from '@browserpdf/core';
import { PdfProPlugin } from '@browserpdf/pro'; // Installed via private registry

const engine = new PdfEngineCore();
engine.use(new PdfProPlugin({ 
  licenseKey: 'YOUR_OFFLINE_LICENSE_KEY',
  enableGpuAcceleration: true,
  maxThreads: 4
}));

await engine.init();
```
