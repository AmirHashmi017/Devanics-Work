import React from 'react';
import PrimaryHeading from '@/app/component/headings/primary';
import QuaternaryHeading from '@/app/component/headings/quaternary';

type Props = {
  title?: string;
  description?: string;
};

const Welcome = ({ description, title }: Props) => {
  return (
    <>
      <div className="flex-1 px-[80px]">
        <PrimaryHeading
          title={title ? title : 'Welcome to SCHESTI'}
          className=" text-4xl leading-[46px] text-midnightBlue2"
        />
        <QuaternaryHeading
          className="mt-4 text-slateGray"
          title={
            description
              ? description
              : "Embark on a journey where efficiency meets precision. From AI-powered estimate generation to seamless scheduling, we're here to elevate your experience. Let's shape success together. Welcome to a place where your aspirations come to life."
          }
        />
      </div>
    </>
  );
};

export default Welcome;
