import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { TranscriptionCreateParams } from "openai/resources/audio";
import { wav2lip } from "./wav2lip"; // adjust the path as needed

export const config = {
  runtime: "edge",
};

export default async (request: NextRequest) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  if (request.method === "POST") {
    try {
      // Parse the form data from the request
      const formData = await request.formData();
      const audioFile = formData.get("file");

      if (!audioFile || !(audioFile instanceof Blob)) {
        return new NextResponse("No audio file uploaded.", { status: 400 });
      }

      // Convert Blob to a file-like object acceptable by the OpenAI SDK
      const fileForTranscription = await toFile(audioFile, "audio-file.mp3");

      // Transcribe the audio file
      const transcriptionParams: TranscriptionCreateParams = {
        model: "whisper-1",
        file: fileForTranscription,
      };

      const transcription = await openai.audio.transcriptions.create(
        transcriptionParams
      );
      const transcribedText = transcription.text; // Adjust according to the actual response structure
      console.log("Transcription", transcribedText);

      // Use the transcribed text to create a chat completion
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: transcribedText }],
      });

      const text = gptResponse?.choices[0]?.message?.content;
      console.log("Reply", text);

      // The ElevenLabs API call for text-to-speech conversion
      const voiceID = "EXAVITQu4vr4xnSDxMaL";
      const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}`;
      const body = {
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      };
      const ElevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
      const response = await fetch(elevenLabsUrl, {
        method: "POST",
        headers: {
          accept: "audio/mpeg",
          "xi-api-key": ElevenLabsApiKey || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const audioBlob = await response.blob();

        // Now pass this blob to your createVideoAudioPrediction function
        try {
          const predictionOutput = await wav2lip(audioBlob);
          console.log("Prediction Output", predictionOutput);
          // Set up headers for JSON response
          const headers = {
            "Content-Type": "application/json",
          };

          // Return the response with the video URL
          return new NextResponse(
            JSON.stringify({ videoUrl: predictionOutput }),
            {
              status: 200,
              headers: headers,
            }
          );
        } catch (error) {
          console.error("Failed to create video/audio prediction", error);
          // Handle the error, maybe return a response
          return new NextResponse("Error processing video/audio prediction.", {
            status: 500,
          });
        }
      } else {
        // Handle errors or unsuccessful responses.
        const errorText = await response.text();
        console.error("API error:", errorText);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    } catch (error) {
      console.error("API error:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
