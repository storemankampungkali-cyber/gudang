/**
 * ## server/src/repositories/partnerRepository.ts
 */
import { BaseRepository } from './baseRepository';

export class PartnerRepository extends BaseRepository {
  constructor() {
    super('partners');
  }
}
