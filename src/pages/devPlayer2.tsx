import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;
    // videoElement.muted = true; // Set the muted attribute to true to allow autoplay
    videoElement.autoplay = true; // Enable autoplay
    const hls = new Hls();

    // Directly load the test HLS stream URL
    const testStreamUrl =
      "https://clips-queue.s3.ap-northeast-1.amazonaws.com/videos/output.m3u8?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkYwRAIgJanBNaAQhD8XR79wuRi0er%2BV%2BUetcf%2FY0TQjMm%2FdtvsCICE5HN2KtcWBm%2FTzuAjdQGqfoo8LDwLuNEtPY9Ob17LgKtQDCML%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNTQ2NzI0MTkyNzU4IgyDy4hvyYTy59lQ9XoqqANEFe1WkuFHgHoyhnq5Gt71YcgDrFFLvlwLsjpPDyXWNDRzgdQd%2BY8GHIsYca5Kj66ewsKCPt%2BVHozpbqdqiqobZLLTNJVXfLbYp18i8LwWbCWSLLc81O2o3GLC8oNzmsfvWTmqxvd3OXlonuWPWg9GH6mhpI1yldmdzEVPUsU5xNCUQfWBpQQtOxuc7TInQMkovjFsb9uvNXf8yZRUwOoo6Ea2qFRNO07K0BaKxwAMHqzMENRXd2SohxYgy51%2FUOun8ZXXI%2Fzqwf0wxEiS9e9xoUYumUF6w%2F9Aq2dCj99OOOJ%2BoFkXqDxodP2RvXI5ra1mMkxlb6MlRadpMVaxgZlx492acgCCQMWisiGYdN8xRv6MrZ8%2FhSYstaAdaNYOOZ3tedn4DzLqZJei%2BEr450pGYSyuJicy9UxBss8XW6KmXnklQwqFPQMev4ckJeb8M%2Fho%2F8igsLLkC7v2HQJ69A4DQL1ZMgvOXLJFW6ws0rVRySWy%2FooP8v8H6DMm0sgioJrFAL8wPnjbwEBFDoddoiXP3HztYNhlRL%2FuiBemZPHzs5Fm8qNs8QGIMMvzrqoGOpUCHfblEApPRXJNNyebBgKVwhuPT1NkbbRKm%2BeK5o6eAxQD4CVo5zGIPfasB%2Fxeh4aTgxCkubwlPIWFHpBD6qA5Hn%2FqCxvQGmNC6QX7gHAsm%2B5zcBIaEciNe3U8EyhxqtKNMHny9Zu3Phu66CqKkUyS7OrdFrnTz34nnXOJ5lWof%2B4n3ucWl0eZz80Ex5fmDZMmuYAB%2BT6HRrxmd9NQwhDSmXsmlZwgmTizB3HljLymc6qyxTqHjLybPjMa%2Fo%2Fj6zTzNlhtc3fKVid4ZcRCxXXNKlqfEpywYz1bAesA%2FvbSFKzmxNxgOTnfO5V5mYDp4yJtw%2ByCeMgON9Oas6tLfeX6N%2BoASRcrGdIxXb1A5f7Ss64DnhGXjA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231108T170226Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIAX6S2NEH3KWESJMHZ%2F20231108%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Signature=39ffc3e0480816339f7be98d195020c503836b003bd8ff066134af4fba8d4f3e";

    if (Hls.isSupported()) {
      hls.loadSource(testStreamUrl);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // try to recover network error
              console.error("fatal network error encountered, try to recover");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("fatal media error encountered, try to recover");
              hls.recoverMediaError();
              break;
            default:
              // cannot recover
              hls.destroy();
              break;
          }
        }
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
      <video ref={videoRef} controls autoPlay muted style={{ width: "100%" }} />
      <p>Testing HLS stream: Tears of Steel</p>
    </div>
  );
};

export default VideoPlayer;
