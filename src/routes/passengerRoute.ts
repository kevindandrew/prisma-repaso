import { Router } from "express";
import {
  createPassengers,
  deletePassenger,
  getPassengers,
  getPassengersById,
  putPassenger,
} from "../controllers/passengerController";
import { validate } from "../middlewares/validateMiddleware";
import { createPassengerSchema } from "../schemas/passengerSchema";
const router = Router();

router.get("/", getPassengers);
router.get("/:id", getPassengersById);
router.post("/", validate(createPassengerSchema), createPassengers);
router.put("/:id", putPassenger);
router.delete("/:id", deletePassenger);
export default router;
