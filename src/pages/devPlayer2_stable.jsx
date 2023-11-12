import React, { useEffect, useRef } from "react";

const VideoPlayer = () => {
  const videoRef = useRef(null);

  console.log("VideoPlayer component mounted.");

  // Utility function to get video duration from a blob
  const getDuration = (blob) => {
    return new Promise((resolve) => {
      const tempVideo = document.createElement("video");
      tempVideo.onloadedmetadata = () => {
        resolve(tempVideo.duration);
        tempVideo.remove();
      };
      tempVideo.src = URL.createObjectURL(blob);
    });
  };

  useEffect(() => {
    const mediaSource = new MediaSource();
    let sourceBuffer;
    let timestampOffset = 0; // Initialize timestampOffset

    console.log("Created MediaSource object.");

    const objectURL = URL.createObjectURL(mediaSource);
    videoRef.current.src = objectURL;
    console.log("Created Object URL for MediaSource:", objectURL);

    const sourceOpenHandler = async () => {
      console.log("MediaSource state is 'open'. Adding source buffer.");

      try {
        sourceBuffer = mediaSource.addSourceBuffer(
          'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
        );
        console.log("Source buffer added.");

        const vidClips = [
          "/videos/clip1_frag.mp4",
          "/videos/clip2_frag.mp4",
          "/videos/clip3_frag.mp4",
        ];

        for (const vidUrl of vidClips) {
          const response = await fetch(vidUrl);
          const data = await response.arrayBuffer();
          const duration = await getDuration(new Blob([data]));

          sourceBuffer.appendBuffer(data);

          // Wait for 'updateend' before setting the next timestampOffset
          await new Promise((resolve, reject) => {
            sourceBuffer.addEventListener(
              "updateend",
              () => {
                console.log(`Appended ${vidUrl}`);
                timestampOffset += duration;
                sourceBuffer.timestampOffset = timestampOffset;
                resolve();
              },
              { once: true }
            );
            sourceBuffer.addEventListener(
              "error",
              (e) => {
                console.error("Error while appending buffer:", e);
                reject(e);
              },
              { once: true }
            );
          });
        }

        console.log("All segments appended. Signalling end of stream.");
        mediaSource.endOfStream();
      } catch (e) {
        console.error("Error during source buffer operation:", e);
        if (videoRef.current && videoRef.current.error) {
          console.error("Video element error:", videoRef.current.error);
        }
      }
    };

    mediaSource.addEventListener("sourceopen", sourceOpenHandler);

    return () => {
      console.log("Cleaning up MediaSource and SourceBuffer.");
      mediaSource.removeEventListener("sourceopen", sourceOpenHandler);
      if (sourceBuffer && mediaSource.readyState === "open") {
        try {
          mediaSource.removeSourceBuffer(sourceBuffer);
          console.log("Source buffer removed.");
        } catch (e) {
          console.error("Error removing source buffer:", e);
        }
      }
      URL.revokeObjectURL(objectURL);
      console.log("Object URL revoked.");
    };
  }, []);

  return <video ref={videoRef} width="480" height="320" controls muted loop />;
};

export default VideoPlayer;
