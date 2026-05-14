/**
 * ## server/src/services/userService.ts
 */
import { UserRepository } from '../repositories/userRepository';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import AppError from '../utils/AppError';

const repo = new UserRepository();

export class UserService {
  async getAllUsers() {
    const users = await repo.findAll();
    return users.map(u => {
      const { password_hash, ...rest } = u;
      return rest;
    });
  }

  async getUserById(id: string) {
    const user = await repo.findById(id);
    if (!user) throw new AppError('User tidak ditemukan', 404, 'NOT_FOUND');
    const { password_hash, ...rest } = user;
    return rest;
  }

  async createUser(data: any) {
    const existing = await repo.findByUsername(data.username);
    if (existing) throw new AppError('Username sudah digunakan', 400, 'DUPLICATE_USERNAME');

    const id = uuidv4();
    const password_hash = await bcrypt.hash(data.password, 10);
    const { password, ...userData } = data;
    
    await repo.create({ id, ...userData, password_hash });
    return this.getUserById(id);
  }

  async updateUser(id: string, data: any) {
    const { password, ...updateData } = data;
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }
    await repo.update(id, updateData);
    return this.getUserById(id);
  }

  async deleteUser(id: string) {
    return repo.hardDelete(id);
  }
}
