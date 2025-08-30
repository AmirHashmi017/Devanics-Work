/* eslint-disable @next/next/no-img-element */
import { IAdManagement } from '@/app/interfaces/ad-management.interface';
import { useEffect, useState } from 'react';

type Props = {
  ads: IAdManagement[];
};
export function AdsCarousel({ ads }: Props) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
      },
      ads[currentAdIndex] ? ads[currentAdIndex].duration * 1000 : 5000
    );

    return () => clearInterval(interval);
  }, [currentAdIndex, ads]);

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className={`col-span-${ads.length === 1 ? '12' : '8'}`}>
        {ads[currentAdIndex] && (
          <img
            src={ads[currentAdIndex].imageURL}
            alt={`Ad ${currentAdIndex + 1}`}
            style={{ width: '100%', height: 200, objectFit: 'cover' }}
            className="rounded-md shadow-md"
          />
        )}
      </div>
      {ads.length > 1 && (
        <div className="col-span-4 hidden md:block">
          {ads[(currentAdIndex + 1) % ads.length] && (
            <img
              src={ads[(currentAdIndex + 1) % ads.length].imageURL}
              alt={`Ad ${currentAdIndex + 2}`}
              style={{ width: '100%', height: 200, objectFit: 'cover' }}
              className="rounded-md shadow-md"
            />
          )}
        </div>
      )}
    </div>
  );
}
