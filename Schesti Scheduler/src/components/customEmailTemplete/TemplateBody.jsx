import { CloseOutlined, XOutlined } from "@ant-design/icons";

export function TemplateBody({ onClose, title, children }) {
  return (
    <div className="w-[500px] cursor-default space-y-3 bg-white border pb-3 rounded-lg">
      <div className="bg-schestiLightPrimary py-3 px-4  flex justify-between items-center">
        <h6
          className={`text-[18px] leading-7 font-bold text-midnightBlue font-popin`}
        >
          {title}
        </h6>

        {/* <img
          alt="close icon"
          src="/closeicon.svg"
          height={20}
          width={20}
          onClick={onClose}
          className="cursor-pointer"
        /> */}
        <CloseOutlined onClick={onClose}  className='!text-gray-600' style={{fontSize:'20px'}} />
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}
