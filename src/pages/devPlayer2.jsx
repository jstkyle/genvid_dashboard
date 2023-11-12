import React, { useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/react";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [sourceBuffer, setSourceBuffer] = useState(null);
  const [mediaSource, setMediaSource] = useState(new MediaSource());
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const vidClips = [
    "/videos/clip1_frag.mp4",
    "/videos/clip2_frag.mp4",
    "/videos/clip3_frag.mp4",
  ];

  useEffect(() => {
    const objectURL = URL.createObjectURL(mediaSource);
    videoRef.current.src = objectURL;

    const sourceOpenHandler = () => {
      const newSourceBuffer = mediaSource.addSourceBuffer(
        'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
      );
      setSourceBuffer(newSourceBuffer);
    };

    mediaSource.addEventListener("sourceopen", sourceOpenHandler);

    return () => {
      mediaSource.removeEventListener("sourceopen", sourceOpenHandler);
      URL.revokeObjectURL(objectURL);
    };
  }, []);

  const appendSegment = async () => {
    if (sourceBuffer && !sourceBuffer.updating) {
      const vidUrl = vidClips[currentClipIndex];
      try {
        const response = await fetch(vidUrl);
        const data = await response.arrayBuffer();
        if (videoRef.current.buffered.length > 0) {
          const lastBufferedEnd = videoRef.current.buffered.end(
            videoRef.current.buffered.length - 1
          );
          sourceBuffer.timestampOffset = lastBufferedEnd;
        }
        sourceBuffer.appendBuffer(data);
        setCurrentClipIndex((prevIndex) => (prevIndex + 1) % vidClips.length);
      } catch (e) {
        console.error("Error fetching/appending segment:", e);
      }
    } else {
      console.log("SourceBuffer is not ready or is updating.");
    }
  };

  return (
    <div>
      <video ref={videoRef} width="480" height="320" autoPlay />
      <Button onClick={appendSegment} color="primary">
        Append Next Segment
      </Button>
    </div>
  );
};

export default VideoPlayer;
