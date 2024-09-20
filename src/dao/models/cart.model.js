import mongoose from "mongoose";

const cartShcema = new mongoose.Schema({
    products: [
        {
            product: {
                type: String,
            },
            quantity: Number,
        }
    ]
})

const CartModel = mongoose.model("carts", cartShcema);

export default CartModel;