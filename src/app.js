import express from "express"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewRouter from "./routes/views.router.js"
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./dao/db/product-manager-db.js";
import "./database.js";

const productManager = new ProductManager();

const app = express();
const PUERTO = 8080;


app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.static("./src/public"));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewRouter);


const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto http://localhost:${PUERTO}`);
})

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    socket.emit("productos", await productManager.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        socket.emit("productos", await productManager.getProducts());
    })

    socket.on("producto", data => {
        productManager.addProduct(data);
    })

})

