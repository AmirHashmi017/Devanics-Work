import Welcome from '@/app/(pages)/(auth)/welcome';
import Image from 'next/image';

type Props = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

const WelcomeWrapper = ({ children, description, title }: Props) => {
  return (
    <div className="h-[100vh] bg-schestiPrimaryBG relative grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
      <div className="px-14 py-7">{children}</div>
      <div
        className="items-center relative  bg-schestiLightPrimary
       hidden md:flex h-full overflow-x-hidden overflow-y-hidden"
      >
        <Image
          src={'/ellipse.png'}
          alt="ellipse"
          width={411.57}
          height={414.68}
          className="absolute -top-4 -right-40"
        />
        <Image
          src={'/ellipse.png'}
          alt="ellipse"
          width={564.35}
          height={567.46}
          className="absolute -top-4 -right-36"
        />
        <Image
          src={'/ellipse.png'}
          alt="ellipse"
          width={742.07}
          height={745.19}
          className="absolute -top-4 -right-32"
        />

        <Image
          src={'/ellipse.png'}
          alt="ellipse"
          width={800.74}
          height={800}
          className="absolute -top-4 -right-16"
        />
        <Welcome description={description} title={title} />
      </div>
    </div>
  );
};

export default WelcomeWrapper;
