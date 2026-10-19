import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

import { connectDatabase } from "./Db/Conn.js";
import exerciseRoutes from "./routes/Exercise.routes.js";
import workoutPlanRoutes from "./routes/WorkoutPlan.routes.js";

dotenv.config();

const port = Number(process.env.PORT ?? 3001);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/exercises", exerciseRoutes);
app.use("/workout-plans", workoutPlanRoutes);

await connectDatabase();

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
