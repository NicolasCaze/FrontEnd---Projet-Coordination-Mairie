import api from '@/lib/api';
import { Reservation, PaginatedResponse } from '@/types';

export interface CreateReservationRequest {
  id_bien: string;
  id_user: string;
  id_groupe?: string;
  dateDebut: string;
  dateFin: string;
}

export const reservationService = {
  async getAll(params?: {
    page?: number;
    size?: number;
    statut?: string;
    userId?: string;
    bienId?: string;
  }): Promise<PaginatedResponse<Reservation>> {
    const response = await api.get<PaginatedResponse<Reservation>>('/reservations', { params });
    return response.data;
  },

  async getById(id: string): Promise<Reservation> {
    const response = await api.get<Reservation>(`/reservations/${id}`);
    return response.data;
  },

  async getMyReservations(params?: {
    page?: number;
    size?: number;
    statut?: string;
  }): Promise<PaginatedResponse<Reservation>> {
    const response = await api.get<PaginatedResponse<Reservation>>('/reservations/my', { params });
    return response.data;
  },

  async create(data: CreateReservationRequest): Promise<Reservation> {
    const response = await api.post<Reservation>('/reservations', data);
    return response.data;
  },

  async update(id: string, data: Partial<Reservation>): Promise<Reservation> {
    const response = await api.put<Reservation>(`/reservations/${id}`, data);
    return response.data;
  },

  async cancel(id: string): Promise<void> {
    await api.delete(`/reservations/${id}`);
  },

  async confirm(id: string): Promise<Reservation> {
    const response = await api.post<Reservation>(`/reservations/${id}/confirm`);
    return response.data;
  },

  async reject(id: string, reason?: string): Promise<Reservation> {
    const response = await api.post<Reservation>(`/reservations/${id}/reject`, { reason });
    return response.data;
  },
};
