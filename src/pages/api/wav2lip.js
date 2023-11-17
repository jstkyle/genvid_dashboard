// pages/api/getVideo.js
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import fetch from "node-fetch";
import Replicate from "replicate";

// Initialize the S3 client
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: "ap-northeast-1",
});

export async function wav2lip(audioBlob) {
  const bucketName = "clips-queue";
  const audioFileKey = "audio/audio.mp3";
  try {
    const audioUploadParams = {
      Bucket: bucketName,
      Key: audioFileKey,
      Body: audioBlob,
      ContentType: "audio/mpeg",
    };
    await s3Client.send(new PutObjectCommand(audioUploadParams));

    // Get signed URLs for the video and audio files
    const videoCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: "videos/clip1.mp4",
    });

    const audioCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: "audio/audio.mp3",
    });

    const videoUrl = await getSignedUrl(s3Client, videoCommand, {
      expiresIn: 3600,
    });
    const audioUrl = await getSignedUrl(s3Client, audioCommand, {
      expiresIn: 3600,
    });

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    let prediction = await replicate.deployments.predictions.create(
      "fang299",
      "fluenci-lip-sync",
      {
        input: {
          fps: 25,
          face: videoUrl,
          pads: "0 10 0 0",
          audio: audioUrl,
          smooth: true,
          resize_factor: 1,
        },
      }
    );
    prediction = await replicate.wait(prediction);
    console.log(prediction.output);
    return prediction.output;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// module.exports = { wav2lip };
