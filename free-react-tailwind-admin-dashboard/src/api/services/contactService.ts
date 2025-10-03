import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { ContactInquiry } from '../types/contact.types';

class ContactService {
  async getContacts(): Promise<ContactInquiry[]> {
    const response = await apiClient.get<ContactInquiry[]>(ENDPOINTS.CONTACT);
    return Array.isArray(response) ? response : [];
  }
}

export const contactService = new ContactService();
export default contactService;
