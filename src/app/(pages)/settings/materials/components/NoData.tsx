'use client';
import CustomButton from '@/app/component/customButton/button';
import Description from '@/app/component/description';
import SecondaryHeading from '@/app/component/headings/Secondary';
import Image from 'next/image';

interface Iprops {
  setMaterialModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NoData = ({ setMaterialModal }: Iprops) => {
  return (
    <section className="mt-6 mx-4 grid items-center h-[70vh]">
      <div className="grid place-items-center">
        <div className="max-w-[500px] flex flex-col items-center p-4 gap-y-8">
          <div className="bg-schestiLightPrimary p-12 rounded-full">
            <Image
              src={'/estimateempty.svg'}
              alt="create request icon"
              width={100}
              height={100}
            />
          </div>
          <div>
            <SecondaryHeading
              title="No Materials Founds"
              className="text-obsidianBlack2 text-center"
            />
            <Description
              title="Looks like you haven’t added anything yet."
              className="text-steelGray text-center font-normal"
            />
          </div>
          <div>
            <CustomButton
              type="button"
              text="Import Materials"
              className="!w-auto !p-2.5"
              icon="/plus.svg"
              iconwidth={20}
              iconheight={20}
              onClick={() => setMaterialModal(true)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoData;
