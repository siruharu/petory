export interface PickedImageFile {
  dataUrl: string;
  fileName: string;
}

type InputChangeHandler = () => void;

type BrowserInputLike = {
  type: string;
  accept: string;
  files?: ArrayLike<File> | null;
  onchange: InputChangeHandler | null;
  click: () => void;
};

type BrowserDocumentLike = {
  createElement: (tagName: 'input') => BrowserInputLike;
};

function getBrowserDocument(): BrowserDocumentLike | null {
  const browserGlobal = globalThis as typeof globalThis & {
    document?: BrowserDocumentLike;
  };

  return browserGlobal.document ?? null;
}

export async function pickWebImageAsDataUrl(): Promise<PickedImageFile | null> {
  const document = getBrowserDocument();

  if (!document) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = () => {
      const file = input.files?.[0] ?? null;

      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : null;
        if (!result) {
          reject(new Error('이미지 파일을 읽지 못했어요.'));
          return;
        }

        resolve({
          dataUrl: result,
          fileName: file.name,
        });
      };
      reader.onerror = () => {
        reject(new Error('이미지 파일을 읽지 못했어요.'));
      };
      reader.readAsDataURL(file);
    };

    input.click();
  });
}
