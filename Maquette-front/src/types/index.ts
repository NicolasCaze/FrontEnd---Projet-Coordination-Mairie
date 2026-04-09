export interface User {
  id_user: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  is_resident?: boolean;
  niveau_tarif?: number;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'MODERATEUR' | 'TUTORED' | 'SECRETARY';
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

export interface Tarif {
  id_tarif?: string;
  id_bien?: string;
  niveau_1: number;
  niveau_2: number;
  niveau_3: number;
  niveau_4: number;
  niveau_5: number;
  creerLe?: string;
}

export interface Bien {
  id_bien: string;
  nom: string;
  description?: string;
  estVisible: boolean;
  creerLe?: string;
  id_cat_bien?: string;
  nom_cat_bien?: string;
  tarif?: Tarif;
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
  prix?: number;
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
  id_user: string;
  nom: string;
  prenom: string;
  email: string;
  roleGroupe: 'ADMIN' | 'MEMBRE';
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
