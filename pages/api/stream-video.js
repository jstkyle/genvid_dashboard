// pages/api/stream-video.js
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { Readable } from "stream";

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
const region = "ap-northeast-1"; // Your AWS region
// Your S3 and bucket configuration
const s3Client = new S3Client({ region, credentials });
const bucketName = "clips-queue";
const folderPrefix = "videos/"; // Your folder prefix in the S3 bucket
export default async function handler(req, res) {
  const videoKey = req.query.video;

  if (!videoKey) {
    return res.status(400).json({ error: "Missing video key parameter" });
  }

  try {
    // Presuming you have a method to generate a signed URL
    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: folderPrefix + videoKey,
      })
    );

    res.status(200).json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
