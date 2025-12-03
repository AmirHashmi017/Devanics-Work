import React from 'react';

type Props = {
  title?: string;
};
const NoData = ({ title = 'No Data Available' }: Props) => {
  return <p className="font-medium text-center w-full mt-3.5">{title}</p>;
};

export default NoData;
