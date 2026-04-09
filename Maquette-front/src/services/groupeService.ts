import api from '@/lib/api';
import { Groupe, GroupeMembre, PaginatedResponse } from '@/types';

export interface CreateGroupeRequest {
  nom: string;
  description?: string;
}

export const groupeService = {
  async getAll(params?: {
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Groupe>> {
    const response = await api.get<PaginatedResponse<Groupe>>('/groupes', { params });
    return response.data;
  },

  async getById(id: string): Promise<Groupe> {
    const response = await api.get<Groupe>(`/groupes/${id}`);
    return response.data;
  },

  async getMyGroups(): Promise<Groupe[]> {
    const response = await api.get<Groupe[]>('/groupes/my');
    return response.data;
  },

  async create(data: CreateGroupeRequest): Promise<Groupe> {
    const response = await api.post<Groupe>('/groupes', data);
    return response.data;
  },

  async update(id: string, data: Partial<Groupe>): Promise<Groupe> {
    const response = await api.put<Groupe>(`/groupes/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/groupes/${id}`);
  },

  async getMembers(groupeId: string): Promise<GroupeMembre[]> {
    const response = await api.get<GroupeMembre[]>(`/groupes/${groupeId}/membres`);
    return response.data;
  },

  async addMember(groupeId: string, userId: string): Promise<GroupeMembre> {
    const response = await api.post<GroupeMembre>(`/groupes/${groupeId}/membres`, { userId });
    return response.data;
  },

  async removeMember(groupeId: string, membreId: string): Promise<void> {
    await api.delete(`/groupes/${groupeId}/membres/${membreId}`);
  },

  async acceptMember(groupeId: string, membreId: string): Promise<GroupeMembre> {
    const response = await api.post<GroupeMembre>(`/groupes/${groupeId}/membres/${membreId}/accept`);
    return response.data;
  },

  async rejectMember(groupeId: string, membreId: string): Promise<void> {
    await api.post(`/groupes/${groupeId}/membres/${membreId}/reject`);
  },

  async getPendingRequests(groupeId: string): Promise<GroupeMembre[]> {
    const response = await api.get<GroupeMembre[]>(`/groupes/${groupeId}/membres/pending`);
    return response.data;
  },

  async joinGroup(groupeId: string): Promise<GroupeMembre> {
    const response = await api.post<GroupeMembre>(`/groupes/${groupeId}/join`);
    return response.data;
  },

  async leaveGroup(groupeId: string): Promise<void> {
    await api.post(`/groupes/${groupeId}/leave`);
  },

  async joinGroupByCode(codeInvitation: string): Promise<GroupeMembre> {
    const response = await api.post<GroupeMembre>('/groupes/join-by-code', { codeInvitation });
    return response.data;
  },
};
