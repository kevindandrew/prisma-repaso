import { Router } from "express";
import {
  createTrip,
  deleteViaje,
  getTripById,
  getTrips,
  patchDate,
  patchVehiculo,
  putTrip,
} from "../controllers/tripController";
const router = Router();

router.get("/", getTrips);
router.get("/:id", getTripById);
router.post("/", createTrip);
router.put("/:id", putTrip);
router.patch("/:id/vehiculo", patchVehiculo);
router.patch("/:id/fecha", patchDate);
router.delete("/:id", deleteViaje);

export default router;
