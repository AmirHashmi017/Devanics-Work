import { adService } from '@/app/services/ad-management.service';
import { CloseOutlined } from '@ant-design/icons';
import { useInterval, useLocalStorageState } from 'ahooks';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import moment from 'moment';
import _ from 'lodash';

const KEY = 'REMOVE_ADS-';
const DEFAULT_DURATION = 30; // 30 minutes
const DEFAULT_INTERVAL = 3000; // 3 seconds
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

type IRemovedAd = {
  _id: string;
  duration: number;
};

export function AdManagement() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const [closedAds, setClosedAds] = useLocalStorageState<
    IRemovedAd[] | undefined
  >(KEY, { defaultValue: [] });

  const {
    data: ads = [],
    isLoading,
    isError,
  } = useQuery(
    ['ads', KEY],
    async () => {
      const response = await adService.httpGetAllAds();
      return response.data?.ads || [];
    },
    {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchOnWindowFocus: false,
    }
  );

  const availableAds = useMemo(
    () => _.differenceBy(ads, closedAds || [], '_id'),
    [ads, closedAds]
  );

  const currentAd = availableAds[currentAdIndex] || null;

  const duration = currentAd ? currentAd.duration * 1000 : DEFAULT_INTERVAL;

  useInterval(() => {
    if (availableAds.length > 1) {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % availableAds.length);
    }
  }, duration);

  const cleanupClosedAds = useCallback(() => {
    if (!closedAds?.length) return;

    const now = moment().unix();
    const updatedClosedAds = closedAds.filter((ad) => ad.duration > now);

    if (updatedClosedAds.length !== closedAds.length) {
      setClosedAds(updatedClosedAds);
    }
  }, [closedAds, setClosedAds]);

  useInterval(cleanupClosedAds, CLEANUP_INTERVAL);

  const removeAd = useCallback(
    (index: number) => {
      const adToRemove = availableAds[index];
      if (
        !adToRemove?._id ||
        closedAds?.some((ad) => ad._id === adToRemove._id)
      ) {
        return;
      }

      const newClosedAd: IRemovedAd = {
        _id: adToRemove._id,
        duration: moment().add(DEFAULT_DURATION, 'minutes').unix(),
      };

      setClosedAds((prev) => [...(prev || []), newClosedAd]);

      // Adjust index if the last ad is removed
      if (availableAds.length === 1) {
        setCurrentAdIndex(0); // Reset if it's the only ad
      } else {
        setCurrentAdIndex((prevIndex) =>
          prevIndex >= availableAds.length - 1 ? 0 : prevIndex
        );
      }
    },
    [availableAds, closedAds, setClosedAds]
  );

  if (isLoading || isError || !ads.length || !currentAd) {
    return null;
  }

  return (
    <div className="relative">
      <CloseOutlined
        className="absolute top-[10px] right-[10px] text-[20px] text-white bg-black rounded-full p-[5px] cursor-pointer z-10 hover:opacity-80 transition-opacity"
        onClick={() => removeAd(currentAdIndex)}
      />
      <div className="w-full max-w-full max-h-full">
        <img
          src={currentAd.imageURL}
          alt={`${currentAd.clientName} Ad`}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    </div>
  );
}
