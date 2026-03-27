// Types
export type ResourceType = "room" | "equipment";

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  capacity?: number;
  description: string;
  image: string;
  available: boolean;
  pricePerDay?: number;
  paperNeeded?: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  hasAccount: boolean; // true = autonomous, false = supervised
  groupIds: string[];
  exemptions: {
    association: boolean;
    social: boolean;
    elected: boolean;
    dispense: boolean;
    justificatif: boolean;
    caution: boolean;
  };
  role: "utilisateur" | "admin-groupe" | "admin-conseil" | "super-admin";
}

export interface GroupExemptions {
  dispense: boolean;
  justificatif: boolean;
  caution: boolean;
}

export interface Group {
  id: string;
  code: string;
  name: string;
  type: "service" | "association" | "team" | "council";
  description: string;
  exemptions: GroupExemptions;
}

export interface Booking {
  id: string;
  resourceId: string;
  userId: string;
  groupId?: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected" | "completed";
  paymentStatus: "none" | "required" | "paid" | "exempt";
  depositStatus?: "required" | "paid" | "exempt";
  notes?: string;
  createdAt: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  fileName: string;
  uploadDate: string;
  type: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  adminId: string;
  targetUserId: string;
  action: string;
  details: string;
}

// Mock Data
export const mockResources: Resource[] = [
  {
    id: "1",
    name: "Salle des Fêtes",
    type: "room",
    capacity: 200,
    description: "Grande salle pour événements, mariages, et célébrations",
    image: "https://images.unsplash.com/photo-1519167758481-83f29da8787d",
    available: true,
    pricePerDay: 150,
    paperNeeded: true,
  },
  {
    id: "2",
    name: "Salle de Réunion",
    type: "room",
    capacity: 30,
    description: "Salle équipée pour réunions et conférences",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    available: true,
    pricePerDay: 50,
    paperNeeded: false,
  },
  {
    id: "3",
    name: "Salle Polyvalente",
    type: "room",
    capacity: 100,
    description: "Salle modulable pour ateliers et activités",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
    available: true,
    pricePerDay: 80,
    paperNeeded: true,
  },
  {
    id: "4",
    name: "Chaises (lot de 50)",
    type: "equipment",
    description: "Chaises pliantes pour événements",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657",
    available: true,
    pricePerDay: 20,
    paperNeeded: false,
  },
  {
    id: "5",
    name: "Tables (lot de 10)",
    type: "equipment",
    description: "Tables rectangulaires pour réceptions",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200",
    available: true,
    pricePerDay: 30,
    paperNeeded: false,
  },
  {
    id: "6",
    name: "Sono Portable",
    type: "equipment",
    description: "Système de sonorisation avec microphones",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04",
    available: true,
    pricePerDay: 40,
    paperNeeded: true,
  },
];

const defaultExemptions: GroupExemptions = { dispense: false, justificatif: false, caution: false };

export const mockGroups: Group[] = [
  {
    id: "g1",
    code: "GRP-001",
    name: "Conseil Municipal",
    type: "council",
    description: "Membres du conseil municipal",
    exemptions: { ...defaultExemptions, dispense: true },
  },
  {
    id: "g2",
    code: "GRP-002",
    name: "Association Sportive",
    type: "association",
    description: "Association locale de sports",
    exemptions: { ...defaultExemptions },
  },
  {
    id: "g3",
    code: "GRP-003",
    name: "Service Culturel",
    type: "service",
    description: "Service culturel de la mairie",
    exemptions: { ...defaultExemptions, justificatif: true },
  },
  {
    id: "g4",
    code: "GRP-004",
    name: "Comité des Fêtes",
    type: "association",
    description: "Organisation des événements locaux",
    exemptions: { ...defaultExemptions, caution: true },
  },
];

export const mockUsers: User[] = [
  {
    id: "u1",
    email: "utilisateur@email.com",
    firstName: "Utilisateur",
    lastName: "",
    phone: "0612345678",
    hasAccount: true,
    groupIds: ["g2"],
    exemptions: { association: false, social: false, elected: false, dispense: false, justificatif: false, caution: false },
    role: "utilisateur",
  },
  {
    id: "u2",
    email: "marie.martin@email.com",
    firstName: "Marie",
    lastName: "Martin",
    phone: "0623456789",
    hasAccount: true,
    groupIds: ["g2"],
    exemptions: { association: true, social: false, elected: false, dispense: false, justificatif: false, caution: false },
    role: "utilisateur",
  },
  {
    id: "u3",
    email: "super-admin@mairie.fr",
    firstName: "Super-Admin",
    lastName: "",
    phone: "0634567890",
    hasAccount: true,
    groupIds: ["g1"],
    exemptions: { association: false, social: false, elected: true, dispense: true, justificatif: false, caution: false },
    role: "super-admin",
  },
  {
    id: "u4",
    email: "admin-groupe@mairie.fr",
    firstName: "Admin-Groupe",
    lastName: "",
    phone: "0645678901",
    hasAccount: true,
    groupIds: [],
    exemptions: { association: false, social: false, elected: false, dispense: false, justificatif: false, caution: false },
    role: "admin-groupe",
  },
  {
    id: "u5",
    email: "",
    firstName: "Luc",
    lastName: "Moreau",
    phone: "0656789012",
    hasAccount: false,
    groupIds: [],
    exemptions: { association: false, social: true, elected: false, dispense: true, justificatif: false, caution: false },
    role: "utilisateur",
  },
  {
    id: "u6",
    email: "admin-conseil@mairie.fr",
    firstName: "Admin-Conseil",
    lastName: "",
    phone: "0667890123",
    hasAccount: true,
    groupIds: [],
    exemptions: { association: false, social: false, elected: false, dispense: false, justificatif: false, caution: false },
    role: "admin-conseil",
  },
];

export const mockBookings: Booking[] = [
  {
    id: "b1",
    resourceId: "1",
    userId: "u1",
    startDate: "2026-04-15",
    endDate: "2026-04-15",
    status: "approved",
    paymentStatus: "paid",
    notes: "Mariage familial",
    createdAt: "2026-03-10T10:00:00Z",
  },
  {
    id: "b2",
    resourceId: "2",
    userId: "u2",
    groupId: "g2",
    startDate: "2026-03-28",
    endDate: "2026-03-28",
    status: "approved",
    paymentStatus: "exempt",
    notes: "Réunion association",
    createdAt: "2026-03-15T14:30:00Z",
  },
  {
    id: "b3",
    resourceId: "4",
    userId: "u3",
    groupId: "g1",
    startDate: "2026-04-01",
    endDate: "2026-04-02",
    status: "pending",
    paymentStatus: "exempt",
    notes: "Événement municipal",
    createdAt: "2026-03-20T09:15:00Z",
  },
];

export const mockAuditLog: AuditEntry[] = [
  {
    id: "a1",
    timestamp: "2026-03-22T10:30:00Z",
    adminId: "u4",
    targetUserId: "u5",
    action: "CREATE_BOOKING",
    details: "Création d'une réservation pour compte sous tutelle",
  },
  {
    id: "a2",
    timestamp: "2026-03-21T15:45:00Z",
    adminId: "u3",
    targetUserId: "u5",
    action: "UPDATE_USER",
    details: "Activation de l'exonération sociale",
  },
  {
    id: "a3",
    timestamp: "2026-03-20T11:20:00Z",
    adminId: "u4",
    targetUserId: "u2",
    action: "APPROVE_BOOKING",
    details: "Validation de la réservation b2",
  },
];
