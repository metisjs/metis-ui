---
group: Data Entry
title: Upload
description: Used to select and upload files or drag and drop files.
demo:
  cols: 2
---

## When To Use

Uploading is the process of publishing information (web pages, text, pictures, video, etc.) to a remote server via a web page or upload tool.

- When you need to upload one or more files.
- When you need to show the process of uploading.
- When you need to upload files by dragging and dropping.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Upload by clicking</code>
<code src="./demo/avatar.tsx">Avatar</code>
<code src="./demo/default-file-list.tsx">Default Files</code>
<code src="./demo/picture-card.tsx">Pictures Wall</code>
<code src="./demo/picture-circle.tsx">Pictures with picture-circle type</code>
<code src="./demo/file-list.tsx">Complete control over file list</code>
<code src="./demo/drag.tsx">Drag and Drop</code>
<code src="./demo/directory.tsx">Upload directory</code>
<code src="./demo/upload-manually.tsx">Upload manually</code>
<code src="./demo/upload-png-only.tsx">Upload png file only</code>
<code src="./demo/picture-style.tsx">Pictures with list style</code>
<code src="./demo/preview-file.tsx">Customize preview file</code>
<code src="./demo/max-count.tsx">Max Count</code>
<code src="./demo/transform-file.tsx">Transform file before request</code>
<code src="./demo/file-type.tsx" debug>custom show icon</code>
<code src="./demo/upload-custom-action-icon.tsx">Custom action icon and extra info</code>
<code src="./demo/drag-sorting.tsx">Drag sorting of uploadList</code>
<code src="./demo/customize-progress-bar.tsx">Customize Progress Bar</code>
<code src="./demo/debug-disabled.tsx" debug>Debug Disabled Styles</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| accept | File types that can be accepted. See [input accept Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) | string | - |  |
| action | Uploading URL | string \| (file) => Promise&lt;string> | - |  |
| beforeUpload | Hook function which will be executed before uploading. Uploading will be stopped with `false` or a rejected Promise returned. When returned value is `Upload.LIST_IGNORE`, the list of files that have been uploaded will ignore it. **Warning：this function is not supported in IE9** | (file, fileList) => boolean \| Promise&lt;File> \| `Upload.LIST_IGNORE` | - |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| customRequest | Override for the default xhr behavior allowing for additional customization and the ability to implement your own XMLHttpRequest | function | - |  |
| data | Uploading extra params or function which can return uploading extra params | object \| (file) => object \| Promise&lt;object> | - |  |
| defaultFileList | Default list of files that have been uploaded | object\[] | - |  |
| directory | Support upload whole directory ([caniuse](https://caniuse.com/#feat=input-file-directory)) | boolean | false |  |
| disabled | Disable upload button | boolean | false |  |
| fileList | List of files that have been uploaded (controlled). | [UploadFile](#uploadfile)\[] | - |  |
| headers | Set request headers, valid above IE10 | object | - |  |
| iconRender | Custom show icon | (file: UploadFile, listType?: UploadListType) => ReactNode | - |  |
| isImageUrl | Customize if render &lt;img /> in thumbnail | (file: UploadFile) => boolean |  |  |
| itemRender | Custom item of uploadList | (originNode: ReactElement, file: UploadFile, fileList: object\[], actions: { download: function, preview: function, remove: function }) => React.ReactNode | - |  |
| listType | Built-in stylesheets, support for four types: `text`, `picture`, `picture-card` or `picture-circle` | string | `text` |  |
| maxCount | Limit the number of uploaded files. Will replace current one when `maxCount` is `1` | number | - |  |
| method | The http method of upload request | string | `post` |  |
| multiple | Whether to support selected multiple files. `IE10+` supported. You can select multiple files with CTRL holding down while multiple is set to be true | boolean | false |  |
| name | The name of uploading file | string | `file` |  |
| openFileDialogOnClick | Click open file dialog | boolean | true |  |
| previewFile | Customize preview file logic | (file: File \| Blob) => Promise&lt;dataURL: string> | - |  |
| progress | Custom progress bar | [ProgressProps](/components/progress/#api) (support `type="line"` only) | { strokeWidth: 2, showInfo: false } |  |
| showUploadList | Whether to show default upload list, could be an object to specify `extra`, `showPreviewIcon`, `showRemoveIcon`, `showDownloadIcon`, `removeIcon` and `downloadIcon` individually | boolean \| { extra?: ReactNode \| (file: UploadFile) => ReactNode, showPreviewIcon?: boolean, showDownloadIcon?: boolean, showRemoveIcon?: boolean, previewIcon?: ReactNode \| (file: UploadFile) => ReactNode, removeIcon?: ReactNode \| (file: UploadFile) => ReactNode, downloadIcon?: ReactNode \| (file: UploadFile) => ReactNode } | true |  |
| withCredentials | The ajax upload with cookie sent | boolean | false |  |
| onChange | A callback function, can be executed when uploading state is changing. It will trigger by every uploading phase. see [onChange](#onchange) | function | - |  |
| onDownload | Click the method to download the file, pass the method to perform the method logic, and do not pass the default jump to the new TAB | function(file): void | (Jump to new TAB) |  |
| onDrop | A callback function executed when files are dragged and dropped into the upload area | (event: React.DragEvent) => void | - |  |
| onPreview | A callback function, will be executed when the file link or preview icon is clicked | function(file) | - |  |
| onRemove | A callback function, will be executed when removing file button is clicked, remove event will be prevented when the return value is false or a Promise which resolve(false) or reject | function(file): boolean \| Promise | - |  |

### SemanticClassName

```ts
type UploadListClassName = SemanticClassName<
  'item' | 'icon' | 'name' | 'actions' | 'thumbnail' | 'progress' | 'image'
>;
type UploadClassName = SemanticClassName<'input' | 'drag', { list?: UploadListClassName }>;
```

### UploadFile

Extends File with additional props.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| crossOrigin | CORS settings attributes | `'anonymous'` \| `'use-credentials'` \| `''` | - |  |
| name | File name | string | - | - |
| percent | Upload progress percent | number | - | - |
| status | Upload status. Show different style when configured | `error` \| `done` \| `uploading` \| `removed` | - | - |
| thumbUrl | Thumb image url | string | - | - |
| uid | unique id. Will auto-generate when not provided | string | - | - |
| url | Download url | string | - | - |

### onChange

> 💡 The function will be called when uploading is in progress, completed, or failed.

When uploading state change, it returns:

```jsx
{
  file: { /* ... */ },
  fileList: [ /* ... */ ],
  event: { /* ... */ },
}
```

1. `file` File object for the current operation.

   ```jsx
   {
      uid: 'uid',      // unique identifier, negative is recommended, to prevent interference with internally generated id
      name: 'xx.png',   // file name
      status: 'done' | 'uploading' | 'error' | 'removed', // Intercepted file by beforeUpload doesn't have a status field.
      response: '{"status": "success"}', // response from server
      linkProps: '{"download": "image"}', // additional HTML props of file link
      xhr: 'XMLHttpRequest{ ... }', // XMLHttpRequest Header
   }
   ```

2. `fileList` current list of files

3. `event` response from the server, including uploading progress, supported by advanced browsers.

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
