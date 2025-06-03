import connectDB from "./db/index.js";
import { app } from "./app.js"
import 'dotenv/config'

connectDB()
    .then(() => {
        app.on("error", () => {
            console.log("ERROR: ", error);
            throw error;
        });
        app.listen(process.env.PORT || 800, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("MONGO db connection failed !!", error);
    })