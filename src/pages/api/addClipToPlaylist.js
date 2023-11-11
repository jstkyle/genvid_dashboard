const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
import {
  createMediaConvertJob,
  waitForMediaConvertJobCompletion,
} from "./mediaConvert";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: "ap-northeast-1",
});

// streamToString utility function
const streamToString = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
};

const downloadPlaylistFromS3 = async (bucket, key) => {
  try {
    const data = await s3Client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );
    return streamToString(data.Body);
  } catch (err) {
    console.error("Error downloading file from S3: ", err);
    throw err;
  }
};

const getLastClipSequence = (playlistContent) => {
  console.log("Playlist Content:", playlistContent);
  const lines = playlistContent.split("\n");
  const tsFiles = lines.filter((line) => line.endsWith(".ts"));
  const lastFile = tsFiles[tsFiles.length - 1];
  const match = lastFile.match(/(\d+)\.ts$/);
  return match ? parseInt(match[1], 10) : null;
};

const updatePlaylist = (playlistContent, newClipName) => {
  let updatedContent = playlistContent.replace(/#EXT-X-ENDLIST\s*$/, "");
  // Append new segment
  updatedContent += `\n#EXT-X-DISCONTINUITY\n#EXTINF:5.0,\n${newClipName}`;
  // Re-append #EXT-X-ENDLIST at the end of the playlist
  updatedContent += "\n#EXT-X-ENDLIST";
  return updatedContent;
};

const uploadPlaylistToS3 = async (bucket, key, content) => {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: content,
      })
    );
  } catch (err) {
    console.error("Error uploading file to S3: ", err);
    throw err;
  }
};

async function renameFile(bucketName, oldKey, newKey) {
  try {
    // Copy the file to the new key (rename)
    await s3Client.send(
      new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: `${bucketName}/${oldKey}`,
        Key: newKey,
      })
    );

    // Delete the original file
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: oldKey,
      })
    );

    console.log(`File renamed from ${oldKey} to ${newKey}`);
  } catch (error) {
    console.error("Error renaming file:", error);
    throw error;
  }
}

export async function addClipToPlaylist(inputUrl) {
  try {
    // Download current playlist
    const bucket = "clips-queue";
    const playlistKey = "tssegments/playlist.m3u8";
    const playlistContent = await downloadPlaylistFromS3(bucket, playlistKey);

    // Get last clip sequence
    const lastSequence = getLastClipSequence(playlistContent);
    const newSequence = lastSequence !== null ? lastSequence + 1 : 1;
    const newClipName = `${newSequence}.ts`;

    // Create a MediaConvert job for the new clip
    const jobId = await createMediaConvertJob(inputUrl);

    // Wait for the MediaConvert job to complete
    const jobStatus = await waitForMediaConvertJobCompletion(jobId);
    if (jobStatus !== "COMPLETE") {
      throw new Error(
        `MediaConvert job did not complete successfully. Status: ${jobStatus}`
      );
    }

    renameFile(
      bucket,
      "tssegments/clip1_og_00001.ts",
      "tssegments/" + newClipName
    );
    // Update playlist with new clip
    const updatedPlaylist = updatePlaylist(playlistContent, newClipName);

    // Upload updated playlist to S3
    await uploadPlaylistToS3(bucket, playlistKey, updatedPlaylist);

    console.log(`Added clip ${newClipName} to playlist.`);
  } catch (err) {
    console.error("Error in addClipToPlaylist: ", err);
  }
}
