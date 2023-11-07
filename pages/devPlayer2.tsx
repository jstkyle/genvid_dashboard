import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const hls = new Hls();

    // Directly load the test HLS stream URL
    const testStreamUrl =
      "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8";

    if (Hls.isSupported()) {
      hls.loadSource(testStreamUrl);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        videoElement.play();
      });
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = testStreamUrl;
      videoElement.addEventListener("loadedmetadata", () => {
        videoElement.play();
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} controls autoPlay style={{ width: "100%" }} />
      <p>Testing HLS stream: Tears of Steel</p>
    </div>
  );
};

export default VideoPlayer;
