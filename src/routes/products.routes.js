import ProductManager from "../controllers/product-manager.js";
import { Router } from "express";

const router = Router();
const productManager = new ProductManager("./src/data/productos.json");


router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const productos = await productManager.getProducts();
        res.json(productos);
        
    } catch (error) {
        console.log("Error al obtener los productos", error);
        res.status(500).json({ error: "Error del servidor", message: error.message });
    }
})

router.get("/:pid", async (req, res) => {
    let id = req.params.pid;

    try {
        const producto = await productManager.getProductById(parseInt(id));
        if (!producto) {
            res.json({
                error: "Producto no encontrado"
            });
        } else {
            res.json(producto);
        }

    } catch (error) {
        console.log("Error al obtener el producto", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

router.post("/", async (req, res) => {
    const nuevoProducto = req.body; 

    try {
        await productManager.addProduct(nuevoProducto),
        res.status(201).json({message: "Producto agregado exitosamente"});
    } catch (error) {
        console.log("error al agregar un producto ", error);
        res.status(500).json({error: "Error del servidor", message: error.message});
    }
})

router.put("/:pid", async (req, res) => {
    let id = req.params.pid; 
    const productoActualizado = req.body; 

    try {
        await productManager.updateProduct(parseInt(id), productoActualizado);
        res.json({message: "Producto actualizado correctamente"});
    } catch (error) {
        console.log("No pudimos actualizar el producto", error); 
        res.status(500).json({error: "Error del servidor"});
    }
} )

router.delete("/:pid", async (req, res) => {
    let id = req.params.pid; 

    try {
        await productManager.deleteProduct(id);
        res.json({message: "Producto eliminado correctamente"});
    } catch (error) {
        console.log("No pudimos eliminar el producto", error); 
        res.status(500).json({error: "Error del servidor"});
    }
} )


export default router;