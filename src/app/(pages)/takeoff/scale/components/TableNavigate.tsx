import React from 'react';
import NextImage from 'next/image';

const TableNavigate = () => {
  return (
    <div className="w-9 h-[140px] bg-white rounded-lg flex flex-col space-y-4 items-center py-2.5">
      <NextImage
        className="cursor-pointer"
        src={'/roundDoubleArrow.svg'}
        alt={'roundDoubleArrow'}
        width={17}
        height={17}
      />
      <NextImage
        className="cursor-pointer"
        src={'/list.svg'}
        alt={'list'}
        width={17}
        height={17}
      />
      <NextImage
        className="cursor-pointer"
        src={'/box.svg'}
        alt={'box'}
        width={17}
        height={17}
      />
      <NextImage
        className="cursor-pointer"
        src={'/paperLine.svg'}
        alt={'paperLine'}
        width={17}
        height={17}
      />
    </div>
  );
};

export default TableNavigate;
