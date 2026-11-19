import { Router } from "express";
import {
  createVehiculo,
  deleteVehiculo,
  getVehiculos,
  getVehiculosById,
  patchConductor,
  putVehiculo,
} from "../controllers/vehiculoController";
const router = Router();
router.get("/", getVehiculos);
router.get("/:id", getVehiculosById);
router.post("/", createVehiculo);
router.put("/:id", putVehiculo);
router.patch("/:id", patchConductor);
router.delete("/:id", deleteVehiculo);
export default router;
