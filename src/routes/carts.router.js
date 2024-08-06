import CartManager from "../controllers/cart-manager.js";
import { Router } from "express";

const router = Router();
const cartManager = new CartManager("./src/data/carritos.json");

router.get("/", async (req, res) => {
    try {
        const carritos = await cartManager.getCarts();
        res.json(carritos);
        
    } catch (error) {
        console.log("Error al obtener los carritos", error);
        res.status(500).json({ error: "Error del servidor", message: error.message });
    }
})

router.post("/", async (req, res) => {
    const nuevoCarrito = req.body; 

    try {
        await cartManager.createCart(nuevoCarrito),
        res.status(201).json({message: "Carrito creado exitosamente"});
    } catch (error) {
        console.log("error al crear un carrito", error);
        res.status(500).json({error: "Error del servidor", message: error.message});
    }
})

router.get("/:cid", async (req, res) => {
    let id = req.params.cid;

    try {
        const carrito = await cartManager.getCartById(parseInt(id));
        if (!carrito) {
            res.json({
                error: "Carrito no encontrado"
            });
        } else {
            res.json(carrito.products);
        }

    } catch (error) {
        console.log("Error al obtener el producto", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    const carritoId = parseInt(req.params.cid);
    const productoId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const uploadCart = await cartManager.addProduct(carritoId, productoId, quantity);
        res.json(uploadCart.products);
    } catch (error) {
        res.status(500).send("Error al ingresar un producto al carrito");
    }
})

export default router;