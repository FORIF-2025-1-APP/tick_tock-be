import express from "express";
import authRoutes from "./routes/auth.route";
import calendarRouter from "./routes/calendar.route";
import todoRouter from "./routes/todo.route";
import userRouter from "./routes/user.route";
import friendRouter from "./routes/friend.route";
import categoryRouter from "./routes/category.route";
import { authenticate } from "./middleware/auth";

import { setupSwagger } from "./swagger";

const app = express();
app.use(express.json());
app.use(authenticate); // 모든 요청에 대해 인증 적용

app.use("/api/auth", authRoutes);
app.use("/api", calendarRouter); //캘린더?
app.use("/api", todoRouter);
app.use("/api", userRouter);
app.use("/api", friendRouter);
app.use("/api", categoryRouter);

setupSwagger(app);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
  console.log("📘 Swagger docs: http://localhost:3000/api-docs");
});
