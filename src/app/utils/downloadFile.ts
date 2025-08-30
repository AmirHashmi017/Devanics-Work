import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadFile = (url: string, name: string) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
};

export function handleDownloadPdfFromRef(
  ref: React.MutableRefObject<HTMLDivElement | undefined | null>,
  filename: string,
  isScrollable = true,
  shouldSave = true
) {
  const container = ref.current!;
  if (isScrollable) {
    container.style.height = 'auto'; // Temporarily expand the container
  }

  html2canvas(container, { useCORS: true, scale: 1 }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png', 0.75);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let positionY = 0;
    const pageHeight = pdf.internal.pageSize.height;

    while (positionY < imgHeight) {
      pdf.addImage(
        imgData,
        'PNG',
        0,
        -positionY,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );
      positionY += pageHeight;
      if (positionY < imgHeight) {
        pdf.addPage();
      }
    }

    if (shouldSave) {
      pdf.save(`${filename}.pdf`);
    }

    if (isScrollable) {
      // Restore the original height
      container.style.height = ''; // Remove inline style to revert to original
    }
  });
}
export function handleDownloadPdfFromRefAsync(
  ref: React.MutableRefObject<HTMLDivElement | undefined | null>,
  filename: string,
  isScrollable = true,
  shouldSave = true,
  shouldOptimize = true
): Promise<jsPDF> {
  return new Promise((resolve, reject) => {
    const container = ref.current!;
    if (isScrollable) {
      container.style.height = 'auto'; // Temporarily expand the container
    }

    html2canvas(container, { useCORS: true, scale: 1 })
      .then((canvas) => {
        const imgData = canvas.toDataURL(
          'image/png',
          shouldOptimize ? 0.75 : 2
        );
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let positionY = 0;
        const pageHeight = pdf.internal.pageSize.height;

        while (positionY < imgHeight) {
          pdf.addImage(
            imgData,
            'PNG',
            0,
            -positionY,
            imgWidth,
            imgHeight,
            undefined,
            shouldOptimize ? 'FAST' : undefined
          );
          positionY += pageHeight;
          if (positionY < imgHeight) {
            pdf.addPage();
          }
        }
        if (shouldSave) {
          pdf.save(`${filename}.pdf`);
        }

        if (isScrollable) {
          // Restore the original height
          container.style.height = ''; // Remove inline style to revert to original
        }
        setTimeout(() => {
          resolve(pdf);
        }, 3000);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function asyncHandlePdfDownload(
  ref: React.MutableRefObject<HTMLDivElement | undefined | null>,
  filename: string,
  shouldSave = true,
  shouldOptimize = true
): Promise<jsPDF> {
  const container = ref.current!;
  const originalHeight = container.style.height;
  const originalOverflow = container.style.overflow;

  // Ensure full content is captured
  container.style.height = 'auto';
  container.style.overflow = 'visible';

  // Get the exact dimensions of the container
  const containerWidth = container.scrollWidth;
  const containerHeight = container.scrollHeight;

  return new Promise((resolve, reject) => {
    html2canvas(container, {
      useCORS: true,
      scale: shouldOptimize ? 1 : 2, // Higher scale for better quality
      logging: false,
      allowTaint: true,
      width: containerWidth,
      height: containerHeight,
      windowWidth: containerWidth,
      windowHeight: containerHeight,
    })
      .then((canvas) => {
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'px',
          format: [containerWidth, containerHeight],
        });

        const canvasHeight = canvas.height; // Actual canvas height
        const pageHeight = pdf.internal.pageSize.height; // PDF page height
        const totalPages = Math.ceil(canvasHeight / pageHeight); // Calculate how many pages we need based on canvas height

        for (let page = 0; page < totalPages; page++) {
          // Add a new page if it's not the first page
          // if (page > 0) {
          //   pdf.addPage([containerWidth, pageHeight]);
          // }

          // Calculate the portion of the image to draw on this page
          const sourceY = page * pageHeight; // Start at the current page's Y position
          const remainingHeight = canvasHeight - sourceY;

          // Calculate the height of the image portion to be drawn on this page
          const imageHeight =
            remainingHeight < pageHeight ? remainingHeight : pageHeight;

          // Draw the image for this portion
          pdf.addImage(
            canvas.toDataURL('image/png'),
            'PNG',
            0,
            -sourceY, // Negative to shift the image up
            containerWidth,
            imageHeight,
            undefined, // Default handling
            'FAST', // Faster image processing
            0 // No rotation
          );
        }

        if (shouldSave) {
          pdf.save(`${filename}.pdf`);
        }

        // Restore original styles
        container.style.height = originalHeight;
        container.style.overflow = originalOverflow;
        resolve(pdf);
      })
      .catch((error) => {
        // Restore original styles in case of error
        container.style.height = originalHeight;
        container.style.overflow = originalOverflow;
        reject(error);
      });
  });
}
