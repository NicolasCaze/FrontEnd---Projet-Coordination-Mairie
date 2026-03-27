# Architecture du Frontend - Maquette-front

## 📁 Structure du Projet

Le projet a été restructuré pour suivre une architecture modulaire et maintenable, tout en conservant tous les composants de design existants.

```
src/
├── app/                          # Composants originaux de Maquette-front (conservés)
│   └── components/               # Tous les composants de pages existants
│       ├── ui/                   # Composants UI shadcn/ui
│       └── [Pages].tsx           # Composants de pages (Login, Register, etc.)
│
├── components/                   # Nouveaux composants partagés
│   ├── ui/                       # Composants UI (copiés depuis app/components/ui)
│   ├── shared/                   # Composants réutilisables
│   │   └── ProtectedRoute.tsx   # Protection des routes authentifiées
│   └── figma/                    # Composants Figma
│
├── contexts/                     # Contextes React
│   └── AuthContext.tsx          # Gestion de l'authentification
│
├── features/                     # Modules par fonctionnalité (architecture future)
│   ├── auth/
│   ├── catalog/
│   ├── reservations/
│   ├── groups/
│   └── admin/
│
├── hooks/                        # Hooks personnalisés
│
├── layouts/                      # Layouts de l'application
│   └── MainLayout.tsx           # Layout principal avec navigation
│
├── lib/                          # Utilitaires et configuration
│   ├── api.ts                   # Configuration Axios avec intercepteurs
│   └── utils.ts                 # Fonctions utilitaires
│
├── pages/                        # Pages de l'application
│   ├── auth/
│   │   ├── LoginPage.tsx        # Page de connexion (connectée au backend)
│   │   └── RegisterPage.tsx     # Page d'inscription (connectée au backend)
│   └── HomePage.tsx             # Page d'accueil
│
├── router/                       # Configuration du routing
│   └── index.tsx                # Routes avec protection
│
├── services/                     # Services API
│   ├── authService.ts           # Authentification
│   ├── bienService.ts           # Gestion des biens
│   ├── reservationService.ts    # Gestion des réservations
│   ├── groupeService.ts         # Gestion des groupes
│   └── userService.ts           # Gestion des utilisateurs
│
├── store/                        # State management (futur)
│
├── styles/                       # Styles globaux
│   └── index.css                # Styles Tailwind
│
├── types/                        # Types TypeScript
│   └── index.ts                 # Types pour les entités backend
│
├── App.tsx                       # Composant racine avec AuthProvider
└── main.tsx                      # Point d'entrée
```

## 🔌 Connexion Backend

### Configuration API

L'API est configurée dans `src/lib/api.ts` avec :
- **Base URL** : Définie via `VITE_API_URL` (`.env`)
- **Intercepteurs de requêtes** : Ajout automatique du token JWT
- **Intercepteurs de réponses** : Gestion du refresh token automatique
- **Gestion d'erreurs** : Redirection vers login si non authentifié

### Services API Disponibles

#### AuthService (`src/services/authService.ts`)
- `login(email, password)` - Connexion
- `register(data)` - Inscription
- `logout()` - Déconnexion
- `getCurrentUser()` - Récupérer l'utilisateur connecté
- `refreshToken(token)` - Rafraîchir le token

#### BienService (`src/services/bienService.ts`)
- `getAll(params)` - Liste des biens (paginée)
- `getById(id)` - Détails d'un bien
- `create(data)` - Créer un bien (admin)
- `update(id, data)` - Modifier un bien (admin)
- `delete(id)` - Supprimer un bien (admin)
- `checkAvailability(bienId, dateDebut, dateFin)` - Vérifier disponibilité

#### ReservationService (`src/services/reservationService.ts`)
- `getAll(params)` - Liste des réservations
- `getMyReservations(params)` - Mes réservations
- `getById(id)` - Détails d'une réservation
- `create(data)` - Créer une réservation
- `update(id, data)` - Modifier une réservation
- `cancel(id)` - Annuler une réservation
- `confirm(id)` - Confirmer une réservation (admin)
- `reject(id, reason)` - Refuser une réservation (admin)

