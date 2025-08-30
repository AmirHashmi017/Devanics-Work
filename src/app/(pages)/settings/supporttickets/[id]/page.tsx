'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';

// module imports
import Description from '@/app/component/description';
import QuinaryHeading from '@/app/component/headings/quinary';
import { senaryHeading } from '@/globals/tailwindvariables';
import CustomButton from '@/app/component/customButton/button';
import { supportTicketService } from '@/app/services/supportTicket.service';
import { selectSupportTickets } from '@/redux/supportTickets/supportTicketSelector';
import {
  ISupportTicket,
  ITicketMessage,
} from '@/app/interfaces/supportTicket.interface';
import moment from 'moment';
import SettingSidebar from '../../verticleBar';
import { byteConverter } from '@/app/utils/byteConverter';
import { toast } from 'react-toastify';
import AwsS3 from '@/app/utils/S3Intergration';
import { withAuth } from '@/app/hoc/withAuth';
import { FileView } from '@/app/component/file-view/FileView';

const SupportTicketDetails = () => {
  const params = useParams();
  const divRef: any = useRef(null);
  const { id }: any = params;

  const supportTicketData = useSelector(selectSupportTickets);

  // const [isLoading, setIsLoading] = useState(true);
  const [supportDetailDetail, setSupportDetailDetail] = useState<
    Partial<ISupportTicket>
  >({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ITicketMessage[]>([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchedSupportTicketsMessagesHandler = useCallback(async () => {
    let result = await supportTicketService.httpGetMessages(id);
    setMessages(result.data.messages);
  }, []);

  useEffect(() => {
    fetchedSupportTicketsMessagesHandler();
  }, []);

  useEffect(() => {
    divRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }, []);

  useEffect(() => {
    const selectedSupportTicket = supportTicketData.find(
      (ticket: ISupportTicket) => ticket._id === id
    );
    setSupportDetailDetail(selectedSupportTicket);
  }, [supportTicketData]);

  const submitHandler = async (e: any) => {
    setMessageLoading(true);

    e.preventDefault();

    let result = await supportTicketService.httpCreateMessage({
      ticketId: id,
      sender: 'user',
      message: message,
    });
    setMessage('');
    setMessageLoading(false);
    if (result.data && result.data.newMessage) {
      setMessages([...messages, result.data.newMessage]);
    }
  };

  const fileUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const files = e.target.files;

    if (files && files.length && byteConverter(files[0].size, 'MB').size > 5) {
      toast.warning('Cannot upload image more then 5 mb of size');
      setUploading(false);
      return;
    }

    try {
      const file = files![0];
      const url = await new AwsS3(file, 'documents/supporttickets/').getS3URL();
      let result = await supportTicketService.httpCreateMessage({
        ticketId: id,
        sender: 'user',
        fileExtension: file.type,
        isFile: true,
        fileUrl: url,
        fileName: file.name,
        fileSize: file.size,
      });
      setMessage('');
      setMessageLoading(false);
      if (result.data && result.data.newMessage) {
        setMessages([...messages, result.data.newMessage]);
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
    } finally {
      setUploading(false);
    }
  };
  return (
    <SettingSidebar>
      <section className="w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-1 items-center ">
            <Image src="/home.svg" alt="home icon" width={20} height={20} />
            <Image
              src="/chevron-right.svg"
              alt="chevron-right icon"
              width={16}
              height={16}
            />
            <p className={`${senaryHeading} font-base text-slateGray`}>
              Support Tickets
            </p>
            <Image
              src="/chevron-right.svg"
              alt="chevron-right icon"
              width={16}
              height={16}
            />

            <Description
              title="Ticket details"
              className={`${senaryHeading} font-semibold text-schestiPrimary cursor-pointer underline`}
            />
          </div>
          <p className="bg-lightblue rounded-xl px-2">
            <span className="text-xs text-darkblue font-normal p-1 capitalize">
              {supportDetailDetail.status}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-1  gap-y-6 sm:gap-x-6 sm:grid-cols-2 md:grid-cols-3 mt-6">
          <div className="shadow-primaryGlow bg-white rounded-2xl p-5">
            <p className="text-xs text-slateGray font-normal">
              Orignal Request
            </p>
            <div className="flex flex-col gap-4 mt-2">
              <Description
                title={`Ticket # ${supportDetailDetail._id}`}
                className="text-steelGray font-semibold"
              />
              <QuinaryHeading
                title={`${supportDetailDetail.title}`}
                className="text-base font-medium"
              />
              <p className="text-xs items-center text-slateGray font-normal flex gap-1">
                <Image src="/calendar.svg" alt="date" width={12} height={12} />
                Date: {moment(supportDetailDetail.createdAt).format('ll')}
              </p>
              <Description
                className="text-steelGray"
                title={`${supportDetailDetail?.description}`}
              />
              {supportDetailDetail?.file && (
                <FileView
                  extension={supportDetailDetail.file.fileType.split('/')[1]}
                  name={supportDetailDetail.file.name}
                  url={supportDetailDetail.file.url}
                  text="View"
                />
              )}
            </div>
          </div>
          <div className="shadow-primaryGlow  bg-white rounded-2xl p-5 md:col-span-2">
            <div className="h-auto">
              <div className="h-[66vh] overflow-y-auto scroll-smooth">
                <div className="flex flex-col gap-y-5" ref={divRef}>
                  {messages.map((message) => {
                    if (message.sender == 'user') {
                      return message.isFile ? (
                        <div key={message._id} className="self-end">
                          <FileView
                            extension={message.fileExtension.split('/')[1]}
                            name={message.fileName}
                            url={message.fileUrl}
                            text="View"
                          />
                        </div>
                      ) : (
                        <p
                          key={message._id}
                          className="bg-slate-100 text-[#5A7184] text-[16px] leading-5 rounded-l-lg px-4 py-3 mr-8 self-end"
                        >
                          {message.message}
                        </p>
                      );
                    } else {
                      return message.isFile ? (
                        <div key={message._id} className="self-start mb-1">
                          <FileView
                            extension={message.fileExtension.split('/')[1]}
                            name={message.fileName}
                            url={message.fileUrl}
                            text="View"
                          />
                        </div>
                      ) : (
                        <p
                          key={message._id}
                          className="bg-sky-100 text-[#5A7184] text-[16px] leading-5 rounded-r-lg px-4 py-3 max-w-max"
                        >
                          {message.message}
                        </p>
                      );
                    }
                  })}
                </div>
              </div>
              <form onSubmit={submitHandler}>
                <div className="relative w-full">
                  <input
                    type="text"
                    className="border border-Gainsboro w-full p-4 font-poppin text-sm"
                    placeholder="Please answer..."
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={supportDetailDetail.status !== 'open'}
                  />
                  <div className="flex gap-3 items-center absolute top-2 right-3">
                    {uploading ? (
                      'Uploading...'
                    ) : (
                      <label htmlFor="file" className="cursor-pointer">
                        <Image
                          width={24}
                          height={24}
                          src="/select-file.svg"
                          alt="select file"
                        />
                      </label>
                    )}
                    <input
                      id="file"
                      type="file"
                      className="hidden"
                      accept="image/*, application/pdf"
                      onChange={(e) => fileUploadHandler(e)}
                      disabled={supportDetailDetail.status !== 'open'}
                    />
                    <div className="w-0.5 h-7 bg-darkGray" />
                    <span>
                      <CustomButton
                        isLoading={messageLoading}
                        type="submit"
                        text="Reply"
                        disabled={
                          message.length === 0 ||
                          supportDetailDetail.status !== 'open'
                        }
                        className="!bg-[#EF9F28] !py-2.5 !px-6 !border-none"
                      />
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </SettingSidebar>
  );
};

export default withAuth(SupportTicketDetails);
