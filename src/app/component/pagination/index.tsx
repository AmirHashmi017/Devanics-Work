import CustomButton from '@/app/component/customButton/button';
import Image from 'next/image';
import { Pagination } from 'antd';

const Index = () => {
  return (
    <div className="flex mt-5 overflow-x-auto w-full justify-center md:justify-between items-center">
      <div className="lg:block hidden">
        <CustomButton
          className={`!bg-transparent   !border-celestialGray 
        shadow-scenarySubdued2 px-5 py-2.5   
         !text-graphiteGray min-w-40 `}
          icon="/arrow-left.svg"
          iconheight={20}
          iconwidth={20}
          text="Previous"
        />
      </div>

      <Pagination defaultCurrent={1} total={100} />
      <div
        className=" gap-2 rounded-lg border-celestialGray border !bg-snowWhite shadow-scenarySubdued2 
      lg:flex hidden
      px-5 py-2.5"
      >
        <button
          className={
            '!bg-transparent  !border-0 cursor-pointer  text-graphiteGray min-w-40 '
          }
        >
          Next
        </button>
        <Image
          src={'/arrow-right.svg'}
          alt="right arrow icon"
          height={20}
          width={20}
        />
      </div>
    </div>
  );
};

export default Index;
