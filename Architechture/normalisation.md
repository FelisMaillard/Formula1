# Normalisation de la table results

La table results enregistre les résultats des pilotes pour chaque événement F1 avec ses attributs : id_result (PK), id_driver, id_bareme, id_planning. Elle respecte la 3FN et la BCNF grâce à sa conception normalisée.​

## 1ère Forme Normale (1FN)

Toutes les colonnes contiennent des valeurs atomiques (entiers simples, pas de listes ou répétitions). Chaque tuple représente un résultat unique par pilote/événement, identifié par une clé primaire id_result. La contrainte UNIQUE (id_driver, id_planning) garantit l'unicité fonctionnelle.​

## 2ème Forme Normale (2FN)

La table est en 1FN. Tous les attributs non-clés (id_driver, id_bareme, id_planning) dépendent intégralement de la clé primaire id_result. Pas de dépendance partielle car il n'y a pas de clé composite nécessitant une décomposition.​

## 3ème Forme Normale (3FN)

La table est en 2FN. Aucune dépendance transitive : les attributs étrangers (id_driver, id_bareme, id_planning) référencent des tables normalisées séparées (drivers, bareme, evenements). Les points du pilote sont stockés dans drivers(points) et non ici, évitant la redondance.
