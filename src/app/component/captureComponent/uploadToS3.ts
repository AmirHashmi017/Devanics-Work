import { UploadFileData } from '@/app/(pages)/takeoff/context/UploadFileContext';
import AwsS3 from '@/app/utils/S3Intergration';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const uploadToS3 = async (
  divId: string,
  pagesData?: UploadFileData[] | any
) => {
  const input = document.getElementById(divId);
  if (!input) {
    console.error('Element not found');
    return;
  }

  const children = Array.from(input.children);
  if (children.length === 0) {
    console.error('No child divs to convert');
    return;
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const margin = 15; // Margin on all sides
  const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
  let position = margin;
  const heightScaleFactor = 0.9; // Scale factor to reduce image height, making images shorter

  for (const child of children) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      await html2canvas(child as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const originalImgHeight = (canvas.height * pageWidth) / canvas.width;
        const imgHeight = originalImgHeight * heightScaleFactor;
        const imgWidth = pageWidth;

        // Check if the current image fits on the current page, otherwise add a new page
        if (position + imgHeight > pdf.internal.pageSize.getHeight() - 5) {
          pdf.addPage();
          position = margin; // Reset position for the new page
        }

        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        position += imgHeight + 5; // Update position for the next image, adding a margin between images
      });
    }
  }

  try {
    console.log(pagesData, ' ===> pagesData');
    var arrayData: any = [];
    if (pagesData && pagesData?.length > 0) {
      arrayData = await Promise.all(
        pagesData?.map(async (i: any, index: number) => {
          const uploadUrl = await new AwsS3(
            i?.src,
            'documents/takeoff-reports/'
          ).uploadS3URL(); //upload base64 to S3
          return {
            width: i?.width,
            height: i?.height,
            src: uploadUrl,
            pagenum: index + 1,
          };
        })
      );
    }
    console.log(arrayData, ' ===> Pages Data Result');
    // Convert the jsPDF document to a Blob
    const pdfBlob = pdf.output('blob');
    const url = await new AwsS3(
      pdfBlob,
      'documents/takeoff-reports/'
    ).getS3URL();
    return { url, pages: arrayData };
  } catch (error) {
    console.error('Error uploading documents:', error);
  }
};

export default uploadToS3;
