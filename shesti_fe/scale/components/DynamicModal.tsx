'use client';
import { useState } from 'react';
import Image from 'next/image';
import WhiteButton from '@/app/component/customButton/white';
import Button from '@/app/component/customButton/button';
import { DynamicScale, ScaleInterface } from '../../types';

interface Props {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTool: (payload: ScaleInterface) => void;
}

const Dynamic: React.FC<Props> = ({ setModalOpen, setTool }) => {
  const [selected, setSelected] = useState<DynamicScale>('create');

  return (
    <div className="py-2.5 w-[204px] bg-[#F2F2F2] border border-solid border-elboneyGray rounded-lg">
      <section>
        <div className="flex justify-between items-center px-2.5">
          <div>Dynamic</div>
          <Image
            src={'/crossblack.svg'}
            alt="close icon"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={() => setModalOpen(false)}
          />
        </div>
        <div className="border-b-[2px] mt-1.5"></div>

        <div className="px-2.5">
          <div className="pt-3 flex flex-col gap-4">
            <div className="flex flex-col">
              <label>Define :</label>
              <div className="flex flex-col py-2 gap-2">
                <div className="flex flex-row gap-3">
                  <div
                    className="bg-white px-[15px] py-[11px] rounded-lg cursor-pointer"
                    onClick={() => setSelected('create')}
                  >
                    <Image
                      src={
                        selected === 'create'
                          ? '/selectedDyn1.svg'
                          : '/dyn1.svg'
                      }
                      alt="s"
                      width={18}
                      height={18}
                    />
                  </div>
                  <div
                    className="bg-white px-[15px] py-[11px] rounded-lg cursor-pointer"
                    onClick={() => setSelected('fill')}
                  >
                    <Image
                      src={
                        selected === 'fill' ? '/selectedDyn2.svg' : '/dyn2.svg'
                      }
                      alt="s"
                      width={18}
                      height={18}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-3">
                  <div
                    className="bg-white px-[15px] py-[11px] rounded-lg cursor-pointer"
                    onClick={() => setSelected('clear')}
                  >
                    <Image
                      src={
                        selected === 'clear' ? '/selectedDyn3.svg' : '/dyn3.svg'
                      }
                      alt="s"
                      width={18}
                      height={18}
                    />
                  </div>
                  {/* <div className="bg-white px-[15px] py-[11px] rounded-lg ">
                  <Image src={'/dyn4.svg'} alt="s" width={18} height={18} />
                </div> */}
                </div>
              </div>
            </div>
            {/* <div className="flex flex-col">
            <label>Create :</label>
            <div className="flex flex-col py-2 gap-2">
              <div className="flex flex-row gap-3">
                <div className="bg-white px-[15px] py-[11px] rounded-lg ">
                  <Image src={'/create1.svg'} alt="s" width={18} height={18} />
                </div>
                <div className="bg-white px-[15px] py-[11px] rounded-lg ">
                  <Image src={'/volume.svg'} alt="s" width={18} height={18} />
                </div>
              </div>
              <div className="flex flex-row gap-3">
                <div className="bg-white px-[15px] py-[11px] rounded-lg ">
                  <Image src={'/create3.svg'} alt="s" width={18} height={18} />
                </div>
                <div className="bg-white px-[15px] py-[11px] rounded-lg ">
                  <Image src={'/create4.svg'} alt="s" width={18} height={18} />
                </div>
              </div>
              <div className="flex flex-row gap-3">
                <div className="bg-white px-[15px] py-[11px] rounded-lg ">
                  <Image src={'/create5.svg'} alt="s" width={18} height={18} />
                </div>
                <div className="bg-white px-[15px] py-[11px] rounded-lg ">
                  <Image src={'/create6.svg'} alt="s" width={18} height={18} />
                </div>
              </div>
            </div>
          </div> */}
            <div className="flex flex-col gap-2">
              <Button
                text="Apply"
                className="!h-9 !text-abyssalBlack flex items-center justify-center"
                onClick={() =>
                  setTool({ selected: 'dynamic', subSelected: selected })
                }
              />
              <WhiteButton
                className="!h-9 flex items-center justify-center"
                text="Cancel"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dynamic;
