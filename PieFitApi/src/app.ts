import "dotenv/config";
import path from "node:path";
import { pathToFileURL } from "node:url";

import cors from "cors";
import express from "express";
import helmet from "helmet";

import { connectDatabase } from "./Db/Conn.js";
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

function isDirectRun(): boolean {
  const entry = process.argv[1];

  if (entry === undefined) {
    return false;
  }

  return import.meta.url === pathToFileURL(path.resolve(entry)).href;
}

if (isDirectRun()) {
  const port = Number(process.env.PORT ?? 3001);

  await connectDatabase();

  const app = createApp();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
