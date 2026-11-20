import { Router } from "express";
import {
  getUsers,
  getUserById,
  putUser,
  deleteUser,
} from "../controllers/userController";
import { authorize } from "../middlewares/authorize.middleware";
import { verifyToken } from "../middlewares/auth.middleware";
const router = Router();

router.get("/", verifyToken, authorize("ADMIN"), getUsers);
router.get("/:id", getUserById);
router.put("/:id", putUser);
router.delete("/:id", deleteUser);

export default router;
