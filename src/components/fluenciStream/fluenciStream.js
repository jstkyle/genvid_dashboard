import { useState, useEffect, useRef, useCallback } from "react";

export const useFluenciStream = (initialClips) => {
  const videoRef = useRef(null);
  const [sourceBuffer, setSourceBuffer] = useState(null);
  const [mediaSource, setMediaSource] = useState(null);
  const [clipQueue, setClipQueue] = useState([]);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && !mediaSource) {
      const newMediaSource = new MediaSource();
      setMediaSource(newMediaSource);
    }
  }, [mediaSource]);

  useEffect(() => {
    if (mediaSource && videoRef.current) {
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

  const appendClip = useCallback(
    async (clipUrl) => {
      if (sourceBuffer && mediaSource.readyState === "open") {
        if (sourceBuffer.updating) {
          setTimeout(() => appendClip(clipUrl), 500);
          return;
        }

        try {
          const response = await fetch(clipUrl);
          if (!response.ok) {
            throw new Error(
              `Network response was not ok, status: ${response.status}`
            );
          }
          const data = await response.arrayBuffer();

          if (videoRef.current.buffered.length > 0) {
            const lastBufferedEnd = videoRef.current.buffered.end(
              videoRef.current.buffered.length - 1
            );
            sourceBuffer.timestampOffset = lastBufferedEnd;
          }

          sourceBuffer.appendBuffer(data);
          setClipQueue((prevQueue) =>
            prevQueue.filter((url) => url !== clipUrl)
          );
        } catch (e) {
          console.error("Error fetching/appending segment:", e);
        }
      } else {
        setClipQueue((prevQueue) => [...prevQueue, clipUrl]);
      }
    },
    [sourceBuffer, mediaSource, videoRef]
  );

  useEffect(() => {
    const loopInitialClips = () => {
      if (clipQueue.length === 0) {
        const clipUrl = initialClips[currentClipIndex];
        appendClip(clipUrl);
        setCurrentClipIndex((index) => (index + 1) % initialClips.length);
      }
    };

    if (
      mediaSource &&
      mediaSource.readyState === "open" &&
      !sourceBuffer?.updating
    ) {
      loopInitialClips();
    }
  }, [mediaSource, sourceBuffer, appendClip, currentClipIndex]);

  useEffect(() => {
    const sourceBufferUpdateEndHandler = () => {
      if (clipQueue.length > 0) {
        const nextClipUrl = clipQueue.shift();
        appendClip(nextClipUrl);
      }
    };

    sourceBuffer?.addEventListener("updateend", sourceBufferUpdateEndHandler);
    return () => {
      sourceBuffer?.removeEventListener(
        "updateend",
        sourceBufferUpdateEndHandler
      );
    };
  }, [sourceBuffer, clipQueue, appendClip]);

  return { videoRef, appendClip };
};
