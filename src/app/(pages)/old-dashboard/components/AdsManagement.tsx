import { adService } from '@/app/services/ad-management.service';
import { Skeleton } from 'antd';
import moment from 'moment';
import { useQuery } from 'react-query';
import { AdsCarousel } from './AdsCarousel';

export function AdsManagement() {
  const adsQuery = useQuery(['ads'], () => {
    return adService.httpGetAllAds();
  });

  if (adsQuery.isLoading) {
    return <Skeleton />;
  }

  if (
    adsQuery.isError ||
    !adsQuery.data?.data?.ads ||
    adsQuery.data?.data?.ads.length === 0
  ) {
    return null;
  }

  const filteredAds = adsQuery.data.data.ads.filter((ad) => {
    const startDate = moment(ad.startDate);
    const expiryDate = moment(ad.expiryDate);
    const current = moment();
    return current.isBetween(startDate, expiryDate);
  });
  return <AdsCarousel ads={filteredAds} />;
}
