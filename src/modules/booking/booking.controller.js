import { successResponse } from "../../common/responses/success.response.js";
import { errorResponse } from "../../common/responses/error.response.js";
import { BookingModel } from "../../database/models/booking.model.js";
const createBooking = async (req, res, next) => {
  try {
    let { userId, title, bookingDate } = req.body;
    let booking = await BookingModel.create({
      userId,
      title,
      bookingDate,
      status: "pending",
    });
    return successResponse(res, 201, "Booking created successfully", booking);
  } catch (error) {
    next(error);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const { status, sort, order, search } = req.validatedQuery ?? {};

    const filter = { userId: req.userId };
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    let query = BookingModel.find(filter);

    if (sort === "bookingDate") {
      query = query.sort({ bookingDate: order === "desc" ? -1 : 1 });
    }

    const bookings = await query;
    return successResponse(res, 200, "Bookings fetched successfully", bookings);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    let { id } = req.params;
    let booking = await BookingModel.findById(id);
    if (!booking) {
      return errorResponse(res, 404, "Booking not found", null);
    }
    return successResponse(res, 200, "Booking fetched successfully", booking);
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await BookingModel.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return errorResponse(res, 404, "Booking not found", null);
    }

    return successResponse(res, 200, "Booking updated successfully", booking);
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await BookingModel.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { status: "cancelled" },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return errorResponse(res, 404, "Booking not found", null);
    }

    return successResponse(res, 200, "Booking cancelled successfully", booking);
  } catch (error) {
    next(error);
  }
};

export { createBooking, getUserBookings, getBookingById, updateBooking, cancelBooking };
