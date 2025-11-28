import { IoSearchOutline } from 'react-icons/io5';
import CustomButton from 'src/components/CustomButton/button';
import WhiteButton from 'src/components/CustomButton/white';
import { InputComponent } from 'src/components/CustomInput/Input';
import PrimaryHeading from 'src/components/Headings/Primary';

type BtnProps = {
  text?: string;
  onClick?: () => void;
};

type Props = {
  title: string;
  search: string;
  onSearch: (value: string) => void;
  emailBtn: BtnProps;
  exportBtn: BtnProps;
  inviteBtn: BtnProps;
  addNewBtn: BtnProps;
};

export function TopHeader({
  title,
  search,
  onSearch,
  emailBtn,
  exportBtn,
  inviteBtn,
  addNewBtn,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <PrimaryHeading
        title={title}
        className="text-[20px] capitalize text-schestiPrimaryBlack"
      />

      <div className="flex space-x-2 items-center">
        <div className="w-96">
          <InputComponent
            label=""
            name="search"
            type="text"
            placeholder="Search..."
            prefix={<IoSearchOutline />}
            field={{
              value: search ? search : undefined,
              onChange: (e) => onSearch(e.target.value),
            }}
          />
        </div>

        <WhiteButton
          text={emailBtn.text ? emailBtn.text : 'Email'}
          className="!w-fit"
          icon="/assets/icons/mail-black.svg"
          iconheight={20}
          iconwidth={20}
          onClick={emailBtn.onClick}
        />
        <WhiteButton
          text={exportBtn.text ? exportBtn.text : 'Export'}
          className="!w-fit"
          icon="/assets/icons/uploadcloud.svg"
          iconheight={20}
          iconwidth={20}
          onClick={exportBtn.onClick}
        />
        <CustomButton
          text={inviteBtn.text ? inviteBtn.text : 'Invite'}
          className="!w-fit !bg-schestiLightPrimary !text-schestiPrimary !border-schestiLightPrimary"
          icon="/assets/icons/plus-primary.svg"
          iconheight={20}
          iconwidth={20}
          onClick={inviteBtn.onClick}
        />
        <CustomButton
          text={addNewBtn.text ? addNewBtn.text : 'Add New ' + title}
          className="!w-fit"
          icon="/assets/icons/plus.svg"
          iconheight={20}
          iconwidth={20}
          onClick={addNewBtn.onClick}
        />
      </div>
    </div>
  );
}
