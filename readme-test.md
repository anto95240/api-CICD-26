# API CI/CD - Guide Docker

## Table des matières
1. [Créer ses propres images Docker](#créer-ses-propres-images-docker)
2. [Système de versionnement](#système-de-versionnement)
3. [Docker Hub](#docker-hub)
4. [Se connecter à Docker Hub](#se-connecter-à-docker-hub)
5. [Push et Pull](#push-et-pull)
6. [Repository et Registres](#repository-et-registres)
7. [Workflow complet](#workflow-complet-exemple)

---

## Créer ses propres images Docker

### Qu'est-ce qu'une image Docker ?
Une image Docker est un **modèle immuable** contenant :
- Un système d'exploitation léger
- Les dépendances de l'application
- Le code de l'application
- Les instructions d'exécution

### Étapes pour créer une image

#### 1. Créer un Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

#### 2. Construire l'image
```bash
docker build -t mon-app:1.0 .
```
Options utiles :
- `-t` : spécifier un tag (nom:version)
- `-f` : indiquer un Dockerfile spécifique
- `--no-cache` : reconstruire sans utiliser le cache

#### 3. Vérifier l'image créée
```bash
docker images
```

#### 4. Exécuter un conteneur depuis l'image
```bash
docker run -p 3000:3000 mon-app:1.0
```

---

## Système de versionnement

### Semantic Versioning (semver)
Format standard : `MAJOR.MINOR.PATCH`

**Exemple** : `1.2.3`
- **1** = MAJOR : changements incompatibles (breaking changes)
- **2** = MINOR : nouvelles fonctionnalités rétro-compatibles
- **3** = PATCH : corrections de bugs

### Tags Docker

Les tags permettent d'identifier les versions d'une image.

```bash
# Tag spécifique
docker build -t mon-app:1.0.0 .

# Tag latest (recommandé pour la dernière version stable)
docker build -t mon-app:latest .

# Plusieurs tags pour la même image
docker tag mon-app:1.0.0 mon-app:latest
docker tag mon-app:1.0.0 mon-app:stable
```

### Bonnes pratiques
```bash
# ✅ BON : Tags explicites
docker build -t monapi:1.0.0 .
docker build -t monapi:1.0.0-alpha .

# ❌ MAUVAIS : sans version
docker build -t monapi .
```

---

## Docker Hub

### Qu'est-ce que Docker Hub ?
**Docker Hub** est le registre public officiel de Docker. C'est comme un "GitHub pour les images Docker".

- **URL** : https://hub.docker.com
- Où trouver et télécharger des images publiques (nginx, node, postgres, etc.)
- Où pusher et partager vos propres images
- Authentification gratuite avec des limitations, accès payant pour plus de fonctionnalités
- Lien possible avec GitHub/GitLab pour l'intégration CI/CD automatique

### S'inscrire sur Docker Hub
1. Aller sur https://hub.docker.com
2. Créer un compte (gratuit)
3. Valider l'email
4. Vous pouvez maintenant créer des repositories personnels

### Se connecter localement
```bash
docker login
# Entrer votre username et password
```

### Vérifier la connexion

**Sur Linux/Mac :**
```bash
docker info | grep Username
```

**Sur Windows (CMD) :**
```cmd
docker info | findstr Username
```

**Sur Windows (PowerShell) :**
```powershell
docker info | Select-String Username
```

**Ou simplement :**
```bash
docker info
```
Vous verrez les informations complètes de Docker.

---

## Se connecter à Docker Hub

### Connexion initiale
```bash
docker login
```
Vous serez invité à entrer :
- Username (ou email)
- Password (ou token d'accès personnel recommandé)

### Créer un Token d'accès (recommandé)
Plutôt que d'utiliser votre mot de passe :
1. Aller sur https://hub.docker.com/settings/security
2. Créer un "Personal Access Token"
3. Utiliser ce token pour `docker login`

### Se déconnecter
```bash
docker logout
```

---

## Push et Pull

### PULL : Télécharger une image

#### Depuis Docker Hub officiel
```bash
docker pull node:20-alpine
docker pull ubuntu:22.04
docker pull nginx:latest
```

#### Depuis votre registre personnel
```bash
docker pull votrenom/mon-app:1.0.0
```

#### Exécuter après pull
```bash
docker run -p 3000:3000 votrenom/mon-app:1.0.0
```

### PUSH : Envoyer vers Docker Hub

#### Format obligatoire
Les images doivent respecter ce format pour être pushées vers Docker Hub :
```
username/repository:tag
```

**Exemple :**
```
richa/api-cicd:1.0.0
```

#### Préalable : Préparer l'image avec le bon format

**Option 1 : Construire directement avec le bon nom**
```bash
docker build -t votrenom/mon-app:1.0.0 .
docker build -t votrenom/mon-app:latest .
```

**Option 2 : Retagger une image existante**
```bash
docker tag mon-app:1.0.0 votrenom/mon-app:1.0.0
docker tag votrenom/mon-app:1.0.0 votrenom/mon-app:latest
```

#### Envoyer l'image vers Docker Hub

```bash
# Se connecter d'abord
docker login

# Envoyer une version spécifique
docker push votrenom/mon-app:1.0.0

# Envoyer le tag latest
docker push votrenom/mon-app:latest

# Envoyer toutes les versions du repository
docker push votrenom/mon-app
```

#### Vérifier après le push
L'image est maintenant disponible publiquement sur https://hub.docker.com/r/votrenom/mon-app

---

## Repository et Registres

### Qu'est-ce qu'un Repository ?
Un **repository** est une collection d'images avec le même nom mais des tags (versions) différents.

**Sur Docker Hub :** Un repository = `votreusername/nom-app`

Il contient plusieurs versions :
```
votreusername/api-cicd:1.0.0
votreusername/api-cicd:1.0.1
votreusername/api-cicd:1.1.0
votreusername/api-cicd:latest
votreusername/api-cicd:develop
votreusername/api-cicd:alpha
```

### Lister les images locales
```bash
docker images

# Sortie exemple :
# REPOSITORY           TAG    IMAGE ID      CREATED
# richa/api-cicd       1.0.0  abc123def456  2 days ago
# richa/api-cicd       latest abc123def456  2 days ago
# node                 20     xyz789abc123  1 week ago
```

### Supprimer une image
```bash
# Supprimer une version spécifique
docker rmi richa/api-cicd:1.0.0

# Supprimer avec le format complet
docker rmi richa/api-cicd:latest

# Forcer la suppression
docker rmi -f richa/api-cicd:1.0.0
```

### Utiliser un registre privé (avancé)
Vous pouvez configurer Docker pour utiliser un registre privé au lieu de Docker Hub :
```bash
docker tag mon-app:1.0.0 registry.example.com/mon-app:1.0.0
docker push registry.example.com/mon-app:1.0.0
```

---

## Workflow complet exemple

### Scénario : Déployer une nouvelle version de votre API

**Étapes complètes du développement au déploiement :**

```bash
# 1. Développer et tester localement
npm run build
npm test

# 2. Créer l'image avec version sémantique
docker build -t votreusername/api-cicd:2.1.0 .

# 3. Tester le conteneur localement avant de le publier
docker run -p 3000:3000 votreusername/api-cicd:2.1.0
# Vérifier que http://localhost:3000 fonctionne

# 4. Se connecter à Docker Hub (si pas déjà connecté)
docker login

# 5. Envoyer la version spécifique vers Docker Hub
docker push votreusername/api-cicd:2.1.0

# 6. Créer et envoyer le tag latest
docker tag votreusername/api-cicd:2.1.0 votreusername/api-cicd:latest
docker push votreusername/api-cicd:latest

# 7. Vérifier sur Docker Hub
# https://hub.docker.com/r/votreusername/api-cicd

# 8. Quelqu'un d'autre (ou vous sur une autre machine) peut télécharger
docker pull votreusername/api-cicd:2.1.0
docker run -p 3000:3000 votreusername/api-cicd:2.1.0

# 9. Ou utiliser directement la dernière version
docker run -p 3000:3000 votreusername/api-cicd:latest
```

### Pour les futures versions
Quand vous avez une nouvelle version (ex: 2.2.0) :

```bash
npm run build && npm test
docker build -t votreusername/api-cicd:2.2.0 .
docker push votreusername/api-cicd:2.2.0
docker tag votreusername/api-cicd:2.2.0 votreusername/api-cicd:latest
docker push votreusername/api-cicd:latest
```

---

## Commandes utiles résumées

⚠️ **Note Windows** : Les commandes ci-dessous fonctionnent sur Linux/Mac. Pour Windows (CMD/PowerShell), voir les adaptations spécifiques.

### Construction et Exécution
```bash
# BUILD : Créer une image
docker build -t mon-app:1.0 .
docker build -t votreusername/mon-app:1.0.0 .  # Avec format Docker Hub

# RUN : Lancer un conteneur
docker run -p 3000:3000 mon-app:1.0

# Voir les images locales
docker images

# Voir les conteneurs en cours
docker ps

# Voir tous les conteneurs (même arrêtés)
docker ps -a
```

### Push/Pull vers Docker Hub
```bash
# LOGIN : Se connecter à Docker Hub
docker login

# PULL : Télécharger une image
docker pull votreusername/mon-app:1.0
docker pull node:20-alpine

# PUSH : Envoyer une image
docker push votreusername/mon-app:1.0

# TAG : Retagger une image
docker tag mon-app:1.0 votreusername/mon-app:1.0

# LOGOUT
docker logout
```

### Maintenance
```bash
# Voir les logs
docker logs nom-conteneur

# Inspecter une image
docker inspect votreusername/mon-app:1.0

# Supprimer une image
docker rmi votreusername/mon-app:1.0

# Supprimer un conteneur arrêté
docker rm nom-conteneur

# Supprimer tous les conteneurs inutilisés
docker container prune
```

---

## Points clés à retenir

✅ **Versionnement Semver** : Utilisez `MAJOR.MINOR.PATCH` (ex: 1.2.3)  
✅ **Tags explicites** : Toujours utiliser un tag, pas juste "latest"  
✅ **Docker Hub** : Registre public gratuit pour partager vos images (URL: hub.docker.com)  
✅ **Nommage** : Format obligatoire pour Docker Hub = `votreusername/repository:version`  
✅ **Push/Pull** : Envoyer vos images pour partage/réutilisation  
✅ **Repository** : Collection d'images avec le même nom, versions différentes  
✅ **Workflow** : Build → Test localement → Push → Les autres peuvent Pull  
✅ **Se connecter** : `docker login` nécessaire avant de pusher  
✅ **Latest** : Toujours maintenir un tag `latest` pour la version stable  
✅ **Token d'accès** : Plus sûr que le mot de passe pour `docker login`  
