const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const path = require("path");

dotenv.config();

const app = express();

// Render provides PORT automatically.
// 3000 is used when running locally.
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Groq client
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

// AI endpoint
app.post("/api/ai", async (req, res) => {
    try {
        const { question } = req.body;

        // Check if question exists
        if (!question || !question.trim()) {
            return res.status(400).json({
                answer: "Please enter a question."
            });
        }

        // Send question to Groq
        const response = await client.responses.create({
            model: "openai/gpt-oss-20b",
            input: question
        });

        // Send AI response to frontend
        res.json({
            answer: response.output_text
        });

    } catch (error) {
        console.error("Groq AI Error:", error);

        res.status(500).json({
            answer: "Sorry, I couldn't process your question."
        });
    }
});

// Health-check / home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyBuddy backend running on port ${PORT}`);
});
