import mongoose from "mongoose";

mongoose.connect("mongodb+srv://nicoaringa:coderhouse@cluster0.uz6pz.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conectados a la BD"))
    .catch(() => console.log("Error al conectarse a la base de datos"))