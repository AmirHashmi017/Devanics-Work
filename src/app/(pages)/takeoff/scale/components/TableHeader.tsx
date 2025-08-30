import { Input, Select } from 'antd';
import React from 'react';
import NextImage from 'next/image';
// import { debounce } from '@/app/constants/constant';

interface Props {
  setSearchProjectName: (data: string) => void;
}

const TableHeader: React.FC<Props> = () => {
  // const check = useMemo(() => debounce(300), []);

  return (
    <div className="h-8 ml-5 flex space-x-3">
      <Select value="Markup List" />
      <Input
        className="w-[257px]"
        placeholder="Search..."
        // onChange={(e) => check(() => setSearchProjectName(e.target.value))}
        suffix={
          <NextImage
            src={'/search.svg'}
            alt="search-draw"
            width={15}
            height={15}
          />
        }
      />
      <div className="py-[7px] px-3 bg-white flex space-x-3 items-center rounded-lg border border-celestialGray text-sm text-graphiteGray cursor-pointer">
        <span className="select-none">Filter</span>
        <NextImage
          src={'/filter.svg'}
          alt="table-filter"
          width={15}
          height={15}
        />
      </div>

      <div className="bg-white rounded-lg p-3 flex justify-center items-center border border-celestialGray cursor-pointer">
        <NextImage
          src={'/visible.svg'}
          alt="table-filter"
          width={15}
          height={15}
        />
      </div>
      <div className="bg-white rounded-lg p-3 flex justify-center items-center border border-celestialGray cursor-pointer">
        <NextImage
          src={'/download.svg'}
          alt="table-filter"
          width={15}
          height={15}
        />
      </div>
    </div>
  );
};

export default TableHeader;
