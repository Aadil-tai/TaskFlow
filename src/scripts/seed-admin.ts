import "dotenv/config";
import { Role } from "../../generated/prisma/enums.js";
import { prisma } from "../config/db.js";
import { hashPassword } from "../utils/hash.js";

const email = process.env.ADMIN_EMAIL ?? "admin@taskflow.dev";
const password = process.env.ADMIN_PASSWORD ?? "Admin@12345";

async function main() {
  const passwordHash = await hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: Role.ADMIN,
      deletedAt: null,
    },
    create: {
      name: "TaskFlow Admin",
      email,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log(`Admin account ready: ${admin.email} (${admin.role})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
