// entry file for node js system
import "./loadEnv";

import { app } from "./app";
import connectDb from "@database/connection";
import { env } from "@config/env";

app.get("/", (req, res) => {
    res.send("Hello World");
});

async function startServer() {
    try {
        await connectDb();
        console.log("Database connection successfully");

        app.listen(env.PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${env.PORT} and accessible on all interfaces`);
        })
    } catch (error) {
        console.log("Error starting the server:", error);
        process.exit(1); // close the node process
    }
}

startServer();
