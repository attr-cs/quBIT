require("dotenv").config()

const {PrismaClient} = require("@prisma/client");
const { PrismaPg} = require("@prisma/adapter-pg");
const {Pool} = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
    console.error('Unexpected pool error:', err);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter});

// Test connection on startup
prisma.$connect()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));

module.exports = prisma;