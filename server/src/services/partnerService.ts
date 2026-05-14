/**
 * ## server/src/services/partnerService.ts
 */
import { PartnerRepository } from '../repositories/partnerRepository';
import { v4 as uuidv4 } from 'uuid';

const repo = new PartnerRepository();

export class PartnerService {
  async getAllPartners() {
    return repo.findAll();
  }

  async createPartner(data: any) {
    const id = uuidv4();
    return repo.create({ id, ...data });
  }

  async updatePartner(id: string, data: any) {
    return repo.update(id, data);
  }

  async deletePartner(id: string) {
    return repo.hardDelete(id);
  }
}
