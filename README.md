**[Pro]([https://github.com/Emirhan-Camci-dev/wasm-pdf-engine-pro))**


# BrowserPDF 🚀

> **Blazing fast, client-side only PDF processing engine.**

BrowserPDF allows you to parse, split, watermark, compress, and run OCR on PDFs entirely in the browser using WebAssembly and Web Workers. Your users' data never leaves their device!

## ⚡ Quickstart (Sub-5ms Initialization)

```typescript
import { PdfEngineCore } from '@browserpdf/core';
import { PdfProPlugin } from '@browserpdf/pro'; // Optional: Pro Extension

const engine = new PdfEngineCore();
// Optional: Initialize Pro features securely on-device with zero API calls.
engine.use(new PdfProPlugin({ licenseKey: "YOUR_POLAR_SH_LICENSE_KEY" }));

await engine.init(); // Ready in < 5ms!
const result = await engine.splitPdf(fileBuffer, 1, 5);
```

## ⚖️ Community vs. Enterprise

BrowserPDF is dual-licensed. The Core engine is free and open-source under the **AGPLv3** license. 
For commercial projects, closed-source integrations, and enterprise-grade features, a **Pro License** is required.

| Feature | 🌍 Community (AGPLv3) | 💼 Enterprise (Commercial Pro) |
| :--- | :---: | :---: |
| **PDF Parsing & Splitting** | ✅ | ✅ |
| **Watermarking & Merging** | ✅ | ✅ |
| **Client-side Processing** | ✅ | ✅ |
| **License Requirement** | Must open-source your app | Keep your source code private |
| **WebGL/WebGPU Acceleration** | ❌ | ✅ |
| **Multi-threaded Web Workers** | ❌ | ✅ |
| **Advanced OCR (SIMD)** | ❌ | ✅ |
| **Priority Support & Updates** | ❌ | ✅ |

---

### 💳 Get the Pro License

Ready to integrate BrowserPDF into your commercial application without open-sourcing your codebase?

👉 **[Get your Pro License on Polar.sh]([https://polar.sh/](https://buy.polar.sh/polar_cl_M7oNOjFkJ7rc672b6BMdjkrxaWH1N3sYJdFhS1HvSvg))**


Your support directly funds the continuous development and maintenance of this project!

## 📜 Copyright

Copyright (c) 2026 Emirhan CAMCI - byemir@live.com
