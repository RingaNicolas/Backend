import CartManager from "../dao/db/cart-manager-db.js";
import { Router } from "express";
import CartModel from "../dao/models/cart.model.js";

const router = Router();
const cartManager = new CartManager();

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
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
        res.status(201).json({message: "Carrito creado exitosamente"});
    } catch (error) {
        console.log("error al crear un carrito", error);
        res.status(500).json({error: "Error del servidor", message: error.message});
    }
})

router.get("/:cid", async (req, res) => {
    const id = req.params.cid;

    try {
        const cart = await CartModel.findById(id).populate("products.product");
            
        if (!cart) {
            console.log("El carrito que estás buscando no existe");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(cart.products);
    } catch (error) {
        console.log("Error al obtener el producto", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    const carritoId = req.params.cid;
    const productoId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const uploadCart = await cartManager.addProduct(carritoId, productoId, quantity);
        res.json(uploadCart.products);
    } catch (error) {
        res.status(500).send("Error al ingresar un producto al carrito");
    }
})

router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.emptyCart(cartId);
        res.send("Carrito vaciado correctamente");
    } catch (error) {
        console.log(`Error intentando vaciar el carrito: ${cartId}`);
        res.status(500).json({ error: "Error del servidor" });
    }
});

router.delete("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        await cartManager.deleteItem(productId, cartId);
        console.log("Producto eliminado correctamente del carrito");
    } catch (error) {
        console.error("Error eliminando el producto del carrito", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

export default router;