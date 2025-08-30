import Description from '@/app/component/description';
import SecondaryHeading from '@/app/component/headings/Secondary';
import Image from 'next/image';

type Props = {
  title: string;
  description: string;
  children?: React.ReactNode;
};
export const MeetingMessage = ({ description, title, children }: Props) => {
  return (
    <section className="mt-6 mx-4 rounded-xl h-[calc(100vh-200px)] grid items-center border border-solid border-silverGray shadow-secondaryTwist">
      <div className="grid place-items-center">
        <div className="max-w-[500px] flex flex-col items-center p-4">
          <div className="bg-lightGray p-12 rounded-full">
            <Image
              src={'/purple-calendar.svg'}
              alt="create request icon"
              width={100}
              height={100}
            />
          </div>
          <SecondaryHeading
            title={title}
            className="text-obsidianBlack2 mt-8"
          />
          <Description
            title={description}
            className="text-steelGray text-center font-normal"
          />

          {children}
        </div>
      </div>
    </section>
  );
};
