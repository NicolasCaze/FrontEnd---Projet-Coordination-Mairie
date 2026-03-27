# Guide de Migration - Connexion des Composants au Backend

Ce guide explique comment migrer progressivement les composants existants de Maquette-front pour qu'ils utilisent les vrais services API au lieu des données mockées.

## 🎯 Objectif

Remplacer les données mockées par des appels API réels tout en conservant l'interface utilisateur existante.

## 📋 Checklist de Migration

### Composants à Migrer

- [ ] **Catalog.tsx** - Liste des biens
- [ ] **PropertyDetail.tsx** - Détails d'un bien
- [ ] **BookingForm.tsx** - Formulaire de réservation
- [ ] **MyBookings.tsx** - Liste de mes réservations
- [ ] **BookingDetail.tsx** - Détails d'une réservation
- [ ] **Dashboard.tsx** - Tableau de bord utilisateur
- [ ] **UserProfile.tsx** - Profil utilisateur
- [ ] **MyGroups.tsx** - Mes groupes
- [ ] **GroupManagement.tsx** - Gestion d'un groupe
- [ ] **GroupPendingRequests.tsx** - Demandes en attente
- [ ] **JoinGroup.tsx** - Rejoindre un groupe
- [ ] **AdminDashboard.tsx** - Tableau de bord admin
- [ ] **AdminBookings.tsx** - Gestion des réservations (admin)
- [ ] **AdminUsers.tsx** - Gestion des utilisateurs (admin)
- [ ] **AdminGroups.tsx** - Gestion des groupes (admin)
- [ ] **AuditLog.tsx** - Journal d'audit

## 🔄 Étapes de Migration par Composant

### 1. Catalog.tsx - Liste des Biens

**Avant (avec mock data) :**
```tsx
import { mockProperties } from "../data/mockData";

export function Catalog() {
  const properties = mockProperties;
  // ...
}
```

**Après (avec API) :**
```tsx
import { useState, useEffect } from "react";
import { bienService } from "@/services/bienService";
import { Bien } from "@/types";

export function Catalog() {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBiens = async () => {
      try {
        setLoading(true);
        const response = await bienService.getAll({ 
          page, 
          size: 12,
          disponible: true 
        });
        setBiens(response.content);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBiens();
  }, [page]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  // ... reste du composant avec biens au lieu de mockProperties
}
```

### 2. PropertyDetail.tsx - Détails d'un Bien

**Après (avec API) :**
```tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { bienService } from "@/services/bienService";
import { Bien } from "@/types";

export function PropertyDetail() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const [bien, setBien] = useState<Bien | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBien = async () => {
      if (!resourceId) return;
      
      try {
        const data = await bienService.getById(parseInt(resourceId));
        setBien(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBien();
  }, [resourceId]);

  if (loading) return <div>Chargement...</div>;
  if (!bien) return <div>Bien non trouvé</div>;

  // ... reste du composant
}
```

### 3. BookingForm.tsx - Formulaire de Réservation

**Après (avec API) :**
```tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { reservationService } from "@/services/reservationService";
import { useAuth } from "@/contexts/AuthContext";

export function BookingForm() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    dateDebut: "",
    dateFin: "",
    motif: "",
    nombrePersonnes: 1,
    groupeId: undefined as number | undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceId) return;

    setLoading(true);
    setError(null);

    try {
      await reservationService.create({
        bienId: parseInt(resourceId),
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        motif: formData.motif,
        nombrePersonnes: formData.nombrePersonnes,
        groupeId: formData.groupeId,
      });
      
      navigate("/my-bookings");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la réservation");
    } finally {
      setLoading(false);
    }
  };

  // ... reste du composant
}
```

### 4. MyBookings.tsx - Mes Réservations

**Après (avec API) :**
```tsx
import { useState, useEffect } from "react";
import { reservationService } from "@/services/reservationService";
import { Reservation } from "@/types";

export function MyBookings() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const params = filter !== "all" ? { statut: filter } : {};
        const response = await reservationService.getMyReservations(params);
        setReservations(response.content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, [filter]);

  const handleCancel = async (id: number) => {
    if (!confirm("Voulez-vous vraiment annuler cette réservation ?")) return;
    
    try {
      await reservationService.cancel(id);
      setReservations(reservations.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ... reste du composant
}
```

