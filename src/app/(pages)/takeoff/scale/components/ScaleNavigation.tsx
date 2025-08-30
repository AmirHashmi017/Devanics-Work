import React from 'react';
import NextImage from 'next/image';
import { twMerge } from 'tailwind-merge';
import { bg_style } from '@/globals/tailwindvariables';
import { SCALE_NAVIGATION, ScaleInterface } from '../../types';

interface Props {
  tool: ScaleInterface;
  setTool: (data: ScaleInterface) => void;
  setShowModal: (data: boolean) => void;
}

const ScaleNavigation: React.FC<Props> = ({ tool, setTool, setShowModal }) => {
  return (
    <div
      className={twMerge(
        `h-12 w-full mt-6 flex flex-row items-center justify-center gap-8  py-[5.5px] ${bg_style} rounded-lg`
      )}
    >
      {SCALE_NAVIGATION.map(
        ({ src, selectedSrc, height, width, alt, label }) => {
          return (
            <div
              key={src}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                setShowModal(true);
                setTool({
                  selected: label,
                  ...((label === 'dynamic' || label === 'perimeter') && {
                    subSelected: 'create',
                  }),
                });
              }}
            >
              {tool.selected === label ? (
                <NextImage
                  src={selectedSrc}
                  alt={alt}
                  width={width}
                  height={height}
                />
              ) : (
                <NextImage src={src} alt={alt} width={width} height={height} />
              )}
              <span
                className={twMerge(
                  `text-xs capitalize ${
                    tool.selected === label ? 'text-[#6F6AF8]' : ''
                  }`
                )}
              >
                {label}
              </span>
            </div>
          );
        }
      )}
    </div>
  );
};

export default ScaleNavigation;
