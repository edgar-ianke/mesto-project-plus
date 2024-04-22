import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user";
import cardRouter from "./routes/card";
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "./utils/errorHandler";

declare global {
  namespace Express {
      interface Request {
          user : Record<string, any>
      }
  }
}

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: "661e296f627167d24bb61d12", //
  };

  next();
});

app.use("/", userRouter);
app.use("/", cardRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Сервер запущен");
});
