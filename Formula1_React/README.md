# 🏎️ Formula 1 - Full Stack Application

Application web complète de gestion Formula 1 avec authentification, dashboard public, et panel d'administration.

## 📋 Fonctionnalités

### Frontend (React + Vite + Tailwind CSS)
- **Dashboard Public**: Statistiques, résultats récents, top pilotes/équipes
- **Pages Publiques**: Teams, Drivers, Circuits, Calendar, Standings
- **Authentification**: Login/Register avec JWT
- **Panel Admin**: CRUD complet pour gérer toutes les données (accès admin uniquement)
- **Design Responsive**: Interface moderne avec Tailwind CSS

### Backend (Node.js + Express + MySQL)
- **API REST** complète avec authentification JWT
- **CRUD Operations** pour:
  - Teams (Équipes)
  - Drivers (Pilotes)
  - Circuits
  - Events (Événements/Courses)
  - Results (Résultats)
- **Endpoints Statistiques**:
  - Classement pilotes
  - Classement constructeurs
  - Calendrier des courses
  - Résultats récents
  - Statistiques globales
- **Sécurité**: Authentification JWT, routes protégées, gestion des rôles

## 🛠️ Technologies

| Composant | Stack |
|-----------|-------|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router, Axios |
| **Backend** | Node.js, Express 5, MySQL2, JWT, bcryptjs |
| **Database** | MySQL |

## 📁 Structure du Projet

```
Formula1_React/
├── server/              # Backend Express
│   ├── src/
│   │   ├── config/      # Configuration DB
│   │   ├── controllers/ # Logique métier
│   │   ├── middleware/  # Auth middleware
│   │   ├── routes/      # Routes API
│   │   └── index.js     # Point d'entrée
│   ├── .env             # Variables d'environnement
│   └── package.json
│
└── client/              # Frontend React
    ├── src/
    │   ├── api/         # Configuration Axios
    │   ├── components/  # Composants réutilisables
    │   ├── context/     # Context API (Auth)
    │   ├── pages/       # Pages de l'application
    │   ├── App.jsx      # Composant principal
    │   └── main.jsx     # Point d'entrée
    ├── .env             # Variables d'environnement
    └── package.json
```

## 🚀 Installation et Démarrage

### Prérequis

- Node.js (v16+)
- MySQL (v8+)
- npm ou yarn

### 1. Configuration de la Base de Données

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données (si pas déjà fait)
# Puis exécuter les scripts SQL dans l'ordre:
# - SQL/01-CREATE_DATABASE_FORMULA1_08-12-2025.sql
# - SQL/02-INSERT_DATA_REF_FORMULA1_08-12-2025.sql
# - SQL/03-INSERT_DATA_TEST_FORMULA1_08-12-2025.sql
```

### 2. Configuration du Backend

```bash
cd Formula1_React/server

# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Copier .env.example vers .env et modifier les valeurs
cp .env.example .env

# Éditer .env avec vos informations MySQL:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=votre_mot_de_passe
# DB_NAME=formula1
# PORT=5000
# JWT_SECRET=un_secret_très_sécurisé

# Démarrer le serveur (mode développement avec hot reload)
npm run dev

# Ou en production:
npm start
```

Le backend sera accessible sur `http://localhost:5000`

### 3. Configuration du Frontend

```bash
cd Formula1_React/client

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 🔐 Authentification et Rôles

### Créer un Utilisateur Admin

Pour accéder au panel d'administration, vous devez avoir un utilisateur avec le rôle Admin:

```sql
-- 1. Créer un utilisateur via l'interface de register, ou directement en SQL:
INSERT INTO users (username, email, password, first_name, last_name)
VALUES ('admin', 'admin@formula1.com', '$2a$10$...', 'Admin', 'User');

-- 2. Récupérer l'ID de l'utilisateur créé
SELECT id FROM users WHERE email = 'admin@formula1.com';

-- 3. Lui attribuer le rôle Admin (en supposant que type_users_id = 1 pour Admin)
-- Vérifier d'abord les types disponibles:
SELECT * FROM type_users;

