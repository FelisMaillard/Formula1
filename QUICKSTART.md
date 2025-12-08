# 🚀 Guide de Démarrage Rapide - Formula 1 Application

## ⚡ Démarrage en 5 Minutes

### 1. Configuration de la Base de Données

```bash
# Lancer MySQL
mysql -u root -p

# Dans MySQL, exécuter les scripts SQL dans l'ordre:
source /path/to/SQL/01-CREATE_DATABASE_FORMULA1_08-12-2025.sql
source /path/to/SQL/02-INSERT_DATA_REF_FORMULA1_08-12-2025.sql
source /path/to/SQL/03-INSERT_DATA_TEST_FORMULA1_08-12-2025.sql
```

### 2. Démarrer le Backend

```bash
cd Formula1_React/server

# Configurer .env (copier depuis .env.example)
cat > .env << 'EOF'
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=formula1
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=formula1_secret_key_change_in_production
NODE_ENV=development
EOF

# Installer et lancer
npm install
npm run dev
```

✅ Backend disponible sur http://localhost:5000

### 3. Démarrer le Frontend

```bash
# Dans un nouveau terminal
cd Formula1_React/client

npm install
npm run dev
```

✅ Frontend disponible sur http://localhost:5173

## 🎯 Premiers Pas

### 1. Créer un Compte
- Aller sur http://localhost:5173/register
- Créer un compte utilisateur

### 2. Promouvoir en Admin (optionnel)

```sql
-- Trouver votre user ID
SELECT id, username FROM users WHERE email = 'votre_email@example.com';

-- Ajouter le rôle Admin (ID 1)
-- Note: Vérifier d'abord que le type Admin existe
SELECT * FROM type_users;

-- Si Admin n'existe pas, le créer:
INSERT INTO type_users (type_name) VALUES ('Admin');

-- Assigner le rôle (remplacer <user_id>)
INSERT INTO users_type_users (users_id, type_users_id) VALUES (<user_id>, 1);
```

### 3. Explorer l'Application

**Pages Publiques:**
- 🏠 Dashboard: http://localhost:5173/
- 🏎️ Teams: http://localhost:5173/teams
- 👤 Drivers: http://localhost:5173/drivers
- 🏁 Circuits: http://localhost:5173/circuits
- 📅 Calendar: http://localhost:5173/calendar
- 🏆 Standings: http://localhost:5173/standings

**Admin Panel (après promotion):**
- ⚙️ Admin: http://localhost:5173/admin

## 🧪 Tester l'API

### Via cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get teams
curl http://localhost:5000/api/teams

# Get drivers
curl http://localhost:5000/api/drivers

# Get standings (2024)
curl http://localhost:5000/api/stats/drivers?saison=2024
```

### Via l'Interface Web

1. **Dashboard**: Voir les statistiques globales
2. **Teams/Drivers/Circuits**: Explorer les données
3. **Calendar**: Voir le calendrier 2024/2025/2026
4. **Standings**: Classements pilotes et constructeurs

### En tant qu'Admin

1. Aller sur `/admin`
2. Choisir une entité (Teams, Drivers, etc.)
3. Créer/Modifier/Supprimer des données

## 📝 Exemples de Requêtes

### Créer une Équipe (Admin)

```bash
curl -X POST http://localhost:5000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "team_name": "McLaren F1 Team",
    "base_location": "Woking, England",
    "team_principal": "Andrea Stella",
    "chassis": "MCL38",
    "power_unit": "Mercedes"
  }'
```

### Créer un Pilote (Admin)

```bash
curl -X POST http://localhost:5000/api/drivers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "driver_number": 4,
    "first_name": "Lando",
    "last_name": "Norris",
    "birth_date": "1999-11-13",
    "team_id": 1,
    "nationalite_id": 1
  }'
```

## ⚠️ Problèmes Courants

### Port déjà utilisé

```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

### Erreur de connexion MySQL

```bash
# Vérifier que MySQL tourne
mysql -u root -p

# Si erreur de connexion, vérifier le .env
cat Formula1_React/server/.env
```

### CORS Error

Vérifier dans `server/.env`:
```
CLIENT_URL=http://localhost:5173
```

### JWT Invalid

1. Supprimer le token du localStorage:
   - Ouvrir DevTools (F12)
   - Application → Local Storage
   - Supprimer les clés `token` et `user`

2. Se reconnecter

## 📊 Structure de Données

### Tables Principales
- `teams` - Équipes F1
- `drivers` - Pilotes
- `circuits` - Circuits
- `evenements` - Courses/Events
- `results` - Résultats de course
- `users` - Utilisateurs de l'app
- `type_users` - Rôles (Admin, Fan, etc.)

### Relations
- Un driver appartient à une team
- Un event se déroule sur un circuit
- Un result lie un event à un driver avec position/points

## 🎓 Prochaines Étapes

1. ✅ Créer un compte admin
2. ✅ Ajouter des équipes via le panel admin
3. ✅ Ajouter des pilotes
4. ✅ Créer des événements (courses)
5. ✅ Enregistrer des résultats
6. ✅ Voir les classements mis à jour

## 🆘 Support

Pour des instructions détaillées, voir:
- `Formula1_React/README.md` - Documentation complète
- `SQL/` - Scripts de base de données
- `Architechture/` - Diagrammes MCD/MLD

---

**Bon développement! 🏎️💨**
