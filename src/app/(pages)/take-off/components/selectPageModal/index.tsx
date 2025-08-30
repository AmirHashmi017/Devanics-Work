'use client';
import Button from '@/app/component/customButton/button';
// import WhiteButton from '@/app/component/customButton/white';
import QuaternaryHeading from '@/app/component/headings/quaternary';
// import { AppDispatch } from '@/redux/store';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectTakeoffPreset } from '@/redux/takeoff/takeoff.Selector';
import { useState } from 'react';

interface Props {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  numOfPages: number;
  page?: number;
  uploadFileData?: any;
  handleSrc?: any;
  router?: any;
  loadingPre?: any;
  handleReselect?: any;
}

const SelectPageModal = ({
  setModalOpen,
  uploadFileData,
  handleSrc,
  router,
  loadingPre,
  handleReselect,
}: Props) => {
  // const dispatch = useDispatch<AppDispatch>();
  // const allPresets = useSelector(selectTakeoffPreset);
  const [selectedPages, setselectedPages] = useState<any>([]);
  const [loading, setloading] = useState(false);

  const handleAddRemove = (item: any) => {
    const itemExists = selectedPages?.find((i: any) => i == item);
    if (itemExists) {
      const filtered = selectedPages?.filter((i: any) => i != item);
      setselectedPages(filtered);
    } else {
      setselectedPages((ps: any) => [...ps, item]);
    }
  };

  console.log(selectedPages, ' ===> selectedPages');

  const handleCalibrate = () => {
    try {
      handleReselect();
      setloading(true);
      handleSrc(selectedPages);
      // setModalOpen(false)
      router.push('/takeoff/scale');
    } catch (error) {
      console.log(error, ' error while adding');
      setloading(false);
      handleReselect();
    }
  };

  return (
    <div className="py-2.5 px-6 bg-white border border-solid border-elboneyGray rounded-[4px] z-50">
      <section className="w-full">
        <div className="flex justify-between items-center border-b-Gainsboro ">
          <div>
            <QuaternaryHeading
              title={`Select Pages ${loadingPre == true ? uploadFileData?.length + ' pages loaded' : ''}`}
              className="text-graphiteGray font-bold"
            />
            {/* <QuinaryHeading
              title="Select any existing client from here."
              className="text-coolGray"
            /> */}
          </div>
          {/* <Image
            src={'/crossblack.svg'}
            alt="close icon"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() => setModalOpen(false)}
          /> */}
        </div>
        <div className="py-6">
          <div className="mb-4 px-5 flex gap-x-4 justify-end">
            <span
              className="underline cursor-pointer text-[#7138df]"
              onClick={() => {
                setselectedPages(uploadFileData);
              }}
            >
              select all
            </span>
            <span
              className="underline cursor-pointer text-[#7138df]"
              onClick={() => {
                setselectedPages([]);
              }}
            >
              clear
            </span>
          </div>
          <div className="flex justify-center flex-wrap gap-6 max-h-[400px] overflow-y-auto no-scrollbar">
            {uploadFileData &&
              Array.isArray(uploadFileData) &&
              uploadFileData?.map((i: any, ind: any) => {
                const isIncluded = selectedPages?.find((it: any) => it == i)
                  ? true
                  : false;
                return (
                  <div
                    key={ind}
                    onClick={() => {
                      handleAddRemove(i);
                    }}
                    className={`border relative w-56 h-72 rounded-xl cursor-pointer ${isIncluded ? 'border-[#7138df]' : 'border-gray-400'}`}
                  >
                    <img
                      src={i?.src}
                      className="w-full h-full rounded-xl"
                      alt="img"
                    />
                    <span
                      className={`w-3 h-3 rounded-xl absolute top-3 right-3 cursor-pointer border ${isIncluded ? 'bg-[#7138df] border-[#7138df]' : 'bg-transparent border-gray-400'}`}
                    >
                      .
                    </span>
                  </div>
                );
              })}
            {loadingPre && (
              <div
                className={`border-[2px] relative w-56 h-72 rounded-xl cursor-pointer`}
              >
                Loading...
              </div>
            )}
          </div>
        </div>
      </section>
      <div className="flex justify-end gap-4 mt-5 mb-2">
        <div>
          <Button
            text="Change File"
            className="!bg-snowWhite !text-abyssalBlack !py-1.5 "
            onClick={() => {
              setselectedPages([]);
              setModalOpen(false);
              if (handleReselect) {
                handleReselect();
              }
            }}
          />
        </div>
        <div>
          <Button
            text="Select"
            onClick={handleCalibrate}
            className="!py-1.5 disabled:!bg-lavenderPurple"
            disabled={selectedPages?.length < 1}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectPageModal;
