export interface GroupMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin-conseil" | "admin-groupe" | "utilisateur";
}

export interface GroupPendingRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  requestedAt: string;
}

export const mockGroupMembers: Record<string, GroupMember[]> = {
  g1: [
    { id: "u3", firstName: "Super-Admin", lastName: "", email: "super-admin@mairie.fr", role: "admin-conseil" },
    { id: "u6", firstName: "Admin-Conseil", lastName: "", email: "admin-conseil@mairie.fr", role: "admin-conseil" },
    { id: "m1", firstName: "Jacques", lastName: "Durand", email: "j.durand@email.com", role: "utilisateur" },
  ],
  g2: [
    { id: "u6", firstName: "Admin-Conseil", lastName: "", email: "admin-conseil@mairie.fr", role: "admin-conseil" },
    { id: "u4", firstName: "Admin-Groupe", lastName: "", email: "admin-groupe@mairie.fr", role: "admin-groupe" },
    { id: "u1", firstName: "Utilisateur", lastName: "", email: "utilisateur@email.com", role: "utilisateur" },
    { id: "m2", firstName: "Marie", lastName: "Martin", email: "marie.martin@email.com", role: "utilisateur" },
    { id: "m3", firstName: "Lucas", lastName: "Simon", email: "lucas.simon@email.com", role: "utilisateur" },
  ],
  g3: [
    { id: "u6", firstName: "Admin-Conseil", lastName: "", email: "admin-conseil@mairie.fr", role: "admin-conseil" },
    { id: "m4", firstName: "Sophie", lastName: "Leclerc", email: "s.leclerc@email.com", role: "utilisateur" },
  ],
  g4: [
    { id: "u6", firstName: "Admin-Conseil", lastName: "", email: "admin-conseil@mairie.fr", role: "admin-conseil" },
    { id: "m5", firstName: "Paul", lastName: "Morin", email: "p.morin@email.com", role: "utilisateur" },
    { id: "m6", firstName: "Céline", lastName: "Garnier", email: "c.garnier@email.com", role: "utilisateur" },
  ],
};

export const mockGroupPending: Record<string, GroupPendingRequest[]> = {
  g1: [],
  g2: [
    { id: "r1", firstName: "Alice", lastName: "Renard", email: "alice.renard@email.com", requestedAt: "2026-03-20" },
    { id: "r2", firstName: "Marc", lastName: "Petit", email: "marc.petit@email.com", requestedAt: "2026-03-22" },
    { id: "r3", firstName: "Lucie", lastName: "Blanc", email: "lucie.blanc@email.com", requestedAt: "2026-03-24" },
  ],
  g3: [
    { id: "r4", firstName: "Hugo", lastName: "Favre", email: "h.favre@email.com", requestedAt: "2026-03-23" },
    { id: "r5", firstName: "Emma", lastName: "Dupuis", email: "e.dupuis@email.com", requestedAt: "2026-03-25" },
  ],
  g4: [
    { id: "u1", firstName: "Utilisateur", lastName: "", email: "utilisateur@email.com", requestedAt: "2026-03-26" },
    { id: "r6", firstName: "Thomas", lastName: "Roy", email: "t.roy@email.com", requestedAt: "2026-03-21" },
  ],
};
