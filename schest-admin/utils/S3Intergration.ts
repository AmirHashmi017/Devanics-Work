import aws, { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
class AwsS3 {
  s3;
  fileUpload;
  buffer;
  path;
  constructor(fileUpload: any, path: string = '', buffer: any = false) {
    const config = {
      region: process.env.REACT_APP_PUBLIC_REGION,
      accessKeyId: process.env.REACT_APP_ACC_KEY,
      secretAccessKey: process.env.REACT_APP_SECRET,
      signatureVersion: process.env.REACT_APP_BUCKET_SIGNATURE_VERSION,
    };

    this.fileUpload = fileUpload;
    this.s3 = new aws.S3(config);
    this.buffer = buffer;
    this.path = path;
  }
  getS3URL = async () => {
    const imageName = uuidv4();
    const params: S3.PutObjectRequest = {
      Body: this.fileUpload,
      Bucket: process.env.REACT_APP_BUCKET!,
      Key: `${new Date().getFullYear()}/${this.path}${imageName}-${
        this.fileUpload.name
      }`,
      ContentType: this.fileUpload.type,
      ACL: 'public-read',
    };
    const uploadResult: any = await this.s3.upload(params).promise();
    return uploadResult.Location;
  };

  getS3URLWithProgress = async (
    listener: (_progress: S3.ManagedUpload.Progress) => void
  ) => {
    const imageName = uuidv4();
    const params: S3.PutObjectRequest = {
      Body: this.fileUpload,
      Bucket: process.env.REACT_APP_BUCKET!,
      Key: `${new Date().getFullYear()}/${this.path}${imageName}-${
        this.fileUpload.name
      }`,
      ContentType: this.fileUpload.type,
      ACL: 'public-read',
    };
    const managedUpload = this.s3.upload(params);
    managedUpload.on('httpUploadProgress', listener);

    const uploadResult: any = await managedUpload.promise();
    return uploadResult.Location;
  };
}
export default AwsS3;
