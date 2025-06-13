import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174"
]

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(express.json({limit: "16kb"})) 
app.use(express.urlencoded({extended: true, limit: "16kb"})) 
app.use(express.static("public"))  
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