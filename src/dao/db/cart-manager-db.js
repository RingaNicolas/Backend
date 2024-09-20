import CartModel from "../models/cart.model.js";

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({products: []});
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error al crear el carrito");
        }
    }
    
    async getCarts() {
        try {
            const carritos = await CartModel.find();
            return carritos;
        } catch (error) {
            console.log("no se encontraron carritos");
        }
    }

    async getCartById(carritoId) {
        try {
            const carritoBuscado = await CartModel.findById(carritoId);
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
            const existeProducto = carrito.products.find(p => p.product.toString() === productoId);
    
            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productoId, quantity });
            }
    
            carrito.markModified("products");
            await carrito.save();

            return carrito;

        } catch (error) {
            console.log("No se pudo agregar el producto al carrito")
        }
    }

    async deleteItem(itemId, cartId) {
        try {
            const cart = await CartModel.findById(cartId);
    
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
            const index = cart.products.findIndex(item => item._id.toString() === itemId.toString());
    
            if (index !== -1) {
                cart.products.splice(index, 1);
                await cart.save();
                console.log("Producto eliminado del carrito");
            } else {
                console.log("El producto que desea eliminar no se encuentra en el carrito");
            }
        } catch (error) {
            console.error("Error eliminando el producto", error);
            throw error;
        }
    }

    async emptyCart(cartId) {
        try {
            await CartModel.findByIdAndUpdate(
                cartId,
                { $set: { products: [] } },
                { new: true }
            );
            console.log("Carrito vaciado correctamente");
        } catch (error) {
            console.log("Error vaciando el carrito", error);
            throw error;
        }
    }

}



export default CartManager;