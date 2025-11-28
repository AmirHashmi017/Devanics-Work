import AwsS3 from './S3Intergration';

const filesUrlGenerator = async (files: File[] = []) => {
  console.log(files, 'files in log...');
  const mediaFiles = [];
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const url = await new AwsS3(files[i], 'posts').getS3URL();
      const fileData = {
        url,
        extension: files[i].name.split('.').pop() || '',
        type: files[i].type as string,
        name: files[i].name,
      };
      mediaFiles.push(fileData);
    }
  }
  return { mediaFiles, mediaFilesLength: mediaFiles.length };
};

export default filesUrlGenerator;
