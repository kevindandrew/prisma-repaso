import { Router } from "express";
import {
  createPassengers,
  deletePassenger,
  getPassengers,
  getPassengersById,
  putPassenger,
} from "../controllers/passengerController";
const router = Router();

router.get("/", getPassengers);
router.get("/:id", getPassengersById);
router.post("/", createPassengers);
router.put("/:id", putPassenger);
router.delete("/:id", deletePassenger);
export default router;
