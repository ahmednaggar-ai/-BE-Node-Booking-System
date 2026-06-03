import { z } from "zod";
import { objectId } from "../../common/validators/common.validator.js";

const bookingStatus = z.enum(["pending", "confirmed", "cancelled"]);

export const createBookingSchema = z.object({
    userId: objectId,
    title: z.string().trim().min(1, "Title is required"),
    bookingDate: z.coerce.date({ message: "Invalid booking date" }),
    status: bookingStatus.optional(),
});

export const updateBookingSchema = z.object({
    status: z.enum(["pending", "confirmed"], {
        error: "Status must be pending or confirmed",
    }),
});

export const getUserBookingsQuery = z
    .object({
        status: bookingStatus.optional(),
        sort: z.enum(["bookingDate"]).optional(),
        order: z.enum(["asc", "desc"]).optional(),
        search: z.string().trim().min(1, "Search term is required").optional(),
    })
    .refine((data) => !data.order || data.sort, {
        message: "order requires sort=bookingDate",
        path: ["order"],
    });
