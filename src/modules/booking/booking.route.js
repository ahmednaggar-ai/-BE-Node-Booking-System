import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware.js";
import {
  mongoIdParams,
  paginationQuery,
} from "../../common/validators/common.validator.js";
import {
  createBookingSchema,
  getUserBookingsQuery,
  updateBookingSchema,
} from "./booking.validator.js";
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getUserBookings,
  updateBooking,
} from "./booking.controller.js";
import { authenticate } from "../../common/middleware/auth.middleware.js";
// import { createBooking, getBooking, updateBooking, deleteBooking, listBookings } from "./booking.controller.js";

const router = Router();

router.use(authenticate);

router.post("/create", validate({ body: createBookingSchema }), createBooking);
router.get("/", validate({ query: paginationQuery }) /* listBookings */);
router.get(
  "/getUserBookings",
  validate({ query: getUserBookingsQuery }),
  getUserBookings,
);
router.get("/:id", validate({ params: mongoIdParams }), getBookingById);
router.patch(
  "/:id",
  validate({
    params: mongoIdParams,
    body: updateBookingSchema,
  }),
  updateBooking,
);
router.delete("/:id", validate({ params: mongoIdParams }), cancelBooking);

export default router;
