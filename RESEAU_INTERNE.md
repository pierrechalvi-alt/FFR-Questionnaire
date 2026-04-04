# Réseau interne communautaire (vision produit)

## État actuel
L'application est une interface web statique (HTML/CSS/JS) exécutée côté navigateur. Sans backend partagé, chaque appareil fonctionne de manière indépendante (pas de flux commun, pas de notifications inter‑utilisateurs).

## Objectif
Permettre à **tous les utilisateurs** de voir l'activité commune (soumissions, commentaires, mises à jour), et de recevoir des notifications en temps réel.

## Architecture recommandée

### 1) Backend centralisé
- API REST (ou GraphQL) pour stocker les questionnaires et événements.
- Base de données partagée (PostgreSQL recommandé).
- Journal d'événements (`events`) pour alimenter le flux communautaire.

### 2) Authentification + rôles
- Comptes utilisateurs (staff médical, performance, admin).
- Gestion des permissions (lecture/écriture/modération).

### 3) Temps réel
- WebSocket / Server-Sent Events / Realtime provider (ex: Supabase Realtime).
- Canal "communauté" avec publication des nouveaux événements.

### 4) Notifications
- Notifications in-app (badge, centre de notifications).
- Notifications push (Web Push) si l'utilisateur l'accepte.
- Digest email optionnel (quotidien/hebdo).

### 5) Traçabilité & sécurité
- Historique des actions (audit log).
- Chiffrement TLS, politique RGPD, sauvegardes.

## Parcours MVP (itératif)
1. **MVP 1**: API + DB + authentification + sauvegarde partagée des questionnaires.
2. **MVP 2**: fil d'actualité commun (lecture) + événements en temps réel.
3. **MVP 3**: notifications in-app et préférences utilisateurs.
4. **MVP 4**: push + modération + analytics d'usage.

## Impacts UX attendus
- Fin du fonctionnement isolé par appareil.
- Vision commune des activités de la structure.
- Collaboration plus rapide entre staff médical et performance.

## Risques / points d'attention
- Qualité des permissions (éviter la sur-exposition de données sensibles).
- Coût opérationnel (hébergement DB/Realtime).
- Gouvernance des données (durée de conservation, anonymisation partielle).

## Décision
Oui, c'est **techniquement possible** et cohérent avec votre besoin. Cela nécessite de faire évoluer l'application d'un modèle "statique local" vers une architecture client-serveur avec authentification, stockage partagé et couche temps réel.
