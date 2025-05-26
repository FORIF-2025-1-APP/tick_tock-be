import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("test1234", 10);

  //더미유저생성코드
  const user = await prisma.user.upsert({
    where: { email: "dummy@example.com" },
    update: {},
    create: {
      id: "bfc3efb4-1e9e-4a13-94b7-32d8d7123abc",
      email: "dummy@example.com",
      password: hashedPassword,
      nickname: "더미유저저",
    },
  });
  console.log("더미 유저 생성 완료:", user);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
