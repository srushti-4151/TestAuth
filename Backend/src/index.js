import connectDB from "./db/index.js";
import { app } from "./app.js"
import 'dotenv/config'

connectDB()
  .then(() => {
    // 1. Listen for server (Express) errors
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    // 2. Start the server
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is connected to port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    // 3. MongoDB failed to connect
    console.log("MongoDB connection failed!!", error);
  });
