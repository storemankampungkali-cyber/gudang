/**
 * ## server/src/services/authService.ts
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BaseRepository } from '../repositories/baseRepository';
import AppError from '../utils/AppError';
import { v4 as uuidv4 } from 'uuid';

const userRepo = new BaseRepository('users');

export class AuthService {
  async login(username, password) {
    const user = await userRepo.findOne({ username });
    if (!user) {
      throw new AppError('Username atau password salah', 401, 'INVALID_CREDENTIALS');
    }

    if (user.status !== 'ACTIVE') {
      throw new AppError('Akun dinonaktifkan', 403, 'ACCOUNT_DISABLED');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError('Username atau password salah', 401, 'INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'supersecretjwtkey123',
      { expiresIn: '8h' }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      }
    };
  }

  async getMe(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new AppError('User tidak ditemukan', 404, 'NOT_FOUND');
    
    return {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      status: user.status
    };
  }
  
  // For seed purposes or initial setup
  async createUser(data: any) {
    const id = uuidv4();
    const password_hash = await bcrypt.hash(data.password, 10);
    const user = {
      id,
      username: data.username,
      password_hash,
      full_name: data.full_name,
      role: data.role || 'STAFF',
      status: 'ACTIVE'
    };
    return userRepo.create(user);
  }
}
