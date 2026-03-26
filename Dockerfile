FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Générer le client Prisma avant de transpiler le TypeScript
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
    
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="file:./dev.db"

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
# Fichier de config Prisma 7 indispensable
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000

# Lancer la migration (crée le fichier SQLite si manquant) puis démarrer l'API
CMD sh -c "npx prisma migrate deploy && node dist/index.js"