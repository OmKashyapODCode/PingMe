import express from "express";
import "dotenv/config";
import authRoutes from "./route/authroute.js";
import userRoutes from "./route/userroute.js";
import chatRoutes from "./route/chatroute.js";
import {dbConnect} from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const isAllowed = 
      origin.includes("localhost") || 
      origin.includes("vercel.app") || 
      origin.includes("onrender.com") ||
      origin === process.env.FRONTEND_URL;

    if (isAllowed) {
      callback(null, true);
    } else {
      // Return false instead of throwing an Error to prevent noisy logs
      callback(null, false);
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);


app.listen(PORT,()=>{
    dbConnect();
    console.log(`server is running at port ${PORT}` );
})
