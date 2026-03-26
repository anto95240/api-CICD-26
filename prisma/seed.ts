// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.createMany({
    data: [
      { name: "Produit 1", price: 10.5, description: "Description 1" },
      { name: "Produit 2", price: 20.0, description: "Description 2" },
      // Ajoutez plus de produits ici pour simuler une vraie DB
    ],
  });
  console.log("Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
