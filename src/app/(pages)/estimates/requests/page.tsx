'use client';
import React from 'react';
import Records from './records';
import { withAuth } from '@/app/hoc/withAuth';

const EstimateRequests = () => {
  return <Records />;
};

export default withAuth(EstimateRequests);
