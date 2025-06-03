import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

const allowedOrigins = [
    "http://localhost:5173"
]

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(express.json({limit: "16kb"})) // Middleware to parse incoming JSON requests with a size limit of 16 kilobytes. This is useful for handling JSON payloads in POST requests.
app.use(express.urlencoded({extended: true, limit: "16kb"})) // Middleware to parse incoming URL-encoded data (like form submissions). extended: true allows for rich objects and arrays to be encoded. The size limit is also 16 kilobytes.
app.use(express.static("public"))  // Serves static files (like HTML, CSS, JavaScript) from the public directory. This means any files placed in the public folder can be accessed directly via their URL.
app.use(cookieParser())

import userRouter from "./routes/user.routes.js";
import managerRouter from "./routes/manager.routes.js"
import catgoryRouter from "./routes/categories.routes.js"
import dishRouter from "./routes/dish.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/manager", managerRouter)
app.use("/api/v1/category", catgoryRouter)
app.use("/api/v1/dish", dishRouter)


export {app};