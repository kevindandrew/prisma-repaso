import express from "express";
import type { Application, Response, Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute";
import rutaRouter from "./routes/rutaRoute";
import passengerRouter from "./routes/passengerRoute";
import vehiculoRouter from "./routes/vehiculoRoute";
import tripRouter from "./routes/tripRoute";
import bookingRouter from "./routes/bookingRoute";
import authRouter from "./routes/auth.routes";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
dotenv.config();

// documentacion generada con: npm run swagger
const swaggerDocument = JSON.parse(
  fs.readFileSync(new URL("./swagger-output.json", import.meta.url), "utf-8"),
);

const app: Application = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", function (req: Request, res: Response) {
  res.json({
    mensaje: "LA API ESTA FUNCIONANDO CORRECTAMENTE :D",
  });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/route", rutaRouter);
app.use("/passenger", passengerRouter);
app.use("/vehiculo", vehiculoRouter);
app.use("/trip", tripRouter);
app.use("/booking", bookingRouter);

app.listen(PORT, function () {
  console.log(`SERVIDOR CORRIENDO EN EL PUERTO http://localhost:${PORT}`);
});