### 5. MyGroups.tsx - Mes Groupes

**Après (avec API) :**
```tsx
import { useState, useEffect } from "react";
import { groupeService } from "@/services/groupeService";
import { Groupe } from "@/types";

export function MyGroups() {
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupes = async () => {
      try {
        const data = await groupeService.getMyGroups();
        setGroupes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroupes();
  }, []);

  const handleLeaveGroup = async (groupeId: number) => {
    if (!confirm("Voulez-vous vraiment quitter ce groupe ?")) return;
    
    try {
      await groupeService.leaveGroup(groupeId);
      setGroupes(groupes.filter(g => g.id !== groupeId));
    } catch (err) {
      console.error(err);
    }
  };

  // ... reste du composant
}
```

### 6. UserProfile.tsx - Profil Utilisateur

**Après (avec API) :**
```tsx
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";

export function UserProfile() {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    adresse: user?.adresse || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await userService.updateProfile(formData);
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ... reste du composant
}
```

### 7. AdminUsers.tsx - Gestion des Utilisateurs (Admin)

**Après (avec API) :**
```tsx
import { useState, useEffect } from "react";
import { userService } from "@/services/userService";
import { User } from "@/types";

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAll({ page, size: 20 });
        setUsers(response.content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    
    try {
      await userService.delete(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ... reste du composant
}
```

## 🔧 Patterns Communs

### Gestion du Chargement

```tsx
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}
```

### Gestion des Erreurs

```tsx
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {error}
    </div>
  );
}
```

### Pagination

```tsx
const [page, setPage] = useState(0);
const [totalPages, setTotalPages] = useState(0);

// Dans le fetch
const response = await service.getAll({ page, size: 10 });
setTotalPages(response.totalPages);

// Composant de pagination
<div className="flex gap-2 justify-center mt-4">
  <button 
    onClick={() => setPage(p => Math.max(0, p - 1))}
    disabled={page === 0}
  >
    Précédent
  </button>
  <span>Page {page + 1} / {totalPages}</span>
  <button 
    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
    disabled={page >= totalPages - 1}
  >
    Suivant
  </button>
</div>
```

## 🚀 Ordre de Migration Recommandé

1. **Login & Register** ✅ (Déjà fait)
2. **Catalog** - Liste des biens
3. **PropertyDetail** - Détails d'un bien
4. **BookingForm** - Créer une réservation
5. **MyBookings** - Mes réservations
6. **UserProfile** - Profil utilisateur
7. **MyGroups** - Mes groupes
8. **GroupManagement** - Gestion d'un groupe
9. **JoinGroup** - Rejoindre un groupe
10. **Dashboard** - Tableau de bord
11. **AdminDashboard** - Admin
12. **AdminBookings** - Gestion réservations admin
13. **AdminUsers** - Gestion utilisateurs admin
14. **AdminGroups** - Gestion groupes admin

## ✅ Tests à Effectuer

Pour chaque composant migré :

1. ✅ Le composant charge les données correctement
2. ✅ Les états de chargement s'affichent
3. ✅ Les erreurs sont gérées
4. ✅ Les actions (créer, modifier, supprimer) fonctionnent
5. ✅ La pagination fonctionne (si applicable)
6. ✅ Les filtres fonctionnent (si applicable)
7. ✅ L'interface reste identique

## 🔍 Débogage

### Vérifier les requêtes dans la console

```tsx
useEffect(() => {
  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      const data = await service.getData();
      console.log('Data received:', data);
      setData(data);
    } catch (err) {
      console.error('Error:', err);
    }
  };
  fetchData();
}, []);
```

### Vérifier le token dans localStorage

```javascript
console.log('Access Token:', localStorage.getItem('accessToken'));
```

### Vérifier les headers de requête

Ouvrir les DevTools > Network > Sélectionner une requête > Headers

## 📝 Notes Importantes

1. **Remplacer `useOutletContext`** par `useAuth()` partout
2. **Adapter les noms de propriétés** : Les mocks utilisent peut-être des noms différents du backend
3. **Gérer les dates** : Utiliser le format ISO pour les dates (YYYY-MM-DD)
4. **Tester avec le backend** : S'assurer que le backend est démarré sur le port 8080
5. **CORS** : Vérifier que la configuration CORS est correcte dans le backend
