import "./src/config/env.js";  

import http from "http";
import app from "./app.js";
import { connectDB } from "./src/config/db.js";
import { connectToSocket } from "./src/sockets/socketManager.js";

const PORT = process.env.PORT;
const server = http.createServer(app);

// Attach Socket.io to the server
connectToSocket(server);

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
});