'use client';
import Button from '@/app/component/customButton/button';
// import Table from '@/app/component/table/takeoff';
// import Pagination from '../../../../component/pagination';
// import { takeoffRecords, takeoffRecordsHeadings } from '../../data';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { bg_style } from '@/globals/tailwindvariables';
// import { useContext } from 'react';
// import UploadFileContext, { UploadFileContextProps } from '../../context/UploadFileContext';
// import { DrawHistoryContext, EditContext } from '../../context';
import { useRouter } from 'next/navigation';

const Records = () => {
  // const { handleSrc } = useContext(UploadFileContext) as UploadFileContextProps;
  // const { setInitialEditDrawHistory } = useContext(DrawHistoryContext)
  // const { handleEdit } = useContext(EditContext)
  const router = useRouter();
  // const pdfjs = useCallback(async () => {
  //   const pdfjs = await import('pdfjs-dist');
  //   await import('pdfjs-dist/build/pdf.worker.min.mjs');

  //   return pdfjs;
  // }, []);

  // const handleEditClick = async (item: any) => {
  //   try {
  //     if (Array.isArray(item?.pages) && item?.pages?.length > 0) {
  //       const PDFJS = await pdfjs();
  //       const pdfPagesData: UploadFileData[] = [];

  //       await Promise.all(
  //         item?.pages?.map(async (element: any) => {
  //           // Fetch file data from S3 using the URL
  //           const response = await fetch(element?.src);
  //           const fileData = await response.arrayBuffer();
  //           // Process the fetched file data
  //           // For a single-page document, you can skip the loop and process only the first page
  //           const pdf = await PDFJS.getDocument(fileData).promise;
  //           const page = await pdf.getPage(1);
  //           const viewport = page.getViewport({ scale: 1 });
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
  //         })
  //       )

  //       handleSrc(pdfPagesData);
  //       router.push(`/takeoff/scale?edit_id=${item?._id}`);

  //     }
  //   } catch (error) {
  //     console.log(error, " Error while editing process");
  //   }
  // }

  // const handleEditClick = async (item: any) => {
  //   try {
  //     if (Array.isArray(item?.pages) && item?.pages?.length > 0) {
  //       // const imagesData: UploadFileData[] = [];

  //       // await Promise.all(
  //       //   item?.pages?.map(async (element: any, index: number) => {
  //       //     // Fetch file data from S3 using the URL
  //       //     const response = await fetch(element?.src);
  //       //     const blob = await response.blob();
  //       //     const url = URL.createObjectURL(blob);

  //       //     // Load the image onto a canvas
  //       //     const img = new Image();
  //       //     img.src = url;
  //       //     img.onload = () => {
  //       //       const canvas = document.createElement('canvas');
  //       //       canvas.width = img.width;
  //       //       canvas.height = img.height;
  //       //       const context = canvas.getContext('2d');
  //       //       if (context) {
  //       //         context.drawImage(img, 0, 0);
  //       //         imagesData.push({
  //       //           src: canvas.toDataURL('image/png') || '',
  //       //           height: canvas.height,
  //       //           width: canvas.width,
  //       //           pageNum: element?.pagenum
  //       //         });
  //       //         console.log(imagesData, " ===> imagesData");
  //       //       }
  //       //     };
  //       //   })
  //       // );
  //       const promises = item?.pages?.map(async (element: any) => {
  //         // Fetch file data from S3 using the URL
  //         const response = await fetch(element?.src);
  //         const blob = await response.blob();
  //         const url = URL.createObjectURL(blob);

  //         // Load the image onto a canvas
  //         return new Promise((resolve, reject) => {
  //           const img = new Image();
  //           img.src = url;
  //           img.onload = () => {
  //             const canvas = document.createElement('canvas');
  //             canvas.width = img.width;
  //             canvas.height = img.height;
  //             const context = canvas.getContext('2d');
  //             if (context) {
  //               context.drawImage(img, 0, 0);
  //               const imageData = {
  //                 src: canvas.toDataURL('image/png') || '',
  //                 height: canvas.height,
  //                 width: canvas.width,
  //                 pageNum: element?.pagenum
  //               };
  //               resolve(imageData);
  //             } else {
  //               reject(new Error('Failed to get canvas context'));
  //             }
  //           };
  //           img.onerror = (error) => reject(error);
  //         });
  //       });

  //       const imagesData: UploadFileData[] = await Promise.all(promises);

  //       handleSrc(imagesData);//?.sort((a: any, b: any) => a.pageNum - b.pageNum)
  //       if (item?.measurements && Object.keys(item?.measurements)?.length > 0) setInitialEditDrawHistory(item?.measurements)
  //       handleEdit(item)
  //       router.push(`/takeoff/scale?edit_id=${item?._id}`);
  //     }
  //   } catch (error) {
  //     console.log(error, " Error while editing process");
  //   }
  // }

  return (
    <div className={`${bg_style} p-5`}>
      <div className="flex justify-between items-center mb-3">
        <TertiaryHeading title="Recent Measurements" />
        <Button
          text="Start Measurements"
          className="!w-auto"
          icon="plus.svg"
          iconwidth={20}
          iconheight={20}
          onClick={() => router.push('/takeoff/upload')}
        />
      </div>
      {/* <Table handleEditClick={handleEditClick} /> */}
      {/* <Pagination /> */}
    </div>
  );
};

export default Records;
