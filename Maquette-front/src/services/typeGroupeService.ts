import api from "@/lib/api";

export interface TypeGroupe {
  id_type_groupe: string;
  nom: string;
  description?: string;
  createdAt?: string;
}

export const typeGroupeService = {
  getAll: async (): Promise<TypeGroupe[]> => {
    const response = await api.get("/type-groupes");
    return response.data;
  },

  getById: async (id: string): Promise<TypeGroupe> => {
    const response = await api.get(`/type-groupes/${id}`);
    return response.data;
  },

  create: async (typeGroupe: Omit<TypeGroupe, "id_type_groupe" | "createdAt">): Promise<TypeGroupe> => {
    const response = await api.post("/type-groupes", typeGroupe);
    return response.data;
  },

  update: async (id: string, typeGroupe: Omit<TypeGroupe, "id_type_groupe" | "createdAt">): Promise<TypeGroupe> => {
    const response = await api.put(`/type-groupes/${id}`, typeGroupe);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/type-groupes/${id}`);
  },
};
