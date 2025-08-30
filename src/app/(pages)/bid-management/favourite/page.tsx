'use client';
import { withAuth } from '@/app/hoc/withAuth';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { addProjectToFavourite } from '../utils';
import { toast } from 'react-toastify';
import { Skeleton } from 'antd';

// This page is for the users coming from email template
function AddProjectToFavouritePage() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const projectId = params.get('projectId');
    if (projectId) {
      addProjectToFavourite(
        projectId,
        () => {
          toast.success('Project Added Successfully');
        },
        (errMsg) => {
          toast.error(errMsg);
          setError(errMsg);
        }
      ).finally(() => {
        setLoading(false);
      });
    }
  }, [params]);

  if (loading) {
    return <Skeleton loading={loading} />;
  }
  if (error.length) {
    return <div>Cannot add project to favourite</div>;
  }
  return <div>Project Added Successfully</div>;
}

export default withAuth(AddProjectToFavouritePage);
