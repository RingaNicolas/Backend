import ProductManager from "../dao/db/product-manager-db.js";
import { Router } from "express";

const router = Router();
const productManager = new ProductManager();


router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const productos = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: productos,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        console.log("Error al obtener los productos", error);
        res.status(500).json({ error: "Error del servidor", message: error.message });
    }
})

router.get("/:pid", async (req, res) => {
    let id = req.params.pid;

    try {
        const producto = await productManager.getProductById(id);
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
            res.status(201).json({ message: "Producto agregado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error del servidor", message: error.message });
    }
})

router.put("/:pid", async (req, res) => {
    let id = req.params.pid;
    const productoActualizado = req.body;

    try {
        await productManager.updateProduct(id, productoActualizado);
        res.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        console.log("No pudimos actualizar el producto", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

router.delete("/:pid", async (req, res) => {
    let id = req.params.pid;

    try {
        await productManager.deleteProduct(id);
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.log("No pudimos eliminar el producto", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})


export default router;