# État de la Migration - Suppression des Données Mockées

## ✅ Travaux Réalisés

### Fichiers Supprimés
- ✅ `src/app/data/mockData.ts` - Supprimé
- ✅ `src/app/data/mockGroupData.ts` - Supprimé

### Composants Migrés vers les Services API

#### ✅ Composants Principaux (Migrés)
1. **Catalog.tsx** - Utilise `bienService.getAll()`
   - Chargement des biens depuis l'API
   - Filtrage par type
   - Gestion des états de chargement et d'erreur
   - Utilise `useAuth()` au lieu de `useOutletContext`

2. **PropertyDetail.tsx** - Utilise `bienService.getById()`
   - Chargement d'un bien spécifique
   - Affichage des détails
   - Gestion des erreurs 404

### Pages d'Authentification (Déjà Migrées)
- ✅ **LoginPage.tsx** - Utilise `authService.login()`
- ✅ **RegisterPage.tsx** - Utilise `authService.register()`
- ✅ **HomePage.tsx** - Page d'accueil statique

## ⚠️ Composants Nécessitant une Migration

Les composants suivants utilisent encore des références aux données mockées et doivent être adaptés :

### Réservations (Priorité Haute)
- ⏳ **BookingForm.tsx** - Doit utiliser `reservationService.create()` et `groupeService.getMyGroups()`
- ⏳ **MyBookings.tsx** - Doit utiliser `reservationService.getMyReservations()`
- ⏳ **BookingDetail.tsx** - Doit utiliser `reservationService.getById()`

### Groupes (Priorité Haute)
- ⏳ **MyGroups.tsx** - Doit utiliser `groupeService.getMyGroups()`
- ⏳ **GroupManagement.tsx** - Doit utiliser `groupeService` (getById, getMembers, etc.)
- ⏳ **GroupPendingRequests.tsx** - Doit utiliser `groupeService.getPendingRequests()`
- ⏳ **JoinGroup.tsx** - Doit utiliser `groupeService.joinGroup()`

### Utilisateur (Priorité Moyenne)
- ⏳ **Dashboard.tsx** - Doit charger les données réelles (réservations, groupes)
- ⏳ **UserProfile.tsx** - Doit utiliser `userService.updateProfile()`

### Administration (Priorité Moyenne)
- ⏳ **AdminDashboard.tsx** - Doit charger les statistiques réelles
- ⏳ **AdminBookings.tsx** - Doit utiliser `reservationService.getAll()`
- ⏳ **AdminUsers.tsx** - Doit utiliser `userService.getAll()`
- ⏳ **AdminGroups.tsx** - Doit utiliser `groupeService.getAll()`
- ⏳ **AuditLog.tsx** - Nécessite un service d'audit (à créer si nécessaire)

### Autres Composants
- ⏳ **Login.tsx** (ancien) - Peut être supprimé, remplacé par LoginPage.tsx
- ⏳ **Register.tsx** (ancien) - Peut être supprimé, remplacé par RegisterPage.tsx
- ⏳ **Logout.tsx** - Doit utiliser `authService.logout()`
- ⏳ **Root.tsx** - Doit être adapté pour utiliser AuthContext
- ⏳ **Home.tsx** (ancien) - Peut être supprimé, remplacé par HomePage.tsx
- ⏳ **NotFound.tsx** - Composant statique, pas de migration nécessaire

## 🔧 Actions Recommandées

### Étape 1 : Migrer les Composants de Réservation (Critique)

**BookingForm.tsx** - Template de migration :
```tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { reservationService } from "@/services/reservationService";
import { groupeService } from "@/services/groupeService";
import { bienService } from "@/services/bienService";
import { useAuth } from "@/contexts/AuthContext";

export function BookingForm() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bien, setBien] = useState(null);
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    dateDebut: "",
    dateFin: "",
    groupeId: undefined,
    motif: "",
    nombrePersonnes: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bienData, groupesData] = await Promise.all([
          bienService.getById(parseInt(resourceId!)),
          groupeService.getMyGroups(),
        ]);
        setBien(bienData);
        setGroupes(groupesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [resourceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reservationService.create({
        bienId: parseInt(resourceId!),
        ...formData,
      });
      navigate("/my-bookings");
    } catch (err) {
      console.error(err);
    }
  };

  // ... reste du composant
}
```

