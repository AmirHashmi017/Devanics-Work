export const truncateFileName = (name, maxLength) => {
  if (!name) return "";

  const extension = name.endsWith(".pdf") ? ".pdf" : "";
  const baseName = name.slice(0, -extension.length);

  if (baseName.length > maxLength) {
    return baseName.slice(0, maxLength) + "..." + extension;
  }

  return baseName + extension;
};
