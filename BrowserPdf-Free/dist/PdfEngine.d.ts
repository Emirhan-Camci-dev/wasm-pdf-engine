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
export declare class PdfEngineCore {
    options: EngineOptions;
    private plugins;
    constructor(options?: EngineOptions);
    use(plugin: PdfPlugin): this;
    init(): Promise<void>;
    splitPdf(buffer: ArrayBuffer, start: number, end: number): Promise<ArrayBuffer>;
}
