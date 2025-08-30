import { type RcFile } from 'antd/es/upload';
import { FileInterface } from '../interfaces/file.interface';
import AwsS3 from './S3Intergration';
import _ from 'lodash';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const isObjectId = (id: string) => {
  // Check if the parameter value is a 24-character hexadecimal string
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export function calculateProgressBarPercentage(
  totalDays: number,
  daysLeft: number
) {
  if (daysLeft < 0) {
    // throw new Error('Days left cannot be negative');
    return 0;
  }

  const daysPassed = totalDays - daysLeft;
  const percentage = (daysPassed / totalDays) * 100;

  return percentage;
}

export function parseEmailFromQuery(email: string | null) {
  return email ? email.replace(/\s/g, '+') : '';
}

export function fileSizeValidator(file: RcFile | RcFile[]) {
  const allowedSize = 10 * 1024 * 1024; // 10 MB in bytes

  const mb = _.round(allowedSize / (1024 * 1024), 2); // Rounds to 2 decimal places

  if (Array.isArray(file)) {
    const valid = file.every((f) => f.size <= allowedSize);
    return [valid, mb];
  } else {
    const valid = file.size <= allowedSize;
    return [valid, mb];
  }
}

export function uploadFilesToS3(
  file: RcFile | RcFile[],
  path: string
): Promise<FileInterface | FileInterface[]> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      if (Array.isArray(file)) {
        const promises = file.map(async (f) => {
          const url = await new AwsS3(f, path).getS3URL();
          return {
            name: f.name,
            url,
            type: f.type,
            extension: f.name.split('.').pop() || '',
          };
        });

        resolve(await Promise.all(promises));
      } else {
        const url = await new AwsS3(file, path).getS3URL();
        resolve({
          name: file.name,
          url,
          type: file.type,
          extension: file.name.split('.').pop() || '',
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function getFileNameAndExtensionFromURL(url: string) {
  const fileNameWithExt = _.last(_.split(url, '/')); // Get the last part after the last '/'
  if (!fileNameWithExt) {
    return { fileName: '', extension: '' };
  }
  const [fileName, extension] = _.split(fileNameWithExt, '.', 2); // Split the filename by '.'

  return { fileName, extension };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
