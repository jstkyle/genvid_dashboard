import { useState, useEffect, useRef, useCallback } from "react";

export const useFluenciStream = (initialClips, fillerClips) => {
  const videoRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const [isMediaSourceOpen, setIsMediaSourceOpen] = useState(false);
  const [clipQueue, setClipQueue] = useState([]);
  const [fillerClipIndex, setFillerClipIndex] = useState(0);

  const getNextFillerClip = useCallback(() => {
    const clip = fillerClips[fillerClipIndex];
    setFillerClipIndex((prevIndex) => (prevIndex + 1) % fillerClips.length);
    return clip;
  }, [fillerClipIndex, fillerClips]);

  const appendClip = useCallback(
    async (clipUrl) => {
      if (!sourceBufferRef.current || !isMediaSourceOpen) {
        console.log(
          "SourceBuffer or MediaSource not ready yet. Queueing clip URL:",
          clipUrl
        );
        setClipQueue((prevQueue) => [...prevQueue, clipUrl]);
        return;
      }

      try {
        const response = await fetch(clipUrl);
        const data = await response.arrayBuffer();

        if (videoRef.current.buffered.length > 0) {
          const lastBufferedEnd = videoRef.current.buffered.end(
            videoRef.current.buffered.length - 1
          );
          sourceBufferRef.current.timestampOffset = lastBufferedEnd;
        }

        sourceBufferRef.current.appendBuffer(data);
        console.log(`Appending data to SourceBuffer: ${clipUrl}`);
      } catch (e) {
        console.error(`Error fetching/appending segment for ${clipUrl}:`, e);
      }
    },
    [isMediaSourceOpen]
  );

  useEffect(() => {
    if (!mediaSourceRef.current && typeof window !== "undefined") {
      console.log("Initializing MediaSource");
      const ms = new MediaSource();
      mediaSourceRef.current = ms;
      const objectURL = URL.createObjectURL(ms);

      ms.addEventListener("sourceopen", () => {
        console.log("MediaSource is open, initializing SourceBuffer");
        if (!sourceBufferRef.current) {
          setIsMediaSourceOpen(true);
          const sb = ms.addSourceBuffer(
            'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
          );
          sourceBufferRef.current = sb;
          initialClips.forEach((clip) => appendClip(clip));
          console.log("MediaSource opened. Appending initial clips...");
        }
      });

      if (videoRef.current) {
        videoRef.current.src = objectURL;
      }
    }
  }, [initialClips, appendClip]);

  useEffect(() => {
    if (isMediaSourceOpen && sourceBufferRef.current && clipQueue.length > 0) {
      const nextClip = clipQueue.shift();
      appendClip(nextClip);
      setClipQueue([...clipQueue]); // Update the queue state
    }
  }, [clipQueue, isMediaSourceOpen, appendClip]);

  useEffect(() => {
    // ... existing MediaSource and SourceBuffer initialization ...

    const updateEndHandler = () => {
      if (clipQueue.length > 0) {
        const nextClip = clipQueue.shift();
        appendClip(nextClip);
      }
    };

    if (sourceBufferRef.current) {
      sourceBufferRef.current.addEventListener("updateend", updateEndHandler);
    }

    return () => {
      if (sourceBufferRef.current) {
        sourceBufferRef.current.removeEventListener(
          "updateend",
          updateEndHandler
        );
      }
    };
  }, [clipQueue, appendClip]);

  useEffect(() => {
    const checkBufferAndAppendFiller = () => {
      if (
        videoRef.current &&
        sourceBufferRef.current &&
        !sourceBufferRef.current.updating
      ) {
        const buffered = sourceBufferRef.current.buffered;
        const currentTime = videoRef.current.currentTime;
        const bufferEnd =
          buffered.length > 0 ? buffered.end(buffered.length - 1) : 0;
        const bufferThreshold = 2; // Adjust this value based on testing

        console.log(`Buffer end: ${bufferEnd}, Current time: ${currentTime}`);

        if (
          bufferEnd - currentTime < bufferThreshold &&
          clipQueue.length === 0
        ) {
          console.log("Buffer running low. Appending filler clip.");
          appendClip(getNextFillerClip());
        }
      }
    };

    const intervalId = setInterval(checkBufferAndAppendFiller, 1000);
    return () => clearInterval(intervalId);
  }, [appendClip, clipQueue, getNextFillerClip]);

  return { videoRef, appendClip };
};
