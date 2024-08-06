console.log("el js funciona");

const socket = io();

socket.emit("mensaje", "Hola mundo");

socket.on("productos", (productos) => {
    mostrarProductos(productos);
})

const mostrarProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedor-productos");
    contenedorProductos.innerHTML = "";
    productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="${producto.img}" alt="${producto.title} " class="img-card">
            <h2 class="card-title"> ${producto.title} </h2>
            <p> ${producto.description} </p>
            <p> $${producto.price} </p>
            <button class="btn-card"> Eliminar </button>
        `
        contenedorProductos.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(producto.id);
        })
    })
}

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

// Subir productos desde el front


const titulo = document.getElementById("title");
const descripcion = document.getElementById("description");
const precio = document.getElementById("price");
const codigo = document.getElementById("code");
const stock = document.getElementById("stock");
const categoria = document.getElementById("category");
const botonProducto = document.getElementById("btn-prod");

botonProducto.addEventListener("click", () => {
    socket.emit("producto", {
        title: titulo.value, 
        description: descripcion.value,
        price: precio.value,
        code: codigo.value,
        stock: stock.value,
        category: categoria.value
    })
    titulo.value = "";
    descripcion.value = "";
    precio.value = "";
    codigo.value = "";
    stock.value = "";
    categoria.value = "";
})


