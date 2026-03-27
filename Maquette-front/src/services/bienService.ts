import api from '@/lib/api';
import { Bien, PaginatedResponse } from '@/types';

export const bienService = {
  async getAll(params?: {
    page?: number;
    size?: number;
    disponible?: boolean;
    type?: string;
  }): Promise<PaginatedResponse<Bien>> {
    const response = await api.get<PaginatedResponse<Bien>>('/biens', { params });
    return response.data;
  },

  async getById(id: string): Promise<Bien> {
    const response = await api.get<Bien>(`/biens/${id}`);
    return response.data;
  },

  async create(data: Omit<Bien, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bien> {
    const response = await api.post<Bien>('/biens', data);
    return response.data;
  },

  async update(id: string, data: Partial<Bien>): Promise<Bien> {
    const response = await api.put<Bien>(`/biens/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/biens/${id}`);
  },

  async checkAvailability(
    bienId: string,
    dateDebut: string,
    dateFin: string
  ): Promise<boolean> {
    const response = await api.get<boolean>(`/biens/${bienId}/availability`, {
      params: { dateDebut, dateFin },
    });
    return response.data;
  },
};
