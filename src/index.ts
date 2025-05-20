import express from "express";
import authRoutes from "./routes/auth.route";
import calendarRouter from "./routes/calendar.route";

import { setupSwagger } from "./swagger";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", calendarRouter);

setupSwagger(app);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
  console.log("📘 Swagger docs: http://localhost:3000/api-docs");
});
