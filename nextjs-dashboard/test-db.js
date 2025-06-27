const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.POSTGRES_URL, { 
  ssl: 'require',
  connection_timeout: 30,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  max: 10,
  onnotice: () => {},
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful:', result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
