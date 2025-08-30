'use client';
import { useCallback, useContext, useRef, useState } from 'react';
import { bg_style } from '@/globals/tailwindvariables';
import Image from 'next/image';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import SecondaryHeading from '@/app/component/headings/Secondary';
import Description from '@/app/component/description';
// import ModalComponent from '@/app/component/modal';
// import ScaleModal from '../components/scale';
import { UploadFileContext } from '../context';
import {
  UploadFileContextProps,
  UploadFileData,
} from '../context/UploadFileContext';
// import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { LoadingOutlined } from '@ant-design/icons';
import ModalComponent from '@/app/component/modal';
import SelectPageModal from '../components/selectPageModal';
import { useRouterHook } from '@/app/hooks/useRouterHook';

const Upload = () => {
  // const [selectedIcon, setSelectedIcon] = useState('');
  // const [showModal, setShowModal] = useState(false);
  const router = useRouterHook();

  // const handleClick = (item: string) => {
  //   setSelectedIcon(item);
  //   setShowModal(true);
  // };

  const { handleSrc, uploadFileData } = useContext(
    UploadFileContext
  ) as UploadFileContextProps;
  const [loading, setloading] = useState<boolean>(false);
  const [showSelectModal, setshowSelectModal] = useState<boolean>(false);
  const breakLoopRef = useRef<boolean>(false); // Mutable ref for breaking the loop
  const pdfjs = useCallback(async () => {
    const pdfjs = await import('pdfjs-dist');
    await import('pdfjs-dist/build/pdf.worker.min.mjs');

    return pdfjs;
  }, []);

  const handleFileChange = async (event: any) => {
    try {
      const file = event.target.files[0];
      console.log(file, ' file full');
      breakLoopRef.current = false;

      if (file) {
        setloading(true);
        handleSrc([]);
        setshowSelectModal(true);
        const PDFJS = await pdfjs();
        const pdfPagesData: UploadFileData[] = [];
        const reader = new FileReader();
        reader.onload = async (event: any) => {
          const data = new Uint8Array(event.target.result);
          const pdf = await PDFJS.getDocument(data).promise;

          for (let index = 0; index < pdf.numPages; index++) {
            console.log(index, ' ===> for loop indexing running');
            if (breakLoopRef.current) {
              // Check breakLoopRef instead of state
              console.log('Task interrupted! for loop indexing running');
              break;
            }

            const page = await pdf.getPage(index + 1);
            console.log(page, typeof page, ' ===> pages while uplaoding');
            const scale = 1;
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const renderContext: any = {
              canvasContext: context,
              viewport: viewport,
            };
            await page.render(renderContext).promise;

            pdfPagesData.push({
              src: canvas.toDataURL('image/png') || '',
              height: viewport.height,
              width: viewport.width,
            });
            if (!breakLoopRef.current) {
              // Check breakLoopRef instead of state
              handleSrc(
                {
                  src: canvas.toDataURL('image/png') || '',
                  height: viewport.height,
                  width: viewport.width,
                },
                true
              );
            }
          }

          // handleSrc(pdfPagesData);
          // router.push('/takeoff/scale');
          setloading(false);
          // setshowSelectModal(true)
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.log(error, ' ===> Error while reading file');
      setloading(false);
      toast.error('Error while reading file');
    }
  };

  return (
    <>
      <section className="md:px-16 px-8 pb-4">
        <div className="flex gap-4 items-center mt-6">
          <Image src={'/home.svg'} alt="home icon" width={20} height={20} />
          <Image
            src={'/chevron-right.svg'}
            alt="chevron-right icon"
            width={16}
            height={16}
          />
          <SenaryHeading title="Takeoff" className="font-base text-slateGray" />
          <Image
            src={'/chevron-right.svg'}
            alt="chevron-right icon"
            width={16}
            height={16}
          />

          <SenaryHeading
            title="File Upload"
            className="font-semibold text-lavenderPurple cursor-pointer underline"
          />
        </div>

        {/* search project */}
        {/* <div className="bg-white flex justify-between items-center mt-6 ">
          <div
            className="rounded-lg border border-Gainsboro bg-silverGray  h-[51px] 
                        flex 
                        items-center
                            px-3"
          >
            <input
              type="search"
              name=""
              id=""
              placeholder="Enter project name"
              className="w-full h-full
          bg-transparent outline-none"
            />
          </div>
          <div className="flex flex-row gap-3">
            <div>
              <WhiteButton
                text="Generate with AI"
                className="!text-goldenrodYellow !border-goldenrodYellow"

                //   onClick={() => router.push('/createclient')}
              />
            </div>
            <div>
              <Button
                text="Generate Report"
                iconwidth={20}
                iconheight={20}
                //   onClick={() => router.push('/createclient')}
              />
            </div>
          </div>
        </div> */}

        {/* <div
          className={`h-12 w-full mt-6 flex flex-row items-center justify-center gap-8  py-[5.5px] ${bg_style}`}
        >
          <div
            className="flex flex-col items-center"
            onClick={() => handleClick('scale')}
          >
            <Image
              style={{ color: 'red' }}
              src={'/scale.svg'}
              alt="createicon"
              width={19.97}
              height={11.31}
            />
            <label
              className={`text-xs ${
                selectedIcon === 'scale' ? 'text-[#6F6AF8]' : 'text-[#767676]'
              } `}
            >
              Scale
            </label>
          </div>
        </div> */}
        <div
          className={`grid place-items-center shadow-sceneryShadow rounded-lg mt-4 ${bg_style} h-[700px] `}
        >
          <div className="md:min-w-[493px] flex items-center flex-col gap-2 justify-center shadow-sceneryShadow rounded-lg">
            <Image
              src={'/uploadcloud.svg'}
              alt="upload icon"
              width={80}
              height={80}
            />
            <SecondaryHeading
              title="Drag and Drop here"
              className="cursor-pointer text-graphiteGray"
            />
            <Description title="or" className="cursor-pointer text-coolGray" />
            <label
              htmlFor="fileInput"
              className="w-full mt-2 cursor-pointer flex p-4 rounded-md items-center justify-center border border-solid border-gray-300"
            >
              <input
                type="file"
                id="fileInput"
                name="fileInput"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={loading}
              />
              {loading ? (
                <span className="flex gap-x-2">
                  <LoadingOutlined /> {'Processing'}
                </span>
              ) : (
                'Select File'
              )}
            </label>
          </div>
        </div>
        {/* <ModalComponent open={showModal} setOpen={setShowModal}>
          <ScaleModal
            setModalOpen={setShowModal}
            scaleData={function (data: any): void {
              console.log(data);
              throw new Error('Function not implemented.');
            }}
          />
        </ModalComponent> */}
        <ModalComponent open={showSelectModal} setOpen={() => {}}>
          <SelectPageModal
            numOfPages={uploadFileData.length}
            setModalOpen={setshowSelectModal}
            uploadFileData={uploadFileData}
            handleSrc={handleSrc}
            router={router}
            loadingPre={loading}
            handleReselect={() => {
              breakLoopRef.current = true;
              setloading(false);
            }}
          />
        </ModalComponent>
      </section>
    </>
  );
};

export default Upload;
