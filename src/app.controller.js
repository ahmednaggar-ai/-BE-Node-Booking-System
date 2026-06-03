import express from "express";
import { env } from "../config/env.service.js";
import { successResponse } from "./common/responses/success.response.js";
import { globalErrorHandler } from "./common/responses/error.response.js";
import { connectDB } from "./database/connection.js";
import userRoutes from "./modules/user/user.route.js";
import bookingRoutes from "./modules/booking/booking.route.js";

export const bootstrap = () => {
  const app = express();

  app.use(express.json());

  app.get("/health", (req, res) => {
    successResponse(res, 200, "Server is running", data);
  });

  app.use("/api/user", userRoutes);
  app.use("/api/booking", bookingRoutes);

  connectDB();

  // handle wrong routes
  app.use("{*dummyRoute}", (req, res) => {
    res
      .status(404)
      .json({
        message: "it seems this route is not found",
        status: "error",
        data: null,
      });
  });

  app.use(globalErrorHandler);

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
};
