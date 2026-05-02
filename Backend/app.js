import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js"; 

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        callback(null, process.env.CLIENT_ORIGIN || "http://localhost:5173");
    },
    credentials: true
}));

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1", routes);

app.get("/", (_req, res) => res.send("TrueLink API is running!"));

// Global error handler
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

export default app;