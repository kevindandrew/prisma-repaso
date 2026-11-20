import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
