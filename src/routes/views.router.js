import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const products = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const nuevoArray = products.docs.map(producto => {
            const { _id, ...rest } = producto.toObject();
            return rest;
        });

        res.render("home", {
            productos: nuevoArray,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages
        });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }

})

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const carrito = await cartManager.getCartById(cartId);
  
        if (!carrito) {
           console.log("No existe ese carrito con el id");
           return res.status(404).json({ error: "Carrito no encontrado" });
        }
  
        const productosEnCarrito = carrito.products.map(item => ({
           product: item.product.toObject(),
           //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
           quantity: item.quantity
        }));
  
  
        res.render("carts", { productos: productosEnCarrito });
     } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
     }
  });

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
})

export default router;