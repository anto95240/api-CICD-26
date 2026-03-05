import express from "express";
import products from "./data/products.json";
import dotenv from "dotenv";

dotenv.config();

interface Product {
  id: number;
  name?: string;
  price?: number;
  description?: string;
}

const app = express();

app.get("/", (req, res) => {
  console.log("Received request for /");
  res.send("Hello, World!");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const product = products.find((p: Product) => p.id === productId);
  res.json(product);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
