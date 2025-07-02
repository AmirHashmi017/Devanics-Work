export function formatBytes(bytes) {
  const MB = 1024 * 1024; // 1 MB in bytes
  const KB = 1024; // 1 KB in bytes

  if (bytes >= MB) {
    return `${(bytes / MB).toFixed(2)} MB`;
  } else {
    return `${(bytes / KB).toFixed(2)} KB`;
  }
}
