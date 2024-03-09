const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Define an endpoint to fetch the raw video
app.get("/video", async (req, res) => {
  try {
    const videoUrl = "https://youtube.com/watch?v=" + req.query.id; // The YouTube video URL should be provided as a query parameter
    if (!videoUrl) {
      return res.status(400).json({ error: "Video URL is required" });
    }

    // Check if the URL is a valid YouTube URL
    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    // Get video information
    const info = await ytdl.getInfo(videoUrl);

    console.log(info.player_response.streamingData);

    res.json({
      "video-url": info.player_response.streamingData.formats[0].url,
    });
    //res.send("<script>console.log(" + JSON.stringify(info.player_response.streamingData) + ")</script>")
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/video/info", async (req, res) => {
  try {
    const videoUrl = "https://youtube.com/watch?v=" + req.query.id; // The YouTube video URL should be provided as a query parameter
    if (!videoUrl) {
      return res.status(400).json({ error: "Video URL is required" });
    }

    // Check if the URL is a valid YouTube URL
    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    // Get video information
    const info = await ytdl.getInfo(videoUrl);

    // Extracting only required information
    const videoInfo = {
      title: info.videoDetails.title,
      description: info.videoDetails.description,
      thumbnail_url: info.videoDetails.thumbnail.thumbnails[0].url // Assuming you want the first thumbnail
    };

    res.json(videoInfo);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
