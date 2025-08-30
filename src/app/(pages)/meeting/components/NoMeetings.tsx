import CustomButton from '@/app/component/customButton/button';
import Description from '@/app/component/description';
import SecondaryHeading from '@/app/component/headings/Secondary';
import Image from 'next/image';

type Props = {
  onClick(): void;
};

export function NoMeetings({ onClick }: Props) {
  return (
    <section className="mt-6 mx-4 rounded-xl h-[calc(100vh-200px)] grid items-center border border-solid border-silverGray shadow-secondaryTwist">
      <div className="grid place-items-center">
        <div className="max-w-[500px] flex flex-col items-center p-4">
          <div className="bg-schestiLightPrimary p-12 rounded-full">
            <Image
              src={'/calender-cyan.svg'}
              alt="create request icon"
              width={100}
              height={100}
            />
          </div>
          <SecondaryHeading
            title="No meeting schedule "
            className="text-obsidianBlack2 mt-8"
          />
          <Description
            title="There are no scheduled meeting."
            className="text-steelGray text-center font-normal"
          />
          <CustomButton
            className="mt-7"
            text={'Schedule a meeting'}
            onClick={onClick}
          />
        </div>
      </div>
    </section>
  );
}
