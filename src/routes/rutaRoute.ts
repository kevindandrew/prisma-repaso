import { Router } from "express";
import {
  createRutas,
  deleteRutas,
  getRutas,
  getRutasById,
  putRutas,
} from "../controllers/rutaController";
const router = Router();

router.get("/", getRutas);
router.get("/:id", getRutasById);
router.post("/", createRutas);
router.put("/:id", putRutas);
router.delete("/:id", deleteRutas);
export default router;
