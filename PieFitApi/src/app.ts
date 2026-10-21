import cors from "cors";
import express from "express";
import helmet from "helmet";

import { invalidRequest } from "./http/invalidRequest.js";
import exerciseRoutes from "./routes/Exercise.routes.js";
import workoutPlanRoutes from "./routes/WorkoutPlan.routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use("/exercises", exerciseRoutes);
  app.use("/workout-plans", workoutPlanRoutes);

  app.use(
    (
      error: unknown,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (error instanceof SyntaxError && "status" in error && error.status === 400) {
        res.status(400).json(
          invalidRequest([
            {
              path: "body",
              message: "Request body must be JSON.",
            },
          ]),
        );
        return;
      }

      next(error);
    },
  );

  return app;
}
