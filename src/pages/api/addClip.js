export async function addBufferToPlaylist() {}
// pages/api/addBuffer.js
import { addClipToPlaylist } from "./addClipToPlaylist";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { url } = req.body;
    try {
      await addClipToPlaylist(url);
      res.status(200).json({ message: "Clip added successfully" });
    } catch (error) {
      console.error("Error adding clip:", error);
      res.status(500).json({ message: "Error adding clip" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
