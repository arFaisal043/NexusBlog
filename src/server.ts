import app from "./app";
import dotenv from "dotenv"
import { config } from "./config";

const PORT = config.port;

const startServer = async () => {
    try {
        app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("Failed to start server", error);
        process.exit(1)
    }
}

startServer();