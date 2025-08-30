import React from 'react';
import profileIMG from '../../../../public/clientImage5.png';

interface MessageProps {
  title: string;
  posted: string;
  messageType: string;
  chatType: string;
  chatIcon: string | React.ReactNode;
  description: string;
  openModal: () => void;
}

const MessageComponent: React.FC<MessageProps> = ({
  title,
  posted,
  messageType,
  chatIcon,
  description,
  openModal,
}) => {
  const renderChatIcon = (icon: string) => {
    return <span dangerouslySetInnerHTML={{ __html: icon }} />;
  };

  return (
    <div className="flex py-5">
      <div className="pe-5 rounded-full">
        <img
          className="rounded-full"
          width="55px"
          height="55px"
          src={profileIMG.src}
          alt="Profile"
        />
      </div>

      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <div className="lg:col-span-3">
            <p className="font-inter text-base font-normal leading-6 text-left text-steelGray">
              {title} | {posted}
            </p>
          </div>

          <div className="lg:col-span-1 flex justify-end items-center">
            <p className="foundation-gray-100 foundation-primary-700 rounded-full px-3 py-1 mx-2">
              {messageType}
            </p>
            <div
              className="flex items-center text-slateGray rounded-full px-3 py-1"
              onClick={openModal}
            >
              {typeof chatIcon === 'string'
                ? renderChatIcon(chatIcon)
                : chatIcon}
            </div>
          </div>
        </div>

        <div className="flex">
          <p className="font-inter text-base font-normal leading-6 text-left text-graphiteGray pt-2 text-xs">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
