import "dotenv/config";
import { createRequire } from "module";
import pkg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("../generated/prisma");

const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
