# Database Schema Mapping

## Tables et Colonnes

### drivers
- `id_driver` (PK)
- `points`
- `id_user` (FK -> users)

**Note:** Les drivers n'ont PAS de id_team ni id_nationalite directement. Utiliser les tables de liaison teams_users et nationalites_user via id_user.

### users
- `id_user` (PK)
- `firstname`
- `lastname`
- `email`

### teams_users (table de liaison)
- `id_user` (FK -> users)
- `id_team` (FK -> teams)

### nationalites_user (table de liaison)
- `id_user` (FK -> users)
- `id_nationalite` (FK -> nationalites)

### teams
- `id_team` (PK)
- `libelle` (nom de l'équipe)
- `date_creation`
- `points`

### results
- `id_result` (PK)
- `id_driver` (FK -> drivers)
- `id_bareme` (FK -> bareme)
- `id_planning` (FK -> evenements)

### evenements
- `id_planning` (PK)
- `nom`
- `date_heure`
- `id_type_evenement` (FK -> type_evenements)
- `id_saison` (FK -> saisons)
- `id_circuits` (FK -> circuits)

### circuits
- `id_circuits` (PK)
- `nom`
- `longueur`
- `id_localisation` (FK -> localisations)

### saisons
- `id_saison` (PK)
- `nom`
- `annee`
- `date_debut`
- `date_fin`

### type_evenements
- `id_type_evenement` (PK)
- `libelle`

### nationalites
- `id_nationalite` (PK)
- `libelle`

### localisations
- `id_localisation` (PK)
- `ville`
- `pays`

### bareme
- `id_bareme` (PK)
- `place` (position)
- `point` (points attribués)

## Notes importantes

- Les drivers n'ont PAS de firstname/lastname directement, ils sont liés à la table users
- Les teams et nationalités pour un driver passent par les tables de liaison teams_users et nationalites_user
- Les teams n'ont PAS de team_name (c'est `libelle`)
- Les résultats utilisent bareme pour les points, pas directement stockés
- Pas de colonnes driver_number, first_name, last_name dans drivers
