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

const allowedOrigins = [
  "http://localhost:5173",
  "https://ping-me-gold.vercel.app"
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow exact matches
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    // Allow any vercel domain just in case of preview deployments
    if (origin.endsWith(".vercel.app")) return callback(null, true);

    callback(new Error(`CORS: Origin ${origin} not allowed`));
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
