import React, { useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/react";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [sourceBuffer, setSourceBuffer] = useState(null);
  const [mediaSource, setMediaSource] = useState(null); // Set to null initially
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const vidClips = [
    "https://replicate.delivery/pbxt/v0RDApORPZ4tCtl19zNYGhKBVEQrsZYVRNhxaF9AppSXkUeIA/result_voice.mp4",
    "/videos/clip1_frag.mp4",
    "https://replicate.delivery/pbxt/GfsFGIGRwP3hPCHGy0jzYBIIjH1Ac7Q9rqg269wxPOY5Ip8IA/result_voice.mp4",
    "/videos/clip1_frag.mp4",
    "/videos/clip2_frag.mp4",
    "/videos/clip3_frag.mp4",
  ];

  useEffect(() => {
    // Instantiate MediaSource when on the client side
    if (typeof window !== "undefined" && !mediaSource) {
      setMediaSource(new MediaSource());
    }
  }, [mediaSource]);

  useEffect(() => {
    if (mediaSource) {
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
    }
  }, [mediaSource]);

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
      <Button onClick={appendSegment} color="primary" auto>
        Append Next Segment
      </Button>
    </div>
  );
};

export default VideoPlayer;
