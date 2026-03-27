# 🚀 Guide de Démarrage Rapide

## État Actuel du Projet

✅ **Backend** : Fonctionnel avec toutes les dépendances installées
✅ **Frontend** : Architecture restructurée avec services API complets
✅ **Authentification** : JWT fonctionnelle avec AuthContext
✅ **Données mockées** : Supprimées
⚠️ **Composants** : Migration partielle (5/69 composants migrés)

## Démarrage de l'Application

### 1. Démarrer le Backend

```bash
cd /var/www/ynov/projet_cordination/Back-end
mvn spring-boot:run
```

Le backend démarre sur **http://localhost:8080**

### 2. Démarrer le Frontend

```bash
cd /var/www/ynov/projet_cordination/front-end/Maquette-front
npm run dev
```

Le frontend démarre sur **http://localhost:5173**

### 3. Accéder à l'Application

Ouvrir **http://localhost:5173** dans votre navigateur

## Fonctionnalités Actuellement Opérationnelles

### ✅ Pages Fonctionnelles

1. **Page d'accueil** (`/`) - Présentation du site
2. **Connexion** (`/login`) - Authentification avec le backend
3. **Inscription** (`/register`) - Création de compte
4. **Catalogue** (`/catalog`) - Liste des biens (connecté au backend)
5. **Détails d'un bien** (`/property/:id`) - Informations détaillées

### ⚠️ Pages Nécessitant une Migration

Les pages suivantes afficheront des erreurs car elles tentent d'importer les données mockées qui ont été supprimées :

- Formulaire de réservation (`/booking/:id`)
- Mes réservations (`/my-bookings`)
- Mes groupes (`/my-groups`)
- Tableau de bord (`/dashboard`)
- Profil utilisateur (`/profile`)
- Pages d'administration (`/admin/*`)

## Migration des Composants Restants

### Ordre de Priorité

1. **BookingForm.tsx** (Critique) - Permet de créer des réservations
2. **MyBookings.tsx** (Critique) - Affiche les réservations de l'utilisateur
3. **MyGroups.tsx** (Important) - Gestion des groupes
4. **Dashboard.tsx** (Important) - Tableau de bord utilisateur
5. **UserProfile.tsx** (Important) - Gestion du profil
6. **Composants Admin** (Moyen) - Administration

### Template de Migration Rapide

Pour chaque composant à migrer :

1. **Remplacer les imports mockData** :
```tsx
// Avant
import { mockResources, mockBookings } from "../data/mockData";
import { useOutletContext } from "react-router";

// Après
import { useState, useEffect } from "react";
import { bienService } from "@/services/bienService";
import { reservationService } from "@/services/reservationService";
import { useAuth } from "@/contexts/AuthContext";
```

2. **Remplacer useOutletContext par useAuth** :
```tsx
// Avant
const { currentUser } = useOutletContext<any>();

// Après
const { user } = useAuth();
```

3. **Charger les données depuis l'API** :
```tsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await service.getData();
      setData(response.content || response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

4. **Adapter les noms de propriétés** :
```tsx
// Avant (mock)
resource.name, resource.available, resource.capacity

// Après (API)
bien.nom, bien.disponible, bien.capacite
```

## Configuration Backend

### Variables d'Environnement

Créer un fichier `application.properties` dans `Back-end/src/main/resources/` :

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/mairie_db
spring.datasource.username=votre_user
spring.datasource.password=votre_password
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=votre_secret_key_tres_longue_et_securisee_au_moins_256_bits
jwt.expiration=86400
jwt.refresh-expiration=604800

# Server
server.port=8080
```

### Créer la Base de Données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE mairie_db;

# Créer un utilisateur
CREATE USER mairie_user WITH PASSWORD 'votre_password';

# Donner les droits
GRANT ALL PRIVILEGES ON DATABASE mairie_db TO mairie_user;

# Quitter
\q
```

## Tests Rapides

### Tester l'Authentification

1. Aller sur http://localhost:5173/register
2. Créer un compte
3. Se connecter sur http://localhost:5173/login
4. Vérifier que vous êtes redirigé vers le dashboard

### Tester le Catalogue

1. Aller sur http://localhost:5173/catalog
2. Vérifier que les biens s'affichent (si la base contient des données)
3. Cliquer sur "Voir les détails" d'un bien

### Vérifier les Erreurs

Ouvrir la console du navigateur (F12) pour voir les erreurs éventuelles.

## Dépannage Rapide

### Le backend ne démarre pas

- Vérifier que PostgreSQL est démarré
- Vérifier les credentials dans `application.properties`
- Vérifier que le port 8080 est libre

### Le frontend affiche des erreurs

- Vérifier que le backend est démarré
- Vérifier la console du navigateur
- Vérifier que les composants n'importent pas mockData

### Erreurs CORS

- Vérifier que `CorsConfig.java` existe dans le backend
- Vérifier que l'URL du frontend est autorisée

### Token expiré

- Se déconnecter et se reconnecter
- Vider le localStorage du navigateur

## Prochaines Étapes

1. **Configurer la base de données** PostgreSQL
2. **Migrer les composants critiques** (BookingForm, MyBookings)
3. **Ajouter des données de test** dans la base
4. **Tester toutes les fonctionnalités**
5. **Déployer en production**

## Ressources

- **Documentation complète** : `/INTEGRATION_COMPLETE.md`
- **Guide de migration** : `/MIGRATION_GUIDE.md`
- **Statut de migration** : `/MIGRATION_STATUS.md`
- **Architecture** : `/README_ARCHITECTURE.md`

## Support

Pour toute question :
1. Consulter la documentation dans les fichiers MD
2. Vérifier les logs du backend
3. Vérifier la console du navigateur
4. Consulter le code des composants déjà migrés (Catalog.tsx, PropertyDetail.tsx)
