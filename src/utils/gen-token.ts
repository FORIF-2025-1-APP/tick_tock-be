import jwt from "jsonwebtoken";

const token = jwt.sign(
  { userId: "bfc3efb4-1e9e-4a13-94b7-32d8d7123abc" }, // ✅ 실제 유저 ID로 바꿔주세요
  "supersecretkey123", // ⚠️ .env의 JWT_SECRET과 동일해야 함
  { expiresIn: "24h" }
);

console.log("✅ 개발용 토큰:\n", token);
