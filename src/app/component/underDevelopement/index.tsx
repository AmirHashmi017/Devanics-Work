import PrimaryHeading from '../headings/primary';

interface Props {
  title: String;
}
const UnderDevelop = ({ title }: Props) => {
  return (
    <div className="flex justify-center items-center w-full min-h-[calc(100vh-170px)]">
      <PrimaryHeading title={`${title} Under Development .....`} />
    </div>
  );
};

export default UnderDevelop;
