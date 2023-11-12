import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button, Avatar, Progress, Card, CardBody } from "@nextui-org/react";

// Initialize the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define a type for the messages in the conversation
interface Message {
  role: "user" | "assistant";
  content: string;
}

const sessionId = 1; // Placeholder value

// Function to fetch messages from Supabase
async function fetchMessages(sessionId: number): Promise<Message[]> {
  const { data: messages, error } = await supabase
    .from("SessionMessages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }

  return messages || [];
}

export const Page = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoData, setVideoData] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]); // Use the Message type for the conversation state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    // Function to handle keydown events
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault(); // Prevent the default space action (scroll down)
        if (!isRecording) {
          startRecording();
        }
      }
    };

    // Function to handle keyup events
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        if (isRecording) {
          stopRecording();
        }
      }
    };

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isRecording]);

  useEffect(() => {
    // Log the conversation whenever it updates
    console.log("Conversation updated: ", conversation);
  }, [conversation]);

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
          sendAudioToApi(audioBlob);
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

  const sendAudioToApi = async (audioBlob: Blob) => {
    // Create a FormData object and append the audio file
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");

    try {
      // Send the audio and the conversation to your server endpoint
      const response = await fetch("/api/conversation", {
        method: "POST",
        body: formData,
      });

      // Check if the response is okay and the content type is video
      if (
        response.ok &&
        response.headers.get("content-type")?.includes("application/json")
      ) {
        const jsonResponse = await response.json();
        setVideoData(jsonResponse.videoUrl);

        // Fetch and update the conversation with the latest messages
        const updatedMessages = await fetchMessages(sessionId);
        setConversation(updatedMessages);
      } else {
        // Handle any errors or unexpected responses
        console.error("Response not OK or not JSON");
      }
    } catch (error) {
      console.error("Error sending audio to the API:", error);
    }
  };

  // Function to render the conversation messages
  const renderConversation = () => {
    return conversation.map((entry, index) => (
      <div key={index} className="flex items-center gap-3 mb-3">
        <Avatar
          src={
            entry.role === "user"
              ? "https://i.pravatar.cc/150?img=3"
              : undefined
          }
          name={entry.role}
          size="lg"
        />
        <Card
          className={`bg-${entry.role === "user" ? "blue-500" : "gray-500"}`}
        >
          <CardBody
            className={`text-${
              entry.role === "user" ? "white" : "black"
            } card-body`}
          >
            <p>{entry.content}</p>
          </CardBody>
        </Card>
      </div>
    ));
  };

  // useEffect to add and remove event listeners
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (!isRecording) {
          startRecording();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        if (isRecording) {
          stopRecording();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isRecording]);

  return (
    <div className="flex h-screen">
      {/* Left section - Avatar and Video footage */}
      <div className="w-3/5 p-4">
        <div className="text-2xl font-bold my-2">
          English Conversation with Nikki
        </div>
        <div className="relative">
          {/* Display the video received from the API response */}
          {videoData ? (
            <video
              className="rounded-lg w-full"
              autoPlay
              src={videoData}
              ref={videoRef}
            />
          ) : (
            <video className="rounded-lg w-full" controls>
              <source src="path-to-your-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div>
          <Button
            color="danger"
            className={`mt-4 w-full font-bold text-lg ${
              isRecording ? "flashing" : ""
            }`}
            disabled={isRecording}
          >
            Press space to speak
          </Button>
        </div>
        {/* Timer or session info can go here */}
      </div>

      {/* Right section - Chat history */}
      <div className="w-2/5 p-4 bg-white rounded-lg shadow">
        <div className="overflow-y-auto h-[80%]">{renderConversation()}</div>
      </div>
    </div>
  );
};
