'use client';
import { Image } from 'antd';
import CustomButton from '../customButton/white';
import { useRouterHook } from '@/app/hooks/useRouterHook';

export function RequestForPost() {
  const router = useRouterHook();

  return (
    <div className="mt-20 bg-[#344054]">
      <div className="px-[20px] lg:px-[100px] xl:px-[200px] py-8">
        <div className="flex space-x-16">
          <div className="mt-4 space-y-7">
            <div>
              <h3 className="text-[#EF9F28] text-[24px] font-medium leading-[32px]">
                Post advertisements request
              </h3>
              <h1 className="text-white pt-[14px] pb-[16px] text-[28px] leading-[40px] lg:text-[40px] lg:leading-[60px]">
                Schedule estimates and create gantt charts
              </h1>
              <p className="text-white text-[16px] leading-[26px] lg:text-[20px] lg:leading-[38px] lg:w-[696.986px]">
                Unlock a prime advertising space for your company! Schesti
                offers exclusive opportunities for our valued partners to
                showcase their
                <br /> brand or promotions here.
              </p>
            </div>
            <CustomButton
              text="Request for post"
              className="!rounded-full !w-48 mt-[48px] !text-[#8449EB]"
              onClick={() => router.push('/request-a-demo')}
            />
          </div>
          <div className="hidden xl:block">
            <Image
              src={'/request-for-post-img.svg'}
              height={309}
              width={277.65}
              alt="dashboard"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
