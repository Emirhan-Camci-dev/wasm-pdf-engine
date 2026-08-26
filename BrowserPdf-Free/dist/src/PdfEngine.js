"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfEngineCore = void 0;
class PdfEngineCore {
    options;
    plugins = [];
    constructor(options = {}) {
        this.options = options;
    }
    use(plugin) {
        this.plugins.push(plugin);
        return this;
    }
    async init() {
        for (const plugin of this.plugins) {
            if (plugin.onInit)
                await plugin.onInit(this);
        }
        console.log("[Core] PdfEngine initialized.");
        return this;
    }
    async splitPdf(buffer, start, end) {
        const doc = { pageCount: 10, metadata: {} };
        for (const plugin of this.plugins) {
            if (plugin.beforeSplit)
                await plugin.beforeSplit(doc);
        }
        console.log(`[Core] Splitting PDF from ${start} to ${end}...`);
        // Basic implementation using pdf-lib or single-threaded wasm...
        const result = new ArrayBuffer(0);
        for (const plugin of this.plugins) {
            if (plugin.afterSplit)
                await plugin.afterSplit(doc);
        }
        return result;
    }
}
exports.PdfEngineCore = PdfEngineCore;
