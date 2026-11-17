import express from "express";
import type { Application, Response, Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute";
dotenv.config();

const app: Application = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", function (req: Request, res: Response) {
  res.json({
    mensaje: "LA API ESTA FUNCIONANDO CORRECTAMENTE :D",
  });
});

app.use("/users", userRouter);

app.listen(PORT, function () {
  console.log(`SERVIDOR CORRIENDO EN EL PUERTO http://localhost:${PORT}`);
});
