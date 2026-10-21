import dotenv from "dotenv";

import { createApp } from "./app.js";
import { connectDatabase } from "./Db/Conn.js";

dotenv.config();

const port = Number(process.env.PORT ?? 3001);
const app = createApp();

await connectDatabase();

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
