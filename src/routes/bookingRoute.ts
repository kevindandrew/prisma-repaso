import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  patchPago,
  putBooking,
} from "../controllers/bookingController";
const router = Router();

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.put("/:id", putBooking);
router.patch("/:id/pago", patchPago);
router.delete("/:id", deleteBooking);

export default router;
