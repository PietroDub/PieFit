import type { Response } from "express";
import mongoose from "mongoose";

import { invalidRequest } from "./invalidRequest.js";

export function sendError(res: Response, error: unknown, fallbackMessage: string) {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json(
      invalidRequest(
        Object.values(error.errors).map((item) => ({
          path: item.path,
          message: item.message,
        })),
      ),
    );
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json(
      invalidRequest([
        {
          path: error.path === "_id" ? "id" : error.path,
          message: "Invalid id.",
        },
      ]),
    );
  }

  console.error(error);

  return res.status(500).json({
    message: fallbackMessage,
  });
}
