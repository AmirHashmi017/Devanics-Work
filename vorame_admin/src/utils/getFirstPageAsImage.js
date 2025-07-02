import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Helper function to get the first page of a PDF as an image
export const getFirstPageAsImage = async (pdfUrl) => {
  try {
    // Set the worker path
    GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.js`;

    const loadingTask = getDocument(pdfUrl);
    const pdf = await loadingTask.promise;

    const page = await pdf.getPage(1);

    // Set up canvas to render the page
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    // Render the page
    await page.render(renderContext).promise;

    const imageUrl = canvas.toDataURL();

    return imageUrl;
  } catch (error) {
    console.error("Error loading PDF:", error);
    return null;
  }
};





const PDFJS = require("pdfjs-dist/webpack");

const readFileData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
};

//param: file -> the input file (e.g. event.target.files[0])
//return: images -> an array of images encoded in base64 
export const getPdfFirstPageImage = async (file) => {
  let pdfBase64Image = null;
  const data = await readFileData(file);
  const pdf = await PDFJS.getDocument(data).promise;
  const canvas = document.createElement("canvas");
  for (let i = 0; i < 1; i++) {
    const page = await pdf.getPage(i + 1);
    const viewport = page.getViewport({ scale: 1 });
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    pdfBase64Image = canvas.toDataURL();
  }
  canvas.remove();
  return pdfBase64Image;
}