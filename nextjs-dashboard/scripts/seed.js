const bcrypt = require('bcrypt');
const postgres = require('postgres');

// 占位符数据
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const customers = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/customers/michael-novotny.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/customers/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/customers/balazs-orban.png',
  },
];

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  {
    customer_id: customers[4].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
  },
  {
    customer_id: customers[3].id,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10',
  },
  {
    customer_id: customers[5].id,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05',
  },
  {
    customer_id: customers[2].id,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16',
  },
  {
    customer_id: customers[0].id,
    amount: 666,
    status: 'pending',
    date: '2023-06-27',
  },
  {
    customer_id: customers[3].id,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09',
  },
  {
    customer_id: customers[4].id,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17',
  },
  {
    customer_id: customers[5].id,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07',
  },
  {
    customer_id: customers[1].id,
    amount: 500,
    status: 'paid',
    date: '2023-08-19',
  },
  {
    customer_id: customers[5].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03',
  },
  {
    customer_id: customers[2].id,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05',
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

// 初始化数据库连接
async function initializeDatabase() {
  // 从环境变量获取数据库连接URL
  const databaseUrl = process.env.POSTGRES_URL;
  
  if (!databaseUrl) {
    console.error('错误: 请设置 POSTGRES_URL 环境变量');
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { 
    ssl: 'require',
    max: 1, // 限制连接池大小
    idle_timeout: 20,
    connect_timeout: 60
  });
  
  try {
    console.log('正在连接数据库...');
    
    // 测试数据库连接
    await sql`SELECT 1`;
    console.log('✅ 数据库连接成功');
    
    return sql;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1);
  }
}

// 创建用户表并插入数据
async function seedUsers(sql) {
  console.log('🌱 正在创建用户表...');
  
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  console.log('正在插入用户数据...');
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  console.log(`✅ 成功插入 ${insertedUsers.length} 个用户`);
  return insertedUsers;
}

// 创建客户表并插入数据
async function seedCustomers(sql) {
  console.log('🌱 正在创建客户表...');
  
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  console.log('正在插入客户数据...');
  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  console.log(`✅ 成功插入 ${insertedCustomers.length} 个客户`);
  return insertedCustomers;
}

// 创建发票表并插入数据
async function seedInvoices(sql) {
  console.log('🌱 正在创建发票表...');
  
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  console.log('正在插入发票数据...');
  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  console.log(`✅ 成功插入 ${insertedInvoices.length} 个发票`);
  return insertedInvoices;
}

// 创建收入表并插入数据
async function seedRevenue(sql) {
  console.log('🌱 正在创建收入表...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  console.log('正在插入收入数据...');
  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  console.log(`✅ 成功插入 ${insertedRevenue.length} 个收入记录`);
  return insertedRevenue;
}

// 主函数
async function main() {
  console.log('🚀 开始数据库种子初始化...\n');
  
  let sql;
  
  try {
    // 初始化数据库连接
    sql = await initializeDatabase();
    
    // 执行所有种子操作 - 逐个执行避免连接问题
    console.log('开始执行种子操作...');
    await seedUsers(sql);
    await seedCustomers(sql);
    await seedInvoices(sql);
    await seedRevenue(sql);
    
    console.log('\n🎉 数据库种子初始化完成！');
    
  } catch (error) {
    console.error('\n❌ 种子初始化失败:', error.message);
    if (error.code === 'CONNECTION_CLOSED') {
      console.log('💡 提示: 数据库连接中断，这可能是网络问题或连接超时');
      console.log('请检查网络连接后重试');
    }
    process.exit(1);
  } finally {
    // 关闭数据库连接
    if (sql) {
      try {
        await sql.end();
        console.log('🔒 数据库连接已关闭');
      } catch (closeError) {
        console.log('⚠️ 关闭数据库连接时出现警告 (可忽略)');
      }
    }
  }
}

// 如果直接运行此脚本，执行主函数
if (require.main === module) {
  main();
}

module.exports = {
  seedUsers,
  seedCustomers,
  seedInvoices,
  seedRevenue,
  main
}; 