require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const roles = ["ADMIN", "USER", "EDITOR"];

  for (const name of roles) {
    // Use findUnique by name (since @unique), then create if missing
    const existing = await prisma.role.findUnique({
      where: { name },
    });

    if (!existing) {
      await prisma.role.create({
        data: { name },
      });
      console.log(`Created role: ${name}`);
    } else {
      console.log(`Role already exists: ${name}`);
    }
  }

  console.log("Roles seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());