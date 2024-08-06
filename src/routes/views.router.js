import express from "express";
import { Router } from "express";
import ProductManager from "../controllers/product-manager.js";

const router = Router();
const productManager = new ProductManager("./src/data/productos.json");

router.get("/products", async (req, res) => {
    const productos = await productManager.getProducts();

    res.render("home", {productos});
})

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
})

export default router;