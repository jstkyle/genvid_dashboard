// fluenciStream.js
import { useState, useEffect, useRef, useCallback } from "react";

export const useFluenciStream = (initialClips) => {
  const videoRef = useRef(null);
  const [sourceBuffer, setSourceBuffer] = useState(null);
  const [mediaSource, setMediaSource] = useState(null);
  const [clipQueue, setClipQueue] = useState(initialClips);
  const [isInitialClipsLooping, setIsInitialClipsLooping] = useState(true);

  // Initialize MediaSource when on the client side
  useEffect(() => {
    if (typeof window !== "undefined" && !mediaSource) {
      const newMediaSource = new MediaSource();
      setMediaSource(newMediaSource);
    }
  }, [mediaSource]);

  // Create an object URL for the mediaSource and set up the sourceBuffer
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

  const appendClip = useCallback(
    async (clipUrl, isInitialClip = false) => {
      if (
        sourceBuffer &&
        !sourceBuffer.updating &&
        mediaSource.readyState === "open"
      ) {
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

          if (!isInitialClip) {
            setIsInitialClipsLooping(false); // Stop looping the initial clips once a new clip is appended
          }
        } catch (e) {
          console.error("Error fetching/appending segment:", e);
        }
      } else {
        setClipQueue((prevQueue) => [...prevQueue, clipUrl]);
      }
    },
    [sourceBuffer, mediaSource, videoRef]
  );

  // Loop through the initial clips
  useEffect(() => {
    const loopInitialClips = async () => {
      if (isInitialClipsLooping) {
        for (const clipUrl of initialClips) {
          await appendClip(clipUrl, true);
        }
      }
    };

    if (
      mediaSource &&
      mediaSource.readyState === "open" &&
      !sourceBuffer?.updating
    ) {
      loopInitialClips();
    }
  }, [
    initialClips,
    isInitialClipsLooping,
    mediaSource,
    sourceBuffer,
    appendClip,
  ]);

  useEffect(() => {
    const sourceBufferUpdateEndHandler = () => {
      if (clipQueue.length > 0) {
        const nextClipUrl = clipQueue.shift();
        setClipQueue([...clipQueue]);
        appendClip(nextClipUrl);
      } else if (isInitialClipsLooping) {
        // Continue looping initial clips if no new clips are queued
        for (const clipUrl of initialClips) {
          appendClip(clipUrl, true);
        }
      }
    };

    sourceBuffer?.addEventListener("updateend", sourceBufferUpdateEndHandler);

    return () => {
      sourceBuffer?.removeEventListener(
        "updateend",
        sourceBufferUpdateEndHandler
      );
    };
  }, [
    sourceBuffer,
    clipQueue,
    appendClip,
    initialClips,
    isInitialClipsLooping,
  ]);

  return {
    videoRef,
    appendClip,
    setClipQueue,
  };
};
