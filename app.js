import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import routes from "./routes/routes.js";
import errorMiddleware from "./middleware/error.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", routes);

//Middleware for errors
app.use(errorMiddleware);

export default app;
