import { Skeleton } from 'antd';
import React from 'react';

const SkeletonLoader = ({ className = 'my-5' }: { className?: string }) => {
  return (
    <div className={className}>
      <Skeleton />
    </div>
  );
};

export default SkeletonLoader;
