type TFileSizeUnit = 'Bytes' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

export const byteConverter = (
  bytes: number,
  only?: TFileSizeUnit,
  decimals = 2
): { unit: TFileSizeUnit; size: number } => {
  const K_UNIT = 1024;
  const SIZES: TFileSizeUnit[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  if (bytes == 0) return { unit: 'Bytes', size: 0 };

  if (only === 'MB')
    return {
      unit: 'MB',
      size: Number((bytes / (K_UNIT * K_UNIT)).toFixed(decimals)),
    };

  let i = Math.floor(Math.log(bytes) / Math.log(K_UNIT));
  return {
    unit: SIZES[i],
    size: parseFloat((bytes / Math.pow(K_UNIT, i)).toFixed(decimals)),
  };
};
