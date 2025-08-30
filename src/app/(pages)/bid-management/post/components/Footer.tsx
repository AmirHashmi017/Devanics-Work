import WhiteButton from '@/app/component/customButton/white';
import CustomButton from '@/app/component/customButton/button';
import TertiaryHeading from '@/app/component/headings/tertiary';

type ButtonProps = {
  text: string;
  onClick: () => void;
  loading?: boolean;
};

type Props = {
  cancelButton: ButtonProps;
  submitButton: ButtonProps;
  info?: {
    title: string;
    description: string;
  };
};

export function PostProjectFooter({ cancelButton, submitButton, info }: Props) {
  return (
    <div className="mt-[37px]">
      <div className="flex items-center justify-between">
        <div>
          <WhiteButton
            text={cancelButton.text}
            onClick={cancelButton.onClick}
          />
        </div>

        <div className="flex items-center flex-1 justify-end space-x-3">
          {info ? (
            <div className="space-y-1">
              <TertiaryHeading
                title={info.title}
                className="text-[14px] leading-[14px] !text-[#007AB6] !font-normal"
              />
              <TertiaryHeading
                title={info.description}
                className="text-[14px] leading-[14px] !text-[#98A2B3] !font-normal"
              />
            </div>
          ) : null}
          <CustomButton
            text={submitButton.text}
            onClick={submitButton.onClick}
            className="!w-44"
            isLoading={submitButton.loading}
            loadingText="Loading..."
          />
        </div>
      </div>
    </div>
  );
}
