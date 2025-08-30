import React, { useState } from 'react';

import DrawHistoryTable from './DrawHistoryTable';
import { TableHeader, TableNavigate } from '.';

const DrawTable = () => {
  const [searchProjectName, setSearchProjectName] = useState('');
  return (
    <div className="w-full bg-graylittle pl-2 rounded-lg  flex space-x-2 h-[160px] py-2 overflow-auto">
      <TableNavigate />
      <div className="w-full space-y-3">
        <TableHeader setSearchProjectName={setSearchProjectName} />
        <DrawHistoryTable searchProjectName={searchProjectName} />
      </div>
    </div>
  );
};

export default DrawTable;
