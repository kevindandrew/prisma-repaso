import { Router } from "express";
import {
  getUsers,
  createUser,
  getUserById,
  putUser,
  deleteUser,
} from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", putUser);
router.delete("/:id", deleteUser);

export default router;
