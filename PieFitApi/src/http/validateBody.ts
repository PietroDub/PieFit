import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { invalidRequest } from "./invalidRequest.js";

export function validateBody(schema: ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      res.status(400).json(
        invalidRequest(
          result.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        ),
      );
      return;
    }

    req.body = result.data;
    next();
  };
}
