/* eslint-disable @next/next/no-img-element */
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { useUser } from '@/app/hooks/useUser';
import { useUserBrandingColor } from '@/app/hooks/useUserBrandingColor';
import { useLayoutEffect, useState } from 'react';

export function ClientInvoiceHeader() {
  const user = useUser();
  const color = useUserBrandingColor();
  const [imgUrl, setImageurl] = useState('');

  const convertImageToBase64 = (imageUrl: string) => {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Allow cross-origin images
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);

        const base64String = canvas.toDataURL('image/png'); // Get Base64 string
        resolve(base64String);
      };

      img.onerror = (error) => {
        reject(error); // Handle errors
      };
    });
  };

  useLayoutEffect(() => {
    if (user && user.companyLogo) {
      convertImageToBase64(user.companyLogo).then((base64String) => {
        setImageurl(base64String);
      });
    }
  }, [user]);

  return (
    <div
      className={`h-[60px] p-7 flex items-center`}
      style={{
        backgroundColor: color,
      }}
    >
      {imgUrl ? (
        <div className="relative">
          <img
            src={imgUrl}
            alt="LOGO"
            className="w-10 h-10 rounded-full border border-gray-300 object-cover"
          />
        </div>
      ) : (
        <SenaryHeading
          title={user?.companyName || user?.organizationName || ''}
          className="text-lg"
        />
      )}
    </div>
  );
}