-- Assigner le rôle (remplacer <user_id> par l'ID récupéré):
INSERT INTO users_type_users (users_id, type_users_id)
VALUES (<user_id>, 1);
```

**Note**: Le mot de passe doit être hashé avec bcrypt. Il est plus simple de créer l'utilisateur via l'interface `/register`, puis d'ajouter le rôle Admin en SQL.

### Rôles Disponibles

- **Fan** (par défaut): Accès en lecture seule
- **Admin**: Accès complet au panel d'administration avec CRUD

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/profile` - Profil utilisateur (authentifié)

### Teams
- `GET /api/teams` - Liste des équipes
- `GET /api/teams/:id` - Détails d'une équipe
- `POST /api/teams` - Créer (admin)
- `PUT /api/teams/:id` - Modifier (admin)
- `DELETE /api/teams/:id` - Supprimer (admin)

### Drivers
- `GET /api/drivers` - Liste des pilotes
- `GET /api/drivers/:id` - Détails d'un pilote
- `POST /api/drivers` - Créer (admin)
- `PUT /api/drivers/:id` - Modifier (admin)
- `DELETE /api/drivers/:id` - Supprimer (admin)

### Circuits
- `GET /api/circuits` - Liste des circuits
- `GET /api/circuits/:id` - Détails d'un circuit
- `POST /api/circuits` - Créer (admin)
- `PUT /api/circuits/:id` - Modifier (admin)
- `DELETE /api/circuits/:id` - Supprimer (admin)

### Events
- `GET /api/events` - Liste des événements
- `GET /api/events/:id` - Détails d'un événement
- `GET /api/events/types` - Types d'événements
- `GET /api/events/seasons` - Saisons disponibles
- `POST /api/events` - Créer (admin)
- `PUT /api/events/:id` - Modifier (admin)
- `DELETE /api/events/:id` - Supprimer (admin)

### Results
- `GET /api/results` - Liste des résultats
- `GET /api/results/:id` - Détails d'un résultat
- `POST /api/results` - Créer (admin)
- `PUT /api/results/:id` - Modifier (admin)
- `DELETE /api/results/:id` - Supprimer (admin)

### Statistics
- `GET /api/stats/drivers?saison=2024` - Classement pilotes
- `GET /api/stats/constructors?saison=2024` - Classement constructeurs
- `GET /api/stats/calendar?saison=2024` - Calendrier des courses
- `GET /api/stats/recent?limit=5` - Résultats récents
- `GET /api/stats/overall` - Statistiques globales

## 🎨 Pages de l'Application

| Page | Route | Accès | Description |
|------|-------|-------|-------------|
| Dashboard | `/` | Public | Vue d'ensemble avec stats et résultats récents |
| Teams | `/teams` | Public | Liste des équipes F1 |
| Drivers | `/drivers` | Public | Liste des pilotes |
| Circuits | `/circuits` | Public | Liste des circuits |
| Calendar | `/calendar` | Public | Calendrier des courses par saison |
| Standings | `/standings` | Public | Classements pilotes et constructeurs |
| Login | `/login` | Public | Connexion |
| Register | `/register` | Public | Inscription |
| Admin Panel | `/admin` | Admin only | Gestion CRUD de toutes les données |

## 🔧 Scripts Disponibles

### Backend
```bash
npm start          # Démarrer le serveur en production
npm run dev        # Démarrer en mode développement (nodemon)
```

### Frontend
```bash
npm run dev        # Démarrer le serveur de développement
npm run build      # Build pour production
npm run preview    # Prévisualiser le build de production
npm run lint       # Linter le code
```

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifier que MySQL est démarré
- Vérifier les informations dans `server/.env`
- Vérifier que la base de données `formula1` existe

### Erreur CORS
- Vérifier que `CLIENT_URL` dans `server/.env` correspond à l'URL du frontend
- Par défaut: `http://localhost:5173`

### Erreur d'authentification
- Vérifier que `JWT_SECRET` est défini dans `server/.env`
- Vider le localStorage du navigateur si nécessaire

## 📝 Notes de Développement

### Ajouter de Nouvelles Fonctionnalités

1. **Backend**: Créer controller → routes → ajouter dans `src/index.js`
2. **Frontend**: Créer page → ajouter route dans `App.jsx`

### Base de Données

Le schéma comprend 16 tables principales:
- `users`, `type_users`, `nationalites`
- `teams`, `drivers`, `circuits`, `localisations`
- `evenements`, `type_evenements`, `saisons`
- `results`, `bareme`
- Tables de liaison: `nationalites_user`, `users_type_users`, `teams_users`

## 🤝 Contribution

Ce projet est développé dans le cadre d'un projet académique sur les bases de données.

## 📄 Licence

Projet académique - Licence Informatique

---

**Développé avec ❤️ pour le projet Base de Données Formula 1**
