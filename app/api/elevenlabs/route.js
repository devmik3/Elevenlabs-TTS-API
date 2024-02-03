import fs from "fs";
import path from "path";

export async function POST(request) {
  const { message, voice } = await request.json();

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: "POST",
        headers: {
          accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: message,
          voice_settings: {
            stability: 0,
            similarity_boost: 0,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    // Option 1: Return a Blob
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    return new Response(JSON.stringify({ file: blobUrl }));

    // Option 2: Return a Data URL
    // const arrayBuffer = await response.arrayBuffer();
    // const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    // const dataUrl = `data:audio/mpeg;base64,${base64String}`;
    // return new Response(JSON.stringify({ file: dataUrl }));

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }));
  }
}
