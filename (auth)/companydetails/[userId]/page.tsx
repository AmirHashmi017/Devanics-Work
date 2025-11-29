'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { verifyUserEmail } from '@/redux/authSlices/auth.thunk';
import { isEmpty } from 'lodash';
import { USER_ROLES_ENUM } from '@/app/constants/constant';
import { isObjectId } from '@/app/utils/utils';
import { OwnerCompanyDetails } from './components/OwnerCompanyDetails';
import { EducationalCompanyDetails } from './components/EducationalCompanyDetails';
import { CommonCompanyDetails } from './components/CommonCompanyDetails';
import { useUser } from '@/app/hooks/useUser';
const { OWNER } = USER_ROLES_ENUM;

const CompanyDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams<any>();

  const user = useUser();

  useEffect(() => {
    if (!isObjectId(userId) && !isEmpty(userId)) {
      // setIsLoading(true);
      dispatch(verifyUserEmail(userId));
    }
  }, [userId]);

  if (user?.userRole == OWNER) {
    return <OwnerCompanyDetails userId={userId} />;
  } else if (
    user?.userRole == USER_ROLES_ENUM.PROFESSOR ||
    user?.userRole == USER_ROLES_ENUM.STUDENT
  ) {
    return <EducationalCompanyDetails userId={userId} />;
  }

  return <CommonCompanyDetails userId={userId} />;
};

export default CompanyDetails;
