import React from 'react';
import NoDate from './component/noData';
const NoFoundJs = () => {
  return (
    <div>
      <NoDate
        title="Page does not found"
        description="There is no page for this link"
        isButton={false}
        btnText=""
        link=""
      />
    </div>
  );
};

export default NoFoundJs;
