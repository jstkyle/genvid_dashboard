import React, { useState, useRef } from "react";
import { Button, CircularProgress } from "@nextui-org/react";

export const Content = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const serverAudioRef = useRef<HTMLAudioElement | null>(null);
  const [videoData, setVideoData] = useState(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();

        const audioChunks: BlobPart[] = [];
        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioData(audioUrl);
        });

        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing the microphone", error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToApi = async () => {
    if (!audioData) return;

    setIsLoading(true);

    try {
      // Fetch the audio blob from the audioData URL
      const audioBlob = await fetch(audioData).then((r) => r.blob());
      // Create a FormData object and append the audio file
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");

      // Send the audio to your server endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      // Here you check if the response is okay and the content type is audio
      if (
        response.ok &&
        response.headers.get("content-type")?.includes("application/json")
      ) {
        const jsonResponse = await response.json();
        setVideoData(jsonResponse.videoUrl);
      } else {
        // Handle any errors or unexpected responses
        console.error("Response not OK or not JSON");
      }
    } catch (error) {
      console.error("Error sending audio to the API:", error);
      // setApiResponse("An error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="mb-4">
        {isRecording ? (
          <Button color="danger" onClick={stopRecording}>
            Stop Recording
          </Button>
        ) : (
          <Button color="primary" onClick={startRecording}>
            Start Recording
          </Button>
        )}
      </div>
      <div className="mb-4">
        {audioData && <audio controls src={audioData} ref={audioRef} />}
      </div>
      <div className="mb-4">
        <Button
          color="secondary"
          onClick={sendAudioToApi}
          disabled={!audioData || isLoading}
        >
          {isLoading ? <CircularProgress color="primary" /> : "Run"}
        </Button>
      </div>
      {/* Display the video received from the API response */}
      {videoData && (
        <div className="mb-4">
          {/* Here 'videoData' is the state or prop holding the video URL */}
          <video
            controls
            src={videoData}
            width="720"
            height="auto"
            ref={videoRef}
          />
        </div>
      )}
    </div>
  );
};
