# 数据库种子脚本

这个文件夹包含了用于初始化数据库的种子脚本。

## 文件说明

- `seed.js` - 主要的种子脚本，用于创建数据库表并插入初始数据

## 使用方法

### 1. 设置环境变量

首先，您需要设置 PostgreSQL 数据库连接URL。创建一个 `.env.local` 文件在项目根目录：

```bash
# .env.local
POSTGRES_URL="postgres://username:password@localhost:5432/database_name"
```

对于云服务（如 Vercel Postgres），格式可能是：
```bash
POSTGRES_URL="postgres://default:password@ep-example-123456.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
```

### 2. 运行种子脚本

使用 npm 命令运行种子脚本：

```bash
npm run seed
```

或者直接运行：

```bash
node -r dotenv/config ./scripts/seed.js
```

### 3. 种子脚本功能

种子脚本会执行以下操作：

1. **创建用户表** (`users`)
   - 包含用户信息和加密密码
   - 创建默认测试用户

2. **创建客户表** (`customers`)
   - 包含客户信息和头像
   - 插入示例客户数据

3. **创建发票表** (`invoices`)
   - 包含发票信息和状态
   - 插入示例发票数据

4. **创建收入表** (`revenue`)
   - 包含月度收入数据
   - 插入示例收入统计

### 4. 数据库表结构

#### users 表
- `id` (UUID) - 主键
- `name` (VARCHAR) - 用户姓名
- `email` (TEXT) - 邮箱地址（唯一）
- `password` (TEXT) - 加密密码

#### customers 表
- `id` (UUID) - 主键
- `name` (VARCHAR) - 客户姓名
- `email` (VARCHAR) - 邮箱地址
- `image_url` (VARCHAR) - 头像URL

#### invoices 表
- `id` (UUID) - 主键
- `customer_id` (UUID) - 客户ID（外键）
- `amount` (INT) - 金额（以分为单位）
- `status` (VARCHAR) - 状态（'pending' 或 'paid'）
- `date` (DATE) - 发票日期

#### revenue 表
- `month` (VARCHAR) - 月份（唯一）
- `revenue` (INT) - 收入金额

### 5. 注意事项

- 脚本使用 `ON CONFLICT DO NOTHING` 来避免重复插入数据
- 密码会自动使用 bcrypt 进行加密
- 脚本会自动创建必要的 PostgreSQL 扩展（uuid-ossp）
- 支持 SSL 连接（适用于云数据库）

### 6. 故障排除

如果遇到连接错误：
1. 确保 `POSTGRES_URL` 环境变量正确设置
2. 确保数据库服务正在运行
3. 检查网络连接和防火墙设置
4. 验证数据库用户权限

如果遇到权限错误：
1. 确保数据库用户有创建表的权限
2. 确保数据库用户有插入数据的权限
3. 确保数据库用户有创建扩展的权限 