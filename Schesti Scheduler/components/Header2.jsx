import { ArrowDropDownOutlined, LightbulbOutlined, SettingsOutlined } from "@mui/icons-material";
import { Button } from "antd";
import { PiChatCircleDotsDuotone } from "react-icons/pi";
import { RiEarthLine } from "react-icons/ri";

const Header2 = () => {
  return (
    <div className="flex justify-between w-full gap-4 px-4 py-2 shadow-md">
      <div></div>
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-1 cursor-pointer">
          <RiEarthLine className="text-[#007AB6] !w-6 !h-6" />
          <h1 className="text-[#007AB6] mt-2 text-sm">Eng</h1>
          <ArrowDropDownOutlined className="!w-6 !h-6 cursor-pointer text-[#007AB6]" />
        </div>
        <PiChatCircleDotsDuotone className="text-[#007AB6] !w-6 !h-6 cursor-pointer" />
        <SettingsOutlined className="text-[#007AB6] !w-6 !h-6 cursor-pointer" />
        <Button
          variant="outlined"
          className="flex items-center gap-2 !border !border-[#007AB6] !rounded-lg !px-4 !py-2"
        >
          <LightbulbOutlined className="!text-[#007AB6] !w-6 !h-6 cursor-pointer" />
          <span className="text-sm text-[#007AB6]">Upgrade Plans</span>
        </Button>
      </div>
    </div>
  );
};

export default Header2;