**MyBookings.tsx** - Template de migration :
```tsx
import { useState, useEffect } from "react";
import { reservationService } from "@/services/reservationService";
import { useAuth } from "@/contexts/AuthContext";

export function MyBookings() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const params = statusFilter !== "all" ? { statut: statusFilter } : {};
        const response = await reservationService.getMyReservations(params);
        setReservations(response.content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [statusFilter]);

  const handleCancel = async (id) => {
    if (!confirm("Voulez-vous vraiment annuler cette réservation ?")) return;
    try {
      await reservationService.cancel(id);
      setReservations(reservations.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Mapper les statuts backend vers l'affichage
  const getStatusBadge = (statut) => {
    switch (statut) {
      case "CONFIRMEE":
        return "Validée";
      case "EN_ATTENTE":
        return "En attente";
      case "ANNULEE":
        return "Annulée";
      case "TERMINEE":
        return "Terminée";
      default:
        return statut;
    }
  };

  // ... reste du composant
}
```

### Étape 2 : Migrer les Composants de Groupes

**MyGroups.tsx** :
```tsx
import { useState, useEffect } from "react";
import { groupeService } from "@/services/groupeService";
import { useAuth } from "@/contexts/AuthContext";

export function MyGroups() {
  const { user } = useAuth();
  const [groupes, setGroupes] = useState([]);
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

  // ... reste du composant
}
```

### Étape 3 : Migrer les Composants Admin

**AdminBookings.tsx**, **AdminUsers.tsx**, **AdminGroups.tsx** suivent le même pattern que les composants utilisateur, mais utilisent les méthodes `getAll()` au lieu de `getMy()`.

### Étape 4 : Nettoyer les Anciens Composants

Supprimer ou adapter :
- `src/app/components/Login.tsx` (remplacé par `src/pages/auth/LoginPage.tsx`)
- `src/app/components/Register.tsx` (remplacé par `src/pages/auth/RegisterPage.tsx`)
- `src/app/components/Home.tsx` (remplacé par `src/pages/HomePage.tsx`)

## 📝 Mapping des Types Backend vs Frontend

### Statuts de Réservation
- Backend : `EN_ATTENTE`, `CONFIRMEE`, `ANNULEE`, `TERMINEE`
- Frontend (ancien) : `pending`, `approved`, `rejected`, `completed`

### Rôles Utilisateur
- Backend : `ADMIN`, `MEMBRE`
- Frontend (ancien) : `super-admin`, `admin-conseil`, `admin-groupe`, `utilisateur`

### Types de Biens
- Backend : Chaînes libres (ex: `salle`, `materiel`, `vehicule`, `equipement`)
- Frontend (ancien) : `room`, `equipment`

## 🚀 Commandes Utiles

### Rechercher les références aux données mockées
```bash
cd /var/www/ynov/projet_cordination/front-end/Maquette-front
grep -r "mockData\|mockUsers\|mockResources\|mockBookings\|mockGroups" src/app/components/
```

### Vérifier les imports cassés
```bash
npm run build
```

### Lancer le dev server
```bash
npm run dev
```

## ⚡ Prochaines Étapes Immédiates

1. **Migrer BookingForm.tsx** - Critique pour les réservations
2. **Migrer MyBookings.tsx** - Critique pour voir ses réservations
3. **Migrer MyGroups.tsx** - Important pour la gestion des groupes
4. **Migrer Dashboard.tsx** - Important pour l'expérience utilisateur
5. **Migrer UserProfile.tsx** - Important pour la gestion du profil
6. **Migrer les composants Admin** - Important pour l'administration
7. **Tester l'application complète** - Vérifier que tout fonctionne

## 📊 Progression

- **Composants migrés** : 5/69 (7%)
- **Composants critiques migrés** : 2/6 (33%)
- **Fichiers mockData supprimés** : 2/2 (100%)

## 💡 Notes Importantes

1. **useOutletContext → useAuth** : Tous les composants doivent utiliser `useAuth()` au lieu de `useOutletContext<any>()`
2. **Gestion des erreurs** : Tous les appels API doivent être dans des try/catch
3. **États de chargement** : Afficher un loader pendant le chargement des données
4. **Mapping des données** : Adapter les noms de propriétés (ex: `name` → `nom`, `available` → `disponible`)
5. **Types TypeScript** : Utiliser les types définis dans `@/types/index.ts`

## 🔗 Ressources

- **Services API** : `/src/services/`
- **Types** : `/src/types/index.ts`
- **AuthContext** : `/src/contexts/AuthContext.tsx`
- **Guide de migration** : `/MIGRATION_GUIDE.md`
- **Documentation architecture** : `/README_ARCHITECTURE.md`
