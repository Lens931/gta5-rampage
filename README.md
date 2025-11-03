# Tutoriel de déploiement du TypeScript de Rampage

Ce guide explique pas à pas comment installer les dépendances, compiler et déployer l'application Rampage écrite en TypeScript (Next.js 15 + React 19). Le tutoriel s'adresse à une personne qui part d'une machine vide et souhaite mettre le site en production.

## 1. Prérequis système

- **Node.js 20 ou 22** (recommandé: LTS). Vérifiez avec `node -v`.
- **npm 10+** (installé avec Node.js). Vérifiez avec `npm -v`.
- Un accès réseau sortant pour télécharger les dépendances NPM.
- (Optionnel) **Git** si vous clonez le dépôt directement depuis un serveur.

## 2. Récupération du projet

Cloner le dépôt ou télécharger l'archive :

```bash
# Via Git
git clone https://<votre-repo>/gta5-rampage.git
cd gta5-rampage

# OU en décompressant l'archive téléchargée puis :
cd gta5-rampage
```

## 3. Installation des dépendances

Installez toutes les bibliothèques TypeScript/React nécessaires via npm :

```bash
npm install
```

Cette commande crée le dossier `node_modules` et génère (si besoin) le fichier `package-lock.json` utilisé pour verrouiller les versions.

## 4. Configuration applicative

L'application n'exige aucune variable d'environnement obligatoire par défaut. Si vous ajoutez des secrets (API, clés, etc.), créez un fichier `.env.local` à la racine et exposez-les via `process.env`. Pensez à documenter ces variables pour l'équipe avant le déploiement.

## 5. Lancer l'application en développement

Pour valider rapidement que tout fonctionne avant de compiler :

```bash
npm run dev
```

Le serveur Next.js démarre (par défaut sur `http://localhost:3000`). Ouvrez l'URL dans un navigateur pour vérifier l'interface. Pour arrêter le serveur, utilisez `Ctrl+C` dans le terminal.

## 6. Vérification du linting TypeScript

Avant un déploiement, exécutez l'analyse statique :

```bash
npm run lint
```

Résolvez les éventuelles erreurs signalées pour garantir une compilation propre.

## 7. Construction de la version production

Compilez l'application en mode production :

```bash
npm run build
```

Cette étape génère l'artefact dans le dossier `.next/`. En cas d'échec, corrigez les erreurs TypeScript/React signalées par la commande.

## 8. Test local de la build

Lancez le serveur Node.js qui servira les fichiers compilés :

```bash
npm run start
```

Par défaut, le serveur écoute sur le port `3000`. Vérifiez à nouveau que le rendu correspond à vos attentes. Pour changer de port, exportez la variable `PORT` avant la commande (`PORT=8080 npm run start`).

## 9. Déploiement en production

Choisissez la stratégie qui correspond à votre environnement :

### Option A — Hébergement Node.js (VPS, VM, bare-metal)

1. Copiez le dossier du projet sur la machine cible (`scp`, `rsync`, pipeline CI/CD, etc.).
2. Installez Node.js et npm (version recommandée : 20 LTS).
3. Depuis la racine du projet :
   ```bash
   npm install
   npm run build
   ```
4. Démarrez le serveur avec un gestionnaire de processus (PM2, systemd, docker compose, etc.). Exemple avec `pm2` :
   ```bash
   npm install -g pm2
   pm2 start "npm run start" --name rampage
   pm2 save
   ```
5. Configurez un reverse-proxy (Nginx, Caddy, Traefik…) pour exposer l'application en HTTPS.

### Option B — Déploiement Vercel

1. Installez l'outil CLI : `npm install -g vercel`.
2. Connectez-vous : `vercel login`.
3. À la racine du projet :
   ```bash
   vercel link      # associe le dossier au projet Vercel
   vercel           # premier déploiement (prévisualisation)
   vercel --prod    # promotion en production
   ```
4. Les commandes `npm install`, `npm run build` et `npm run start` sont exécutées automatiquement par Vercel avec Node 18+.

### Option C — Conteneur Docker

1. Créez un `Dockerfile` (exemple minimal) :
   ```Dockerfile
   FROM node:22-alpine AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --omit=dev

   FROM node:22-alpine AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   FROM node:22-alpine
   WORKDIR /app
   ENV NODE_ENV=production
   COPY --from=deps /app/node_modules ./node_modules
   COPY --from=builder /app/.next ./.next
   COPY package*.json ./
   EXPOSE 3000
   CMD ["npm", "run", "start"]
   ```
2. Construisez l'image : `docker build -t rampage:latest .`
3. Lancez le conteneur : `docker run -p 3000:3000 rampage:latest`.

## 10. Automatiser avec CI/CD

- Ajoutez un workflow (GitHub Actions, GitLab CI, etc.) pour lancer `npm install`, `npm run lint` et `npm run build` à chaque push.
- Déployez automatiquement sur votre hébergement après validation des tests.

## 11. Maintenance post-déploiement

- Surveillez les logs (PM2, plateforme d'hébergement) pour détecter les erreurs runtime.
- Mettez à jour régulièrement les dépendances (`npm outdated`, puis `npm update` ou `npm install <pkg>@latest`).
- Planifiez des revues de sécurité (audit des paquets, rotation des secrets d'environnement).

Ce tutoriel couvre l'intégralité du cycle de déploiement pour la base TypeScript de Rampage. Adaptez chaque étape aux contraintes de votre infrastructure.
