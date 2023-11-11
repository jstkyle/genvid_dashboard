import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js"; // Assuming Hls.js is properly installed and has type definitions.

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
  const [lastTime, setLastTime] = useState(0);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement && Hls.isSupported()) {
      const hls = new Hls();
      setHlsInstance(hls);

      const videoKeys = ["playlistcopy.m3u8"];
      let currentVideoIndex = 0;

      const fetchPlaylist = async (videoKey: string) => {
        try {
          const res = await fetch(`/api/stream-video?video=${videoKey}`);
          const data = await res.json();
          if (data.url) {
            hls.loadSource(data.url);
            hls.attachMedia(videoElement);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              videoElement.play();
            });
          }
        } catch (error) {
          console.error("Failed to fetch playlist", error);
        }
      };

      const onVideoEnded = () => {
        currentVideoIndex++;
        if (currentVideoIndex < videoKeys.length) {
          fetchPlaylist(videoKeys[currentVideoIndex]);
        }
      };

      // Disable pause and seeking.
      const disablePauseAndSeeking = () => {
        if (videoElement.paused) {
          videoElement.play();
        } else {
          const currentTime = videoElement.currentTime;
          // If the current time is significantly different from the last time,
          // we assume a seek operation has occurred and reset the time.
          if (Math.abs(currentTime - lastTime) > 0.01) {
            videoElement.currentTime = lastTime;
          } else {
            setLastTime(currentTime);
          }
        }
      };

      videoElement.addEventListener("ended", onVideoEnded);
      videoElement.addEventListener("pause", disablePauseAndSeeking);
      videoElement.addEventListener("seeking", disablePauseAndSeeking);

      fetchPlaylist(videoKeys[currentVideoIndex]);

      // Clean up
      return () => {
        videoElement.removeEventListener("ended", onVideoEnded);
        videoElement.removeEventListener("pause", disablePauseAndSeeking);
        videoElement.removeEventListener("seeking", disablePauseAndSeeking);
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      style={{ width: "100%" }}
      // Controls are removed to disable default user interaction.
    />
  );
};

export default VideoPlayer;
