import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  onChange: (_date: string) => void;
  value: string;
};
export function DailyWorkDatePicker({ onChange, value }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 rounded-full flex  items-center space-x-3 cursor-pointer"
      >
        {dayjs(value).format('DD MMM YYYY')}
        <Image
          src={'/chevron-up.svg'}
          alt="chevron up"
          width={20}
          height={20}
        />
      </button>
      <DatePicker
        open={open}
        onOpenChange={setOpen}
        style={{
          visibility: 'hidden',
          width: 0,
        }}
        value={dayjs(value)}
        onChange={(_date, dateString) => {
          onChange(dateString as string);
        }}
      />
    </div>
  );
}
