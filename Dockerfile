# Alpine distribution légère de nodejs sous la version 20
FROM node:20-alpine AS build
# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier le code source
COPY . .
# ou => COPY src ./src
RUN npm run build

# Utilisation d'une image plus légère pour l'exécution
FROM node:20-alpine AS runtime
WORKDIR /app
    
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/index.js"]
# CMD ["npm", "start"]
