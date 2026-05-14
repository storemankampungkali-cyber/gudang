/**
 * ## server/src/repositories/userRepository.ts
 */
import { BaseRepository } from './baseRepository';

export class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  async findByUsername(username: string) {
    const results = await this.query(
      `SELECT * FROM ${this.tableName} WHERE username = ? LIMIT 1`,
      [username]
    );
    return results[0] || null;
  }
}
