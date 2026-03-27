export interface User {
  id_user: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  is_resident?: boolean;
  role: 'ADMIN' | 'USER' | 'MODERATEUR' | 'TUTORED';
  statut?: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
  created_at?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  mot_de_passe: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  telephone?: string;
  is_resident?: boolean;
}

export interface Bien {
  id_bien: string;
  nom: string;
  description?: string;
  estVisible: boolean;
  creerLe?: string;
  id_cat_bien?: string;
  nom_cat_bien?: string;
  // Propriétés calculées pour compatibilité
  id?: string;
  type?: string;
  capacite?: number;
  adresse?: string;
  disponible?: boolean;
  imageUrl?: string;
}

export interface Reservation {
  id_reservation: string;
  id_bien: string;
  id_user: string;
  id_groupe?: string;
  date_debut: string;
  date_fin: string;
  statut: 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE' | 'TERMINEE';
  statut_caution?: 'EN_ATTENTE' | 'VALIDEE' | 'REFUSEE';
  created_at?: string;
  motif?: string;
  nombrePersonnes?: number;
  bien?: Bien;
  user?: User;
  groupe?: Groupe;
}

export interface Groupe {
  id_groupe: string;
  nom: string;
  description?: string;
  type_groupe?: string;
  type_exoneration?: string;
  niveau_tarif?: number;
  creer_le?: string;
  membres?: GroupeMembre[];
}

export interface GroupeMembre {
  id: number;
  groupeId: number;
  userId: number;
  role: 'ADMIN' | 'MEMBRE';
  statut: 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE';
  joinedAt?: string;
  user?: User;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp?: string;
  path?: string;
}
