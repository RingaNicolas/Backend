import fs from "fs";

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.ultId = 0;

        
        this.addCarts();
    }

    async addCarts() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al cargar el carrito");
            await this.saveCarts();
        }
    }

    async saveCarts() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        const newCart = {
            id: ++this.ultId,
            products: []
        };

        this.carts.push(newCart);

        await this.saveCarts();
        return newCart;
    }

    async getCartById(carritoId) {
        try {
            const carritoBuscado = this.carts.find(carrito => carrito.id === carritoId);

            if (!carritoBuscado) {
                throw new Error("No existe un carrito con ese id");
            }

            return carritoBuscado;

        } catch (error) {
            console.log("Error al obtener el carrito deseado");
            throw error;
        }
    }

    async addProduct(carritoId, productoId, quantity = 1) {
        try {
            const carrito = await this.getCartById(carritoId);
            const existeProducto = carrito.products.find(p => p.product === productoId);
    
            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productoId, quantity });
            }
    
            await this.saveCarts();
            return carrito;

        } catch (error) {
            console.log("No se pudo agregar el producto al carrito")
        }
    }

}



export default CartManager;