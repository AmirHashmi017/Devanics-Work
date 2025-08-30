import React from 'react';
import NotLoggedIn from '../component/notLoggedIn';

const withAuth = (WrappedComponent: any) => {
  const modifiedComponent = (props: any): any => {
    const sessionsData = localStorage.getItem('schestiToken');
    return (
      <>{sessionsData ? <WrappedComponent {...props} /> : <NotLoggedIn />}</>
    );
  };

  return modifiedComponent;
};

export default withAuth;
