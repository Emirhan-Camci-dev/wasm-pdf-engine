// Copyright (c) 2026 Emirhan CAMCI. All rights reserved.
export interface PdfDocument {
  pageCount: number;
  metadata: Record<string, string>;
}

export interface EngineOptions {
  workerMode?: boolean;
}

export interface PdfPlugin {
  name: string;
  onInit?(engine: PdfEngineCore): Promise<void>;
  beforeSplit?(doc: PdfDocument): Promise<void>;
  afterSplit?(doc: PdfDocument): Promise<void>;
}

export class PdfEngineCore {
  private plugins: PdfPlugin[] = [];

  constructor(public options: EngineOptions = {}) {}

  use(plugin: PdfPlugin): this {
    this.plugins.push(plugin);
    return this;
  }

  async init(): Promise<void> {
    for (const plugin of this.plugins) {
      if (plugin.onInit) await plugin.onInit(this);
    }
    console.log("[Core] PdfEngine initialized.");
  }

  async splitPdf(buffer: ArrayBuffer, start: number, end: number): Promise<ArrayBuffer> {
    const doc: PdfDocument = { pageCount: 10, metadata: {} };
    
    for (const plugin of this.plugins) {
      if (plugin.beforeSplit) await plugin.beforeSplit(doc);
    }

    console.log(`[Core] Splitting PDF from ${start} to ${end}...`);
    // Basic implementation using pdf-lib or single-threaded wasm...
    const result = new ArrayBuffer(0); 

    for (const plugin of this.plugins) {
      if (plugin.afterSplit) await plugin.afterSplit(doc);
    }

    return result;
  }
}
