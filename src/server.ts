import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authorRoutes from "./routes/authorRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import { logger } from "./middleware/logger.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(logger);

app.use("/authors", authorRoutes);
app.use("/books", bookRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Library API running on http://localhost:${PORT}`));
 export default app;