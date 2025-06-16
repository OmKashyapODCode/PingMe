import express from "express";
import "dotenv/config";
import authRoutes from "./route/authroute.js";
import userRoutes from "./route/userroute.js";
import chatRoutes from "./route/chatroute.js";
import {dbConnect} from "./lib/db.js";
import cookieParser from "cookie-parser";
// import cors from "cors";
const app = express();
const PORT = process.env.PORT || 5001;
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials:true, // Allow credentials (cookies, authorization headers, etc.)
// }))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);


app.listen(PORT,()=>{
    dbConnect();
    console.log(`server is running at port ${PORT}` );
})
