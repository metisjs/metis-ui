import { devUseWarning } from '../_util/warning';
import type { InternalFile } from './interface';

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
