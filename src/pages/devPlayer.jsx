// VideoPlayerPage.jsx
import React from "react";
import { Button } from "@nextui-org/react";
import { useFluenciStream } from "../components/fluenciStream/fluenciStream";

const VideoPlayerPage = () => {
  // Initialize the video player with the first two clips
  const initialClips = ["/videos/clip1_frag.mp4", "/videos/clip2_frag.mp4"];

  // Use the custom hook to get the video player functionality
  const { videoRef, appendClip } = useFluenciStream(initialClips);

  // Button click handler to append the third clip
  const handleAppendClip3 = () => {
    const clip3Url = "/videos/clip3_frag.mp4"; // The URL of the third clip
    appendClip(clip3Url);
  };

  return (
    <div>
      <video ref={videoRef} width="640" height="360" controls autoPlay />
      <Button onClick={handleAppendClip3} color="primary" auto>
        Append Clip 3
      </Button>
    </div>
  );
};

export default VideoPlayerPage;
