import imageCompression, { type Options } from "browser-image-compression";

// export type compressImageType = {
//   maxSizeMB: number;
//   useWebWorker: boolean;
//   initialQuality: number;
// };

// optionsは必要に応じて調整する
// https://github.com/Donaldcwl/browser-image-compression#api
export const compressImage = async (
  file: File,
  options: Options = {
    maxSizeMB: 1,
    useWebWorker: true,
    initialQuality: 0.85,
    maxWidthOrHeight: 514,
  }
): Promise<File> => {
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return Promise.reject(new Error(`compress failed: ${err}`));
  }
};
