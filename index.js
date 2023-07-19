import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { userRouter } from "./DB/Router/userRouter.js";
import { shorturlRouter } from "./DB/Router/shorturlRouter.js";
import bodyParser from "body-parser";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({ message: "Hello There!" });
});


app.use("/users", userRouter);
app.use("/shorturl",shorturlRouter);

mongoose.connect(process.env.mongourl);

app.listen(PORT, () => console.log(`Server started at localhost:${PORT}`));
