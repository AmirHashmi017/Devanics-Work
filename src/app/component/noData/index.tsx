'use client';
import CustomButton from '@/app/component/customButton/button';
import Description from '@/app/component/description';
import SecondaryHeading from '@/app/component/headings/Secondary';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import Image from 'next/image';

type Props = {
  btnText: string;
  link: string;
  title: string;
  description?: string;
  isButton?: boolean;
};
const NoData = ({
  btnText = 'text',
  link = '/',
  title = 'This is title',
  description = 'This is description',
  isButton = true,
}: Props) => {
  const router = useRouterHook();
  return (
    <section className="mt-6 mx-4 rounded-xl h-[calc(100vh-200px)] grid items-center border border-solid border-silverGray shadow-secondaryTwist !bg-white">
      <div className="grid place-items-center">
        <div className="max-w-[500px] flex flex-col items-center p-4">
          <div className="bg-lightGray p-12 rounded-full">
            <Image
              src={'/estimateempty.svg'}
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
          {isButton ? (
            <CustomButton
              className="mt-7"
              text={btnText}
              onClick={() => router.push(link)}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default NoData;
