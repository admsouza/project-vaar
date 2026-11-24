import { createWorker, OEM } from 'tesseract.js';
import workerUrl from 'tesseract.js/dist/worker.min.js?url';
import coreUrl from 'tesseract.js-core/tesseract-core-lstm.wasm.js?url';
import portugueseUrl from '@tesseract.js-data/por/4.0.0_best_int/por.traineddata.gz?url';

export async function createPortugueseReader(signal) {
  signal.throwIfAborted();
  const langPath = new URL('.', new URL(portugueseUrl, window.location.href)).href;
  let rejectStartup;
  const failure = new Promise((_, reject) => { rejectStartup = reject; });
  const cancel = () => rejectStartup(signal.reason);
  const timeout = setTimeout(() => rejectStartup(new Error('Tempo de inicialização esgotado.')), 30000);
  signal.addEventListener('abort', cancel, { once: true });
  const startup = createWorker('por', OEM.LSTM_ONLY, {
    workerPath: workerUrl,
    corePath: coreUrl,
    langPath,
    workerBlobURL: false,
    cacheMethod: 'none',
    errorHandler: rejectStartup,
  });
  try {
    return await Promise.race([startup, failure]);
  } catch (error) {
    void startup.then(worker => worker.terminate()).catch(() => {});
    throw error;
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener('abort', cancel);
  }
}
