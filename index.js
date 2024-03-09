const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");
const ytcm = require("@freetube/yt-comment-scraper")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Define an endpoint to fetch the raw video
app.get("/video", async (req, res) => {
  try {
    const videoUrl = "https://youtube.com/watch?v=" + req.query.id;
    if (!videoUrl) {
      return res.status(400).json({ error: "Video URL is required" });
    }

    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const info = await ytdl.getInfo(videoUrl);

    res.json({
      "video-url": info.player_response.streamingData.formats[0].url,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Define an endpoint to get video information
app.get("/video/info", async (req, res) => {
  try {
    const videoUrl = "https://youtube.com/watch?v=" + req.query.id;
    if (!videoUrl) {
      return res.status(400).json({ error: "Video URL is required" });
    }

    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const info = await ytdl.getInfo(videoUrl);

    const videoInfo = {
      title: info.videoDetails.title,
      description: info.videoDetails.description,
      thumbnail_url: info.videoDetails.thumbnail.thumbnails[0].url,
    };

    res.json(videoInfo);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Define an endpoint to stream the video
app.get("/video/stream", async (req, res) => {
  try {
    const videoUrl = "https://youtube.com/watch?v=" + req.query.id;
    if (!videoUrl) {
      return res.status(400).json({ error: "Video URL is required" });
    }

    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    res.header("Content-Type", "video/mp4");
    ytdl(videoUrl, { format: "mp4" }).pipe(res);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Define an endpoint to fetch video comments
app.get("/video/comments", async (req, res) => {
  try {
    const payload = {
      videoId: req.query.id, // Required
      sortByNewest: "sortByNewest"
    }

    ytcm.getComments(payload).then((data) =>{
        res.json(data)
    }).catch((error)=>{
        console.log(error);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
