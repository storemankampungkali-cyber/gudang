/**
 * ## seed.ts
 * Database initialization script
 */
import { getPool } from './server/src/config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

async function seed() {
  const pool = getPool();
  console.log('🌱 Starting database seeding...');

  try {
     // 1. Create tables
     await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id CHAR(36) PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          full_name VARCHAR(100) NOT NULL,
          role ENUM('ADMIN','MANAGER','STAFF') DEFAULT 'STAFF',
          status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
     `);

     await pool.query(`
        CREATE TABLE IF NOT EXISTS warehouses (
          id CHAR(36) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          location TEXT,
          pic VARCHAR(100),
          phone VARCHAR(20),
          is_active BOOLEAN DEFAULT TRUE
        )
     `);

     await pool.query(`
        CREATE TABLE IF NOT EXISTS items (
          id CHAR(36) PRIMARY KEY,
          code VARCHAR(50) NOT NULL UNIQUE,
          name VARCHAR(150) NOT NULL,
          category VARCHAR(50),
          base_unit VARCHAR(20) NOT NULL,
          min_stock INT DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
     `);

     await pool.query(`
        CREATE TABLE IF NOT EXISTS item_units (
          id INT AUTO_INCREMENT PRIMARY KEY,
          item_id CHAR(36) NOT NULL,
          unit_name VARCHAR(20) NOT NULL,
          conversion_ratio DECIMAL(10,4) NOT NULL,
          operator ENUM('*','/') DEFAULT '*',
          FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
          UNIQUE(item_id, unit_name)
        )
     `);

     await pool.query(`
        CREATE TABLE IF NOT EXISTS stock (
          warehouse_id CHAR(36) NOT NULL,
          item_id CHAR(36) NOT NULL,
          qty DECIMAL(15,4) DEFAULT 0,
          PRIMARY KEY (warehouse_id, item_id),
          FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
          FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
        )
     `);

     await pool.query(`
        CREATE TABLE IF NOT EXISTS partners (
          id CHAR(36) PRIMARY KEY,
          type ENUM('SUPPLIER','CUSTOMER') NOT NULL,
          name VARCHAR(100) NOT NULL,
          phone VARCHAR(20),
          email VARCHAR(100),
          address TEXT,
          npwp VARCHAR(50),
          term_days INT DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          INDEX idx_partner_type (type)
        )
     `);

     await pool.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id CHAR(36) PRIMARY KEY,
          date DATE NOT NULL,
          reference_no VARCHAR(50) NOT NULL UNIQUE,
          delivery_order_no VARCHAR(50),
          type ENUM('IN','OUT','TRANSFER','ADJUSTMENT', 'REJECT') NOT NULL,
          source_warehouse_id CHAR(36) NOT NULL,
          target_warehouse_id CHAR(36),
          partner_id CHAR(36),
          notes TEXT,
          created_by CHAR(36),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (source_warehouse_id) REFERENCES warehouses(id),
          FOREIGN KEY (target_warehouse_id) REFERENCES warehouses(id),
          FOREIGN KEY (partner_id) REFERENCES partners(id),
          FOREIGN KEY (created_by) REFERENCES users(id),
          INDEX idx_transaction_date (date),
          INDEX idx_transaction_type (type)
        )
     `);

     await pool.query(`
        CREATE TABLE IF NOT EXISTS transaction_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          transaction_id CHAR(36) NOT NULL,
          item_id CHAR(36) NOT NULL,
          qty DECIMAL(15,4) NOT NULL,
          unit VARCHAR(20) NOT NULL,
          conversion_ratio DECIMAL(10,4) DEFAULT 1,
          note VARCHAR(255),
          FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
          FOREIGN KEY (item_id) REFERENCES items(id),
          INDEX idx_tx_item (item_id)
        )
     `);

     await pool.query(`
        CREATE TABLE IF NOT EXISTS reject_batches (
          id CHAR(36) PRIMARY KEY,
          date DATE NOT NULL,
          reference_no VARCHAR(50) NOT NULL UNIQUE,
          warehouse_id CHAR(36) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
     `);

     await pool.query(`
        CREATE TABLE IF NOT EXISTS reject_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          batch_id CHAR(36) NOT NULL,
          item_id CHAR(36) NOT NULL,
          qty DECIMAL(15,4) NOT NULL,
          reason TEXT,
          FOREIGN KEY (batch_id) REFERENCES reject_batches(id) ON DELETE CASCADE
        )
     `);

     // 2. Seed Admin User
     const adminUser = 'admin';
     const [rows]: any = await pool.query('SELECT id FROM users WHERE username = ?', [adminUser]);
     
     if (rows.length === 0) {
       const passwordHash = await bcrypt.hash('admin123', 10);
       await pool.query(
         'INSERT INTO users (id, username, password_hash, full_name, role, status) VALUES (?, ?, ?, ?, ?, ?)',
         [uuidv4(), adminUser, passwordHash, 'Administrator GudangPro', 'ADMIN', 'ACTIVE']
       );
       console.log('✅ Admin user created: admin / admin123');
     } else {
       console.log('ℹ️ Admin user already exists');
     }

     console.log('✨ Data seeding completed successfully');
     process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
