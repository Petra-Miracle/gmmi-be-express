import "dotenv/config";
import pkg from "./generated/prisma/index.js";

const { PrismaClient } = pkg;
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function testConnection() {
  console.log("🔄 Testing database connection...\n");
  console.log(
    `DATABASE_URL: ${process.env.DATABASE_URL?.replace(/\/\/.*@/, "//***:***@")}\n`,
  );

  try {
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log("✅ Database connection successful!\n");

    // Get database version
    const version = await prisma.$queryRaw`SELECT version()`;
    console.log(`📦 DB Version: ${version[0].version}\n`);

    // Count tables by checking a few models
    const counts = await Promise.allSettled([
      prisma.users.count(),
      prisma.admins.count(),
      prisma.jemaat.count(),
      prisma.pewartaan.count(),
      prisma.warta_ibadah.count(),
      prisma.announcements.count(),
      prisma.sectors.count(),
      prisma.agenda.count(),
    ]);

    const tableNames = [
      "users",
      "admins",
      "jemaat",
      "pewartaan",
      "warta_ibadah",
      "announcements",
      "sectors",
      "agenda",
    ];

    console.log("📊 Table row counts:");
    console.log("─".repeat(35));
    counts.forEach((result, i) => {
      if (result.status === "fulfilled") {
        console.log(`  ${tableNames[i].padEnd(20)} : ${result.value}`);
      } else {
        console.log(
          `  ${tableNames[i].padEnd(20)} : ❌ ${result.reason.message}`,
        );
      }
    });
    console.log("─".repeat(35));
    console.log("\n✅ All checks passed!");
  } catch (error) {
    console.error("❌ Database connection failed!\n");
    console.error(`Error: ${error.message}\n`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
