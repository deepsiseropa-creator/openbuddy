// =====================================================
// STUDYBUDDY - BACKEND SERVER
// GROQ AI
// =====================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();

// Render provides PORT automatically
// 3000 is used when running locally
const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "..", "frontend")));

// =====================================================
// GROQ CLIENT
// =====================================================

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// =====================================================
// AI ENDPOINT
// =====================================================

app.post("/api/ai", async (req, res) => {

    try {

        const { question } = req.body;

        // Check if question exists
        if (!question || !question.trim()) {

            return res.status(400).json({
                answer: "Please enter a question."
            });

        }

        console.log("AI Question:", question);

        // Send question to Groq
        const completion = await groq.chat.completions.create({

            model: "openai/gpt-oss-20b",

            messages: [
                {
                    role: "system",
                    content:
                        "You are StudyBuddy AI, a helpful and friendly study assistant. Explain concepts clearly and simply for students."
                },
                {
                    role: "user",
                    content: question
                }
            ],

            temperature: 0.7,
            max_completion_tokens: 2048

        });

        const answer =
            completion.choices?.[0]?.message?.content ||
            "No response received.";

        console.log("AI Response received.");

        // Send AI response to frontend
        res.json({
            answer: answer
        });

    } catch (error) {

        console.error("Groq AI Error:", error);

        res.status(500).json({
            answer:
                "Sorry, I couldn't process your question right now."
        });

    }

});

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "..",
            "frontend",
            "index.html"
        )
    );

});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/health", (req, res) => {

    res.json({
        status: "OK",
        message: "StudyBuddy backend is running",
        ai: "Groq"
    });

});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `StudyBuddy backend running on port ${PORT}`
    );

});