import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js'
import jobRouter from './routes/jobRouter.js'
import applicationRouter from './routes/applicationRouter.js'
import {dbConnection} from './database/dbConnection.js'
import {errorMiddleware} from './middlewares/error.js'

const app = express();
dotenv.config({path: "./config/config.env"}); //making connection to .env file

app.use(cors({      
    origin: [process.env.FRONTEND_URL],    // only requests from the domain specified in FRONTEND_URL will be allowed.
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
}));

app.use(cookieParser());  

app.use(express.json()); // Using express.json() middleware to parse incoming JSON request bodies

app.use(express.urlencoded({extended: true})); // URL-encoded data is a way of encoding data in key-value pairs and is often used in HTTP POST requests . When a client sends data to the server in a POST request, the data comes in the body of the HTTP request. If this data is URL-encoded, express.urlencoded({extended: true}) will parse the data and make it available on the req.body property

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
}));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/job', jobRouter);
app.use('/api/v1/application', applicationRouter);

dbConnection();

app.use(errorMiddleware);

export default app;