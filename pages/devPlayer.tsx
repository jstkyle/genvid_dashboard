import React, { useEffect, useRef } from "react";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure this code is not executed server-side
    if (typeof window === "undefined") {
      return;
    }

    // Dynamic import for HLS.js to make sure it runs on the client-side only
    import("hls.js").then((Hls) => {
      const hls = new Hls.default();
      const videoElement = videoRef.current;

      const fetchPlaylist = async (videoKey: string) => {
        try {
          const res = await fetch(`/api/stream-video?video=${videoKey}`);
          const data = await res.json();
          if (data.url && videoElement) {
            hls.loadSource(data.url);
            hls.attachMedia(videoElement);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
              videoElement.play();
            });
          }
        } catch (error) {
          console.error("Failed to fetch playlist", error);
        }
      };

      // Array of video keys for your .m3u8 files
      const videoKeys = ["clip1.m3u8", "clip2.m3u8", "clip3.m3u8"];

      // Sequentially play each video
      const playVideosInSequence = async () => {
        for (const videoKey of videoKeys) {
          await fetchPlaylist(videoKey);
          // Wait for the current video to end before proceeding to the next one
          await new Promise((resolve) => {
            hls.on(Hls.Events.BUFFER_EOS, resolve);
          });
        }
      };

      playVideosInSequence();

      // Clean up
      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    });
  }, []);

  return (
    <div>
      <video ref={videoRef} controls autoPlay style={{ width: "100%" }} />
    </div>
  );
};

export default VideoPlayer;
