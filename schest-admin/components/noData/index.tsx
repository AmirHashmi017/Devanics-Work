import { useNavigate } from 'react-router-dom';
import CustomButton from '../CustomButton/button';
import Description from '../discription';
import SecondaryHeading from '../Headings/Secondary';

type Props = {
  btnText?: string;
  link?: string;
  title: string;
  description?: string;
  displayBtn?: boolean;
};

const NoData = ({
  btnText = 'text',
  link = '/',
  title = 'This is title',
  displayBtn = true,
  description = '',
}: Props) => {
  const navigate = useNavigate();
  return (
    <section className="mt-6 mx-4 rounded-xl bg-white h-[calc(100vh-200px)] grid items-center border border-solid border-silverGray shadow-secondaryTwist">
      <div className="grid place-items-center">
        <div className="max-w-[500px] flex flex-col items-center p-4">
          <div className="bg-lightGray p-12 rounded-full">
            <img src="/assets/icons/estimateempty.svg" alt="no image" />
          </div>
          <SecondaryHeading
            title={title}
            className="text-obsidianBlack2 mt-8"
          />
          {description && (
            <Description
              title={description}
              className="text-steelGray text-center font-normal"
            />
          )}
          {displayBtn && (
            <CustomButton
              className="mt-7"
              text={btnText}
              onClick={() => navigate(link)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default NoData;
