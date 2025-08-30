'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Blog1 from '../blog';
import Blog2 from '../blog-2';
import Blog3 from '../blog-3';
import Blog4 from '../blog-4';
import SkeletonLoader from '@/app/component/loader/Skeleton';

export default function Privacy() {
  const Components: any = {
    1: Blog1,
    2: Blog2,
    3: Blog3,
    4: Blog4,
  };

  const { id } = useParams();

  if (!id) {
    return <SkeletonLoader />;
  }

  const Blog = Components[id as string];

  return <Blog />;
}
