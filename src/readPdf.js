import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { maximumFileSize, maximumPages, suggestEvidence } from './evidence.js';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

function pageText(items) {
  return items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('');
}

async function scanPage(page, worker, signal) {
  const size = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: Math.min(2.5, 2000 / Math.max(size.width, size.height)) });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const render = page.render({ canvas, viewport });
  const cancel = () => render.cancel();
  signal.addEventListener('abort', cancel, { once: true });
  try {
    await render.promise;
    signal.throwIfAborted();
    const { data } = await worker.recognize(canvas);
    return data.text;
  } finally {
    signal.removeEventListener('abort', cancel);
    canvas.width = canvas.height = 0;
  }
}

export async function readEvidencePdf(file, onProgress, signal) {
  if (!file.name.toLowerCase().endsWith('.pdf') || file.size > maximumFileSize) {
    return { message: 'Escolha um PDF de até 10 MB.' };
  }
  const data = await file.arrayBuffer();
  signal.throwIfAborted();
  const loading = getDocument({ data, isEvalSupported: false });
  let reader;
  let stopReading;
  const abort = () => {
    stopReading?.();
    void loading.destroy().catch(() => {});
  };
  signal.addEventListener('abort', abort, { once: true });
  try {
    const pdf = await loading.promise;
    if (pdf.numPages > maximumPages) {
      return { message: 'O leitor aceita até 10 páginas. Anexe um PDF menor ou preencha os campos manualmente.' };
    }
    const pages = [];
    for (let number = 1; number <= pdf.numPages; number += 1) {
      signal.throwIfAborted();
      const page = await pdf.getPage(number);
      onProgress(`Lendo página ${number} de ${pdf.numPages}…`);
      let text = pageText((await page.getTextContent()).items);
      if (text.replace(/\s/g, '').length < 25) {
        signal.throwIfAborted();
        onProgress(`Reconhecendo o texto da página ${number} de ${pdf.numPages}…`);
        if (!reader) {
          const { createPortugueseReader } = await import('./ocr.js');
          reader = await createPortugueseReader(signal);
        }
        // Terminating the worker alone leaves the recognition promise pending.
        text = await new Promise((resolve, reject) => {
          stopReading = () => reject(signal.reason);
          scanPage(page, reader, signal).then(resolve, reject);
        });
        stopReading = null;
      }
      pages.push({ page: number, text });
      page.cleanup();
    }
    return { suggestions: suggestEvidence(pages) };
  } finally {
    signal.removeEventListener('abort', abort);
    await Promise.allSettled([reader?.terminate(), loading.destroy()]);
  }
}