#### GroupeService (`src/services/groupeService.ts`)
- `getAll(params)` - Liste des groupes
- `getMyGroups()` - Mes groupes
- `getById(id)` - Détails d'un groupe
- `create(data)` - Créer un groupe
- `update(id, data)` - Modifier un groupe
- `delete(id)` - Supprimer un groupe
- `getMembers(groupeId)` - Membres d'un groupe
- `addMember(groupeId, userId)` - Ajouter un membre
- `removeMember(groupeId, membreId)` - Retirer un membre
- `acceptMember(groupeId, membreId)` - Accepter un membre
- `rejectMember(groupeId, membreId)` - Refuser un membre
- `joinGroup(groupeId)` - Rejoindre un groupe
- `leaveGroup(groupeId)` - Quitter un groupe

#### UserService (`src/services/userService.ts`)
- `getAll(params)` - Liste des utilisateurs (admin)
- `getById(id)` - Détails d'un utilisateur
- `update(id, data)` - Modifier un utilisateur (admin)
- `delete(id)` - Supprimer un utilisateur (admin)
- `updateProfile(data)` - Modifier son profil
- `changePassword(oldPassword, newPassword)` - Changer son mot de passe

## 🔐 Authentification

### AuthContext

Le contexte d'authentification (`src/contexts/AuthContext.tsx`) fournit :
- `user` - Utilisateur connecté
- `isAuthenticated` - Statut de connexion
- `isLoading` - Chargement initial
- `login(email, password)` - Fonction de connexion
- `register(data)` - Fonction d'inscription
- `logout()` - Fonction de déconnexion
- `refreshUser()` - Rafraîchir les données utilisateur

### Utilisation dans un composant

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // ...
}
```

### Routes Protégées

Utiliser le composant `ProtectedRoute` pour protéger les routes :

```tsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Pour les routes admin uniquement
<ProtectedRoute requireAdmin>
  <AdminDashboard />
</ProtectedRoute>
```

## 🚀 Démarrage

### Variables d'environnement

Copier `.env.example` vers `.env` et configurer :
```bash
cp .env.example .env
```

### Installation et démarrage

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

## 📝 Prochaines Étapes

### 1. Adapter les composants existants pour utiliser les services API

Les composants dans `src/app/components/` utilisent actuellement des données mockées. Il faut les adapter pour utiliser les services API :

**Exemple pour Catalog.tsx :**
```tsx
import { useEffect, useState } from 'react';
import { bienService } from '@/services/bienService';
import { Bien } from '@/types';

export function Catalog() {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBiens = async () => {
      try {
        const response = await bienService.getAll({ disponible: true });
        setBiens(response.content);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBiens();
  }, []);
  
  // ... reste du composant
}
```

### 2. Remplacer les données mockées

- Supprimer `src/app/data/mockData.ts`
- Adapter tous les composants pour utiliser les vrais services
- Gérer les états de chargement et d'erreur

### 3. Adapter le contexte utilisateur

Les composants utilisent actuellement `useOutletContext` pour accéder à l'utilisateur. Remplacer par `useAuth()` :

```tsx
// Avant
const { currentUser } = useOutletContext<any>();

// Après
const { user } = useAuth();
```

### 4. Tester l'intégration

- Démarrer le backend Spring Boot
- Démarrer le frontend
- Tester toutes les fonctionnalités :
  - Inscription / Connexion
  - Navigation
  - Réservations
  - Gestion des groupes
  - Administration

## 🔧 Configuration Backend

Le backend doit être configuré pour accepter les requêtes CORS du frontend.

**Application.properties (Backend) :**
```properties
# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

Ou créer une configuration CORS dans le backend :

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

## 📚 Technologies Utilisées

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **React Router 7** - Routing
- **Axios** - Client HTTP
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Composants UI
- **Vite** - Build tool
- **Lucide React** - Icônes

## 🎯 Points Clés

1. ✅ **Architecture modulaire** : Séparation claire des responsabilités
2. ✅ **Services API** : Tous les endpoints backend sont couverts
3. ✅ **Authentification JWT** : Gestion automatique des tokens
4. ✅ **Routes protégées** : Sécurisation des pages
5. ✅ **Types TypeScript** : Typage complet des entités
6. ✅ **Composants UI conservés** : Tous les designs existants sont préservés
7. 🔄 **Migration progressive** : Les composants peuvent être migrés un par un

## 🐛 Dépannage

### Erreurs CORS
Vérifier que le backend autorise les requêtes depuis `http://localhost:5173`

### Token expiré
Le refresh token est géré automatiquement. Si le problème persiste, vider le localStorage et se reconnecter.

### Erreurs de compilation TypeScript
Exécuter `npm install` pour s'assurer que toutes les dépendances sont installées.
