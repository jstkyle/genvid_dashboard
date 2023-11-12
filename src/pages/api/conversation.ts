// Required imports for the functionality
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { wav2lip } from "./wav2lip"; // Make sure to adjust the path as needed

// Initialize the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Runtime configuration for the Next.js middleware
export const config = {
  runtime: "edge", // Indicates that this code runs at the edge, outside of Vercel's regions
};

// Type declaration for the GPT-3 formatted message
interface GPTMessage {
  role: string;
  content: string;
}

// Function to fetch messages from Supabase and format them for GPT-3
async function fetchMessages(sessionId: number): Promise<GPTMessage[]> {
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

// The main handler for incoming POST requests
export default async (request: NextRequest) => {
  if (request.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  // Assume the sessionId is extracted correctly from the request
  const sessionId = 1; // Replace with actual extraction logic

  try {
    const formData = await request.formData();
    const audioFile = formData.get("file");
    if (!audioFile || !(audioFile instanceof Blob)) {
      return new NextResponse("No audio file uploaded.", { status: 400 });
    }

    // Transcribe the audio file using OpenAI's transcription model
    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFile,
    });

    const transcribedText = transcription.text || ""; // Fallback to empty string if null

    // Insert the transcribed text as a user message into Supabase
    const { error: userMessageError } = await supabase
      .from("SessionMessages")
      .insert([
        { session_id: sessionId, content: transcribedText, role: "user" },
      ]);
    if (userMessageError) throw userMessageError;

    // Fetch the conversation history in GPT-3 format
    const conversationHistory = await fetchMessages(sessionId);

    const openaiMessages = conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant", // or 'system' | 'function' if needed
      content: msg.content,
    }));

    console.log(openaiMessages);

    // Generate a response from GPT-3
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: openaiMessages,
    });

    const gptText = gptResponse?.choices[0]?.message?.content || "";

    // Insert the GPT-3 response into Supabase
    const { error: gptResponseError } = await supabase
      .from("SessionMessages")
      .insert([{ session_id: sessionId, content: gptText, role: "assistant" }]);
    if (gptResponseError) throw gptResponseError;

    // Convert GPT-3's response to speech using ElevenLabs' API
    const voiceID = "EXAVITQu4vr4xnSDxMaL"; // Replace with the actual voice ID
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}`;
    const body = {
      text: gptText,
      model_id: "eleven_monolingual_v1",
      voice_settings: { stability: 0.5, similarity_boost: 0.5 },
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

    if (!response.ok) {
      throw new Error("Failed to convert text to speech.");
    }

    const audioBlob = await response.blob();

    // Pass the audio blob to the wav2lip function
    const predictionOutput = await wav2lip(audioBlob);

    // Return the response with the video URL
    return new NextResponse(
      JSON.stringify({ videoUrl: predictionOutput }), // The output from the wav2lip function
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
