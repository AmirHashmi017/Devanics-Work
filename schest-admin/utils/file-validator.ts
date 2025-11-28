type ValidateImageOptions = {
  requiredWidth: number;
  requiredHeight: number;
};

type ValidationResult = {
  valid: boolean;
  message: string;
};

export const validateImageDimensions = async (
  file: File,
  options: ValidateImageOptions
): Promise<ValidationResult> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve({
        valid: false,
        message: 'Invalid file type. Only images are allowed.',
      });
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    img.onload = () => {
      const { requiredWidth, requiredHeight } = options;
      const isValid =
        img.naturalWidth >= requiredWidth &&
        img.naturalWidth < 1500 &&
        img.naturalHeight >= requiredHeight &&
        img.naturalHeight < 220;

      if (isValid) {
        resolve({ valid: true, message: 'Image dimensions are valid.' });
      } else {
        resolve({
          valid: false,
          message: `Invalid dimensions: ${img.naturalWidth}x${img.naturalHeight}. Required: ${requiredWidth}x${requiredHeight}`,
        });
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image.'));
    };

    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error('FileReader failed to load the file.'));
      }
    };

    reader.readAsDataURL(file);
  });
};
