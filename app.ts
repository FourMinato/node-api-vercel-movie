import express from "express";
import { router as index } from "./api/index";
import { router as trip } from "./api/trip";
import bodyParser from "body-parser";
import cors from "cors";


export const app = express();

// app.use("/", (req, res) => {
//   res.send("Hello World");
// });

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);
app.use("/", index);
app.use("/trip", trip);
