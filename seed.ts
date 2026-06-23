import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const dbPath = process.env.DATABASE_URL!.replace("file:", "");
const adapter = new PrismaBetterSqlite3({ url: dbPath });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(" Starting seeding...");

  try {
    const existing = await prisma.preorder.count();
    console.log(` Existing records: ${existing}`);

    if (existing > 0) {
      console.log(" Clearing existing data...");
      await prisma.preorder.deleteMany();
    }

    const sampleData = [
      {
        name: "Multi variant 3",
        products: 1,
        preorderWhen: "regardless-of-stock",
        startsAt: new Date("2025-12-15T20:24:00"),
        endsAt: null,
        status: "active",
      },
      {
        name: "Limited Edition Bundle",
        products: 5,
        preorderWhen: "in-stock",
        startsAt: new Date("2025-12-20T10:00:00"),
        endsAt: new Date("2026-01-15T23:59:59"),
        status: "active",
      },
      {
        name: "Early Bird Special",
        products: 3,
        preorderWhen: "regardless-of-stock",
        startsAt: new Date("2025-11-01T09:00:00"),
        endsAt: null,
        status: "inactive",
      },
    ];

    console.log(` Creating ${sampleData.length} records...`);

    for (const data of sampleData) {
      try {
        const result = await prisma.preorder.create({ data });
        console.log(` Created: ${result.name} (ID: ${result.id})`);
      } catch (error) {
        console.error(` Failed to create: ${data.name}`, error);
        throw error;
      }
    }

    const finalCount = await prisma.preorder.count();
    console.log(` Total records in database: ${finalCount}`);
    console.log(" Seeding completed successfully!");
  } catch (error) {
    console.error(" Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(" Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log(" Database connection closed.");
  });
