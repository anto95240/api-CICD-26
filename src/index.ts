import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import NodeCache from "node-cache";

dotenv.config();

const app = express();
const myCache = new NodeCache({ stdTTL: 60 }); // Cache de 60s

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

app.get("/products", async (req, res) => {
  const cacheKey = "all_products";
  
  // OPTIMISATION : On vérifie le cache en RAM en premier
  const cachedProducts = myCache.get(cacheKey);
  if (cachedProducts) {
    return res.json(cachedProducts);
  }

  // Si pas en cache, on tape la BDD (plus lent)
  const products = await prisma.product.findMany();
  
  // On sauvegarde pour les requêtes suivantes
  myCache.set(cacheKey, products);
  res.json(products);
});

// ... autres routes

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running`);
});