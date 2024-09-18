import type { SomeRequired } from '../_util/type';
import { devUseWarning } from '../_util/warning';
import type { InternalFile, UploadFile } from './interface';

const now = +new Date();
let index = 0;

export function getUid() {
  return `metis-upload-${now}-${++index}`;
}

export function fillUid(file: InternalFile) {
  file.uid = getUid();
  return file;
}

export const attrAccept = (file: InternalFile, acceptedFiles?: string | string[]) => {
  if (file && acceptedFiles) {
    const acceptedFilesArray = Array.isArray(acceptedFiles)
      ? acceptedFiles
      : acceptedFiles.split(',');
    const fileName = file.name || '';
    const mimeType = file.type || '';
    const baseMimeType = mimeType.replace(/\/.*$/, '');

    return acceptedFilesArray.some((type) => {
      const validType = type.trim();
      // This is something like */*,*  allow all files
      if (/^\*(\/\*)?$/.test(type)) {
        return true;
      }

      // like .jpg, .png
      if (validType.charAt(0) === '.') {
        const lowerFileName = fileName.toLowerCase();
        const lowerType = validType.toLowerCase();

        let affixList = [lowerType];
        if (lowerType === '.jpg' || lowerType === '.jpeg') {
          affixList = ['.jpg', '.jpeg'];
        }

        return affixList.some((affix) => lowerFileName.endsWith(affix));
      }

      // This is something like a image/* mime type
      if (/\/\*$/.test(validType)) {
        return baseMimeType === validType.replace(/\/.*$/, '');
      }

      // Full match
      if (mimeType === validType) {
        return true;
      }

      // Invalidate type should skip
      if (/^\w+$/.test(validType)) {
        const warning = devUseWarning('Upload');
        warning(
          false,
          'usage',
          `Upload takes an invalidate 'accept' type '${validType}'.Skip for check.`,
        );
        return true;
      }

      return false;
    });
  }
  return true;
};

interface InternalDataTransferItem extends DataTransferItem {
  isFile: boolean;
  file: (cd: (file: InternalFile) => void) => void;
  createReader: () => any;
  fullPath: string;
  isDirectory: boolean;
  name: string;
  path: string;
}

export const traverseFileTree = async (
  files: InternalDataTransferItem[],
  isAccepted: (file: InternalFile) => boolean,
) => {
  const flattenFileList: InternalFile[] = [];
  const progressFileList: InternalDataTransferItem[] = [];
  files.forEach((file) => progressFileList.push(file.webkitGetAsEntry() as any));

  async function readDirectory(directory: InternalDataTransferItem) {
    const dirReader = directory.createReader();
    const entries = [];

    while (true) {
      const results = await new Promise<InternalDataTransferItem[]>((resolve) => {
        dirReader.readEntries(resolve, () => resolve([]));
      });
      const n = results.length;

      if (!n) {
        break;
      }

      for (let i = 0; i < n; i++) {
        entries.push(results[i]);
      }
    }
    return entries;
  }

  async function readFile(item: InternalDataTransferItem) {
    return new Promise<InternalFile | null>((resolve) => {
      item.file((file) => {
        if (isAccepted(file)) {
          fillUid(file);

          if (item.fullPath && !file.webkitRelativePath) {
            Object.defineProperties(file, {
              webkitRelativePath: {
                writable: true,
              },
            });
            // eslint-disable-next-line no-param-reassign
            (file as any).webkitRelativePath = item.fullPath.replace(/^\//, '');
            Object.defineProperties(file, {
              webkitRelativePath: {
                writable: false,
              },
            });
          }
          resolve(file);
        } else {
          resolve(null);
        }
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _traverseFileTree = async (item: InternalDataTransferItem, path?: string) => {
    if (!item) {
      return;
    }
    // eslint-disable-next-line no-param-reassign
    item.path = path || '';
    if (item.isFile) {
      const file = await readFile(item);
      if (file) {
        flattenFileList.push(file);
      }
    } else if (item.isDirectory) {
      const entries = await readDirectory(item);
      progressFileList.push(...entries);
    }
  };

  let wipIndex = 0;
  while (wipIndex < progressFileList.length) {
    await _traverseFileTree(progressFileList[wipIndex]);
    wipIndex++;
  }

  return flattenFileList;
};

export function file2Obj(file: InternalFile): SomeRequired<UploadFile, 'originFileObj'> {
  return {
    ...file,
    percent: 0,
    originFileObj: file,
  };
}

/** Upload fileList. Replace file if exist or just push into it. */
export function updateFileList(file: UploadFile, fileList: (UploadFile | Readonly<UploadFile>)[]) {
  const nextFileList = [...fileList];
  const fileIndex = nextFileList.findIndex(({ uid }) => uid === file.uid);
  if (fileIndex === -1) {
    nextFileList.push(file);
  } else {
    nextFileList[fileIndex] = file;
  }
  return nextFileList;
}

export function getFileItem(file: InternalFile, fileList: (UploadFile | Readonly<UploadFile>)[]) {
  const matchKey = file.uid !== undefined ? 'uid' : 'name';
  return fileList.filter((item) => item[matchKey] === file[matchKey])[0];
}

export function removeFileItem(file: UploadFile, fileList: (UploadFile | Readonly<UploadFile>)[]) {
  const matchKey = file.uid !== undefined ? 'uid' : 'name';
  const removed = fileList.filter((item) => item[matchKey] !== file[matchKey]);
  if (removed.length === fileList.length) {
    return null;
  }
  return removed;
}

// ==================== Default Image Preview ====================
const extname = (url = '') => {
  const temp = url.split('/');
  const filename = temp[temp.length - 1];
  const filenameWithoutSuffix = filename.split(/#|\?/)[0];
  return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0];
};

const isImageFileType = (type: string): boolean => type.indexOf('image/') === 0;

export const isImageUrl = (file: UploadFile): boolean => {
  if (file.type && !file.thumbUrl) {
    return isImageFileType(file.type);
  }
  const url = file.thumbUrl || file.url || '';
  const extension = extname(url);
  if (
    /^data:image\//.test(url) ||
    /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico|heic|heif)$/i.test(extension)
  ) {
    return true;
  }
  if (/^data:/.test(url)) {
    // other file types of base64
    return false;
  }
  if (extension) {
    // other file types which have extension
    return false;
  }
  return true;
};

const MEASURE_SIZE = 200;

export function previewImage(file: File | Blob): Promise<string> {
  return new Promise<string>((resolve) => {
    if (!file.type || !isImageFileType(file.type)) {
      resolve('');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = MEASURE_SIZE;
    canvas.height = MEASURE_SIZE;
    canvas.style.cssText = `position: fixed; left: 0; top: 0; width: ${MEASURE_SIZE}px; height: ${MEASURE_SIZE}px; z-index: 9999; display: none;`;
    document.body.appendChild<HTMLCanvasElement>(canvas);
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;

      let drawWidth = MEASURE_SIZE;
      let drawHeight = MEASURE_SIZE;
      let offsetX = 0;
      let offsetY = 0;

      if (width > height) {
        drawHeight = height * (MEASURE_SIZE / width);
        offsetY = -(drawHeight - drawWidth) / 2;
      } else {
        drawWidth = width * (MEASURE_SIZE / height);
        offsetX = -(drawWidth - drawHeight) / 2;
      }

      ctx!.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      const dataURL = canvas.toDataURL();
      document.body.removeChild(canvas);
      window.URL.revokeObjectURL(img.src);
      resolve(dataURL);
    };
    img.crossOrigin = 'anonymous';
    if (file.type.startsWith('image/svg+xml')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('image/gif')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      img.src = window.URL.createObjectURL(file);
    }
  });
}
