import api from "./axios";

export const apiRequestFn = async ({ method = "get", url, data, ...rest }) => {
  const apiResponse = await api({
    method,
    url,
    data,
    ...rest,
  });
  return apiResponse.data;
};


export function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

// donwload pdf report

export const downloadFileFromUrl = async (url, fileName) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    const blob = await response.blob();

    // Create blob link to download
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', fileName);

    // Append to the page and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.remove();
    window.URL.revokeObjectURL(blobUrl); // Free up memory
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};
