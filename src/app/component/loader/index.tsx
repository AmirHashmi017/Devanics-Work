import { Spin } from 'antd';
import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center mt-3">
      <Spin />
    </div>
  );
};

export default Loader;
