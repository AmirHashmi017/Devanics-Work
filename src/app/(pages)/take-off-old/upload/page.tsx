'use client';
import { useEffect, useLayoutEffect, useState } from 'react';
// import { bg_style } from '@/globals/tailwindvariables';
// import Image from 'next/image';
// import SenaryHeading from '@/app/component/headings/senaryHeading';
// import SecondaryHeading from '@/app/component/headings/Secondary';
// import Description from '@/app/component/description';
// import { UploadFileContext } from '../context';
// import {
//   UploadFileContextProps,
//   // UploadFileData,
// } from '../context/UploadFileContext';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import { LoadingOutlined } from '@ant-design/icons';
// import ModalComponent from '@/app/component/modal';
// import SelectPageModal from '../components/selectPageModal';
import InitialUpload from '../components/upload/InitialUpload';
import CreateInfo from '../components/upload/CreateInfo';
import { useSelector } from 'react-redux';
import { selectToken } from '@/redux/authSlices/auth.selector';
import { HttpService } from '@/app/services/base.service';
import { useSearchParams } from 'next/navigation';

const Upload = () => {
  // const router = useRouter();
  // const { handleSrc, uploadFileData } = useContext(UploadFileContext) as UploadFileContextProps;
  // const [loading, setloading] = useState<boolean>(false)
  const [step, setstep] = useState(0);
  // const [showSelectModal, setshowSelectModal] = useState<boolean>(false)
  // const breakLoopRef = useRef<boolean>(false);
  // const pdfjs = useCallback(async () => {
  //   const pdfjs = await import('pdfjs-dist');
  //   await import('pdfjs-dist/build/pdf.worker.min.mjs');

  //   return pdfjs;
  // }, []);

  // const handleFileChange = async (event: any) => {
  //   try {
  //     const file = event.target.files[0];
  //     console.log(file, " file full");
  //     breakLoopRef.current = false

  //     if (file) {
  //       setloading(true)
  //       handleSrc([])
  //       setshowSelectModal(true)
  //       const PDFJS = await pdfjs();
  //       const pdfPagesData: UploadFileData[] = [];
  //       const reader = new FileReader();
  //       reader.onload = async (event: any) => {
  //         const data = new Uint8Array(event.target.result);
  //         const pdf = await PDFJS.getDocument(data).promise;

  //         for (let index = 0; index < pdf.numPages; index++) {
  //           console.log(index, " ===> for loop indexing running");
  //           if (breakLoopRef.current) { // Check breakLoopRef instead of state
  //             console.log('Task interrupted! for loop indexing running');
  //             break;
  //           }

  //           const page = await pdf.getPage(index + 1);
  //           console.log(page, typeof (page), " ===> pages while uplaoding")
  //           const scale = 1;
  //           const viewport = page.getViewport({ scale });
  //           const canvas = document.createElement('canvas');
  //           const context = canvas.getContext('2d');
  //           canvas.width = viewport.width;
  //           canvas.height = viewport.height;
  //           const renderContext: any = {
  //             canvasContext: context,
  //             viewport: viewport,
  //           };
  //           await page.render(renderContext).promise;

  //           pdfPagesData.push({
  //             src: canvas.toDataURL('image/png') || '',
  //             height: viewport.height,
  //             width: viewport.width,
  //           });
  //           if (!breakLoopRef.current) {
  //             handleSrc({
  //               src: canvas.toDataURL('image/png') || '',
  //               height: viewport.height,
  //               width: viewport.width,
  //             }, true);
  //           }
  //         }
  //         setloading(false)
  //       };
  //       reader.readAsArrayBuffer(file);
  //     }
  //   } catch (error) {
  //     console.log(error, " ===> Error while reading file")
  //     setloading(false)
  //     toast.error('Error while reading file')
  //   }
  // };
  const token = useSelector(selectToken);
  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  const params = useSearchParams();
  const edit_id = params.get('edit_id');
  useEffect(() => {
    if (edit_id && edit_id?.length > 0) {
      setstep(1);
    } else {
      setstep(0);
    }
  }, [edit_id]);

  return (
    <>
      <section className="md:px-16 px-8 pb-4">
        {step == 0 ? (
          <InitialUpload setstep={setstep} />
        ) : step == 1 ? (
          <CreateInfo />
        ) : (
          <></>
        )}
        {/* <div className="flex gap-4 items-center mt-6">
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
              {loading ? <span className='flex gap-x-2' ><LoadingOutlined /> {"Processing"}</span> : 'Select File'}
            </label>
          </div>
        </div>
        <ModalComponent open={showSelectModal} setOpen={() => { }}>
          <SelectPageModal
            numOfPages={uploadFileData.length}
            setModalOpen={setshowSelectModal}
            uploadFileData={uploadFileData}
            handleSrc={handleSrc}
            router={router}
            loadingPre={loading}
            handleReselect={() => {
              breakLoopRef.current = true;
              setloading(false)
            }}
          />
        </ModalComponent> */}
      </section>
    </>
  );
};

export default Upload;
