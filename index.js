import express from 'express'
import dotenv from "dotenv";
const app = express();
import connectDB from "./config/database.js"
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import { postRouter } from './routes/post.routes.js';
import path from "path";
const __dirname = path.resolve();

dotenv.config({
    path: './config/.env'
})
connectDB()
.then(() => { 
    app.listen(process.env.PORT || 8000 , () => {
        console.log(` ⚙️ Server is running on port ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log(`MONGO db connection failed !!!`,error)
})
// app.use("/upload", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use("/upload", express.static(path.join(__dirname, "upload")));


app.use('/api', userRouter);
app.use('/api',postRouter);
// app.get("/", (req, res) => {
//     res.send("Hello World");
//   });
  