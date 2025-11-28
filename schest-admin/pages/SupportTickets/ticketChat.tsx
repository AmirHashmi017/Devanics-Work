import moment from 'moment';
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomButton from 'src/components/CustomButton/button';
import QuinaryHeading from 'src/components/Headings/Quinary';
import { senaryHeading } from 'src/components/TailwindVariables';
import Description from 'src/components/discription';
import MinDescription from 'src/components/discription/minDesc';
import { FileView } from 'src/components/file-view/FileView';
import { ISupportTicket } from 'src/interfaces/supportTicketInterfaces/supportTicket.interface';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';
import { supportTicketsService } from 'src/services/supportTicket.service';
import AwsS3 from 'src/utils/S3Intergration';
import { byteConverter } from 'src/utils/byteConverter';

const TicketChat = () => {
  let { supportTicketId } = useParams();
  const navigate = useNavigate();
  const divRef: any = useRef(null);

  const token = useSelector(selectToken);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  useEffect(() => {
    divRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  });

  const [isLoading, setIsLoading] = useState(true);
  const [supportDetailDetail, setSupportDetailDetail] = useState<
    Partial<ISupportTicket>
  >({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any>([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchedSupportTicketsHandler = useCallback(async () => {
    let result =
      await supportTicketsService.getAdminSupportTicketsDetailById(
        supportTicketId
      );
    setIsLoading(false);
    setSupportDetailDetail(result?.data?.supportTicketDetail);
  }, []);

  const fetchedSupportTicketsMessagesHandler = useCallback(async () => {
    let result = await supportTicketsService.httpGetMessages(supportTicketId);
    setMessages(result.data.messages);
  }, []);

  useEffect(() => {
    fetchedSupportTicketsHandler();
    fetchedSupportTicketsMessagesHandler();
  }, []);

  const submitHandler = async (e: FormEvent) => {
    setMessageLoading(true);

    e.preventDefault();

    let result = await supportTicketsService.httpCreateMessage({
      ticketId: supportTicketId,
      sender: 'admin',
      message: message,
    });
    setMessage('');
    setMessageLoading(false);
    setMessages([...messages, ...[result.data.newMessage]]);
  };

  const ticketClosedHandler = async () => {
    let result = await supportTicketsService.httpChangeStatus(supportTicketId);
    if (result.statusCode == 200) {
      navigate('/supportickets');
    } else {
      toast.error(result.message);
    }
  };

  console.log(messages, 'supportDetailDetail');
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
      let result = await supportTicketsService.httpCreateMessage({
        ticketId: supportTicketId,
        sender: 'admin',
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
    <section className="px-16 mt-6 pb-2">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-1 items-center ">
          <img
            src="/assets/icons/home.svg"
            alt="home icon"
            width={20}
            height={20}
          />
          <img
            src="/assets/icons/chevron-right.svg"
            alt="chevron-right icon"
            width={16}
            height={16}
          />
          <p className={`${senaryHeading} font-base text-slateGray`}>
            Support Tickets
          </p>
          <img
            src="/assets/icons/chevron-right.svg"
            alt="chevron-right icon"
            width={16}
            height={16}
          />

          <MinDescription
            title="Ticket details"
            className={`${senaryHeading} font-semibold text-schestiPrimary cursor-pointer underline`}
          />
        </div>
        <CustomButton
          onClick={ticketClosedHandler}
          type="button"
          text="Closed"
          className="!bg-red-600 !w-24 !border-none"
        />
      </div>
      <div className="grid grid-cols-1 gap-y-6 sm:gap-x-6 sm:grid-cols-2 md:grid-cols-3 mt-6">
        <div className="shadow-primaryGlow rounded-2xl p-5">
          <p className="text-xs text-slateGray font-normal">Orignal Request</p>
          <div className="flex flex-col gap-4 mt-2">
            <Description
              title={`Ticket # ${supportDetailDetail?._id}`}
              className="text-steelGray font-semibold"
            />
            <QuinaryHeading
              title={`${supportDetailDetail?.title}`}
              className="text-base font-medium"
            />
            <p className="text-xs text-slateGray font-normal flex gap-1">
              <img
                src="/assets/icons/calendar.svg"
                alt="date"
                width={12}
                height={12}
              />
              Date: {moment(supportDetailDetail.createdAt).format('ll')}
            </p>
            <Description
              className="text-steelGray"
              title={`${supportDetailDetail?.description}`}
            />
            {/* {supportDetailDetail?.avatar && (
              <img
                width="100%"
                height="auto"
                src={supportDetailDetail?.avatar}
                alt="supportticketavatar"
              />
            )} */}
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
        <div className="shadow-primaryGlow rounded-2xl p-5 md:col-span-2">
          <div className="h-auto">
            <div className="h-[66vh] overflow-y-auto scroll-smooth">
              <div className="flex flex-col gap-y-5" ref={divRef}>
                {messages?.map((message: any) => {
                  if (message.sender == 'admin') {
                    return message.isFile ? (
                      <div key={message._id} className="self-end mb-1">
                        <FileView
                          extension={message.fileExtension.split('/')[1]}
                          name={message.fileName}
                          url={message.fileUrl}
                          text="View"
                        />
                      </div>
                    ) : (
                      <>
                        <p
                          key={message._id}
                          className="bg-slate-100 text-[#5A7184] text-[16px] leading-5 rounded-l-lg px-4 py-3 mr-8 self-end"
                        >
                          {message.message}
                        </p>
                        <p className="text-[#5A7184] text-[12px] -mt-4 mr-8 self-end">
                          {moment(message.createdAt)
                            .startOf('minute')
                            .fromNow()}
                        </p>
                      </>
                    );
                  } else {
                    if (message.sender == 'user') {
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
                    } else {
                      return (
                        <p
                          key={message._id}
                          className="bg-sky-100 text-[#5A7184] text-[16px] leading-5 rounded-r-lg px-4 py-3 max-w-max"
                        >
                          {message.message}
                        </p>
                      );
                    }
                    // return (
                    //   <>
                    //     <p
                    //       key={message._id}
                    //       className="bg-sky-100 text-[#5A7184] text-[16px] leading-5 rounded-r-lg px-4 py-3 max-w-max"
                    //     >
                    //       {message.message}
                    //     </p>
                    //     <p className="text-[12px] -mt-4">
                    //       {moment(message.createdAt)
                    //         .startOf('minute')
                    //         .fromNow()}
                    //     </p>
                    //   </>
                    // );
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
                />
                <div className="flex gap-3 items-center absolute top-2 right-3">
                  {uploading ? (
                    'Uploading...'
                  ) : (
                    <label htmlFor="file" className="cursor-pointer">
                      <img
                        width={24}
                        height={24}
                        src="/assets/icons/select-file.svg"
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
                  />
                  <div className="w-0.5 h-7 bg-darkGray" />
                  <span>
                    <CustomButton
                      isLoading={messageLoading}
                      type="submit"
                      text="Reply"
                      disabled={message.length === 0}
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
  );
};

export default TicketChat;
