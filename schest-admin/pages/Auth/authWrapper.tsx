import PrimaryHeading from 'src/components/Headings/Primary';
import QuaternaryHeading from 'src/components/Headings/Quaternary';

type Props = {
  children: React.ReactNode;
};

const AuthWrapper = ({ children }: Props) => {
  return (
    <div className="h-[100vh] relative grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      <div className="px-14 py-7">{children}</div>
      <div
        className="items-center relative  bg-cloudWhite
       hidden md:flex h-full"
      >
        <div className="flex-1 px-[80px]">
          <PrimaryHeading
            title="Welcome to SCHESTI"
            className=" text-4xl leading-[46px] text-midnightBlue2"
          />
          <QuaternaryHeading
            className="mt-4 text-slateGray"
            title="Embark on a journey where efficiency meets precision. From AI-powered estimate generation to seamless scheduling, we're here to elevate your experience. Let's shape success together. Welcome to a place where your aspirations come to life."
          />
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
