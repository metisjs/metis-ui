import Dragger from './Dragger';
import type { UploadProps } from './interface';
import InternalUpload, { LIST_IGNORE } from './Upload';

export type { DraggerProps } from './Dragger';
export type { UploadChangeParam, UploadFile, UploadListProps, UploadProps } from './interface';

type InternalUploadType = typeof InternalUpload;
type CompoundedComponent<T = any> = InternalUploadType & {
  <U extends T>(
    props: React.PropsWithChildren<UploadProps<U>> & React.RefAttributes<any>,
  ): React.ReactElement;
  Dragger: typeof Dragger;
  LIST_IGNORE: string;
};

const Upload = InternalUpload as CompoundedComponent;
Upload.Dragger = Dragger;
Upload.LIST_IGNORE = LIST_IGNORE;

export default Upload;
