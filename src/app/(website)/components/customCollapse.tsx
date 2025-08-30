'use client';

import React from 'react';
import { Collapse } from 'antd';
import Image from 'next/image';
interface Propss {
  faqs: any;
}

const CollapseComponent: React.FC<Propss> = ({ faqs }) => {
  let items = faqs.map((faq: any, i: number) => {
    return {
      key: i,
      label: (
        <div className="flex items-center gap-6 font-bold font-Urbanist text-[12px] md:text-[18px] text-[#4B495B] md:leading-[28px]">
          <Image
            src="/images/simple-line-icons_question.svg"
            alt="tick"
            width={40}
            height={40}
          />
          {faq.title}
        </div>
      ),
      children: (
        <p className="w-full font-Gilroy text-[16px] text-[#161C2D] leading-[29px] px-[64px] opacity-70">
          {faq.paragraph}
        </p>
      ),
    };
  });

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return (
    <div>
      {faqs.length > 0 ? (
        <Collapse
          expandIconPosition="end"
          expandIcon={({ isActive }) =>
            isActive ? (
              <Image
                className="rotate-270"
                src="/icons/collapse-up-icon.svg"
                width={20}
                height={10}
                alt=""
              />
            ) : (
              <Image
                className="rotate-90"
                src="/icons/collapse-up-icon.svg"
                width={20}
                height={10}
                alt=""
              />
            )
          }
          items={items}
          defaultActiveKey={['']}
          onChange={onChange}
        />
      ) : (
        <h6 className="font-bold text-center font-Urbanist text-xl text-[#4B495B]">
          No Match Found
        </h6>
      )}
    </div>
  );
};

export default CollapseComponent;
