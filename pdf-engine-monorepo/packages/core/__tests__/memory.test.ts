// Copyright (c) 2026 Emirhan CAMCI. All rights reserved.
import { PdfEngineCore } from '../src/PdfEngine';
import { readFileSync } from 'fs';

// Run this test via Node with: node --expose-gc 
describe('PdfEngine Memory and Benchmark Tests', () => {
  let engine: PdfEngineCore;
  let testPdfBuffer: ArrayBuffer;

  beforeAll(async () => {
    engine = new PdfEngineCore();
    await engine.init();
    // Simulate a 50MB ArrayBuffer for testing
    testPdfBuffer = new ArrayBuffer(50 * 1024 * 1024); 
  });

  it('Benchmark: Should process a 50MB PDF in under 1 second', async () => {
    const startTime = performance.now();
    
    await engine.splitPdf(testPdfBuffer, 1, 10);
    
    const endTime = performance.now();
    const durationMs = endTime - startTime;
    
    console.log(`[Benchmark] 50MB Split Time: ${durationMs.toFixed(2)}ms`);
    expect(durationMs).toBeLessThan(1000); // Must be under 1 sec
  });

  it('Memory Leak Check: Heap usage should not grow after 100 iterations', async () => {
    // 1. Force Garbage Collection before baseline
    if (global.gc) {
      global.gc();
    } else {
      console.warn('Run tests with --expose-gc for accurate memory testing');
    }

    const initialMemory = process.memoryUsage().heapUsed;
    const ITERATIONS = 100;

    // 2. Heavy processing loop
    for (let i = 0; i < ITERATIONS; i++) {
      // Simulate allocating memory inside the engine
      await engine.splitPdf(testPdfBuffer, 1, 2);
    }

    // 3. Force Garbage Collection after workload
    if (global.gc) {
      global.gc();
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryDiffMb = (finalMemory - initialMemory) / 1024 / 1024;

    console.log(`[Memory] Initial Heap: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[Memory] Final Heap: ${(finalMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[Memory] Difference: ${memoryDiffMb.toFixed(2)} MB`);

    // We allow a small tolerance (e.g., 5MB) for V8 internal optimizations, 
    // but a true leak over 100x 50MB files would show GBs of difference.
    expect(memoryDiffMb).toBeLessThan(5); 
  });
});
