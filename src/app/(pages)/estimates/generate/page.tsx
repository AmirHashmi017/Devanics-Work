'use client';
import React from 'react';
import Records from './records';
import { withAuth } from '@/app/hoc/withAuth';

const GeneratedEstimates = () => {
  return <Records />;
};

export default withAuth(GeneratedEstimates);
