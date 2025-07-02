import aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

class AwsS3 {
  constructor(fileUpload, path = "", buffer = false) {
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
    const params = {
      Body: this.fileUpload,
      Bucket: process.env.REACT_APP_BUCKET,
      Key: `${new Date().getFullYear()}/${this.path}${imageName}-${
        this.fileUpload.name
      }`,
      ContentType: this.fileUpload.type,
      // ACL: 'public-read',
    };

    const uploadResult = await this.s3.upload(params).promise();
    return uploadResult.Location;
  };

  uploadS3URL = async () => {
    try {
      const imageName = uuidv4();
      const base64Data = this.fileUpload.replace(
        /^data:image\/\w+;base64,/,
        "",
      );
      const params = {
        Body: Buffer.from(base64Data, "base64"),
        Bucket: process.env.REACT_APP_BUCKET,
        Key: `${new Date().getFullYear()}/${this.path}${imageName}-${
          this.fileUpload.name
        }`,
        ACL: "public-read",
        ContentType: "image/png", // Adjust the content type as per your file type
      };
      const uploadResult = await this.s3.upload(params).promise();
      return uploadResult.Location;
    } catch (error) {
      console.error("Error in uploadS3URL:", error);
    }
  };

  getS3URLWithProgress = async (listener) => {
    const imageName = uuidv4();
    const params = {
      Body: this.fileUpload,
      Bucket: process.env.REACT_APP_BUCKET,
      Key: `${new Date().getFullYear()}/${this.path}${imageName}-${
        this.fileUpload.name
      }`,
      ContentType: this.fileUpload.type,
      // ACL: 'public-read',
    };
    const managedUpload = this.s3.upload(params);
    managedUpload.on("httpUploadProgress", listener);

    const uploadResult = await managedUpload.promise();
    return uploadResult.Location;
  };

  getS3UrlFromBase64 = async (base64Data, contentType = "image/png") => {
    const buffer = Buffer.from(
      base64Data.replace(/^data:image\/\w+;base64,/, ""),
      "base64",
    );
    const params = {
      Body: buffer,
      Bucket: process.env.REACT_APP_BUCKET,
      Key: `${new Date().getFullYear()}/${this.path}${Date.now()}`,
      ACL: "public-read",
      ContentType: contentType,
      ContentEncoding: "base64",
    };
    const uploadResult = await this.s3.upload(params).promise();
    return uploadResult.Location;
  };

  base64ToBlob = (base64, contentType = "image/jpeg") => {
    const [_, data] = base64.split(",");
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };
}

export default AwsS3;
