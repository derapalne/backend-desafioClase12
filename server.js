const ProductosAPI = require("./productosApi");
const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const Archivador = require('./archivador');

const app = express();
const productosApi = new ProductosAPI();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const archivador = new Archivador('chat');
archivador.cargarMensajes();
console.log(archivador.mensajes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
app.set("views", "./public/views");
app.set("view engine", "ejs");

console.log(archivador.mensajes);

productosApi.addProducto({
    title: "Onigiri",
    price: 200,
    thumbnail: "https://cdn3.iconfinder.com/data/icons/food-solid-in-the-kitchen/512/Onigiri-256.png",
});

productosApi.addProducto({
    title: "Biological Warfare",
    price: 800000000,
    thumbnail: "https://cdn0.iconfinder.com/data/icons/infectious-pandemics-1/480/12-virus-256.png",
});

productosApi.addProducto({
    title: "Eg",
    price: 120,
    thumbnail:
        "https://cdn3.iconfinder.com/data/icons/food-solid-in-the-kitchen/512/Egg_and_bacon-256.png",
});

app.get("/", (req, res) => {
    res.render("productosForm", { prods: productosApi.productos, mensajes: archivador.mensajes });
});

// app.post("/productos", (req, res) => {
//     productosApi.addProducto(req.body);
//     res.render("productosForm", { prods: productosApi.productos });
// });

// let mensajes = '';

const PORT = 8080;
httpServer.listen(PORT, () => console.log("Lisstooooo ", PORT));

console.log(archivador.mensajes);

io.on("connection", (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id.substring(0, 4)}`);
    socket.on("productoAgregado", (producto) => {
        // console.log(producto);
        const respuestaApi = productosApi.addProducto(producto);
        //console.log(productosApi.getAll());
        if (isNaN(respuestaApi)) {
            socket.emit("productoInvalido", respuestaApi);
        } else {
            io.sockets.emit("productosRefresh", productosApi.getAll());
        }
    });
    socket.on('mensajeEnviado', (mensaje) => {
        if(mensaje.message != "borrar literalmente todo 123") {
            archivador.guardarMensaje(mensaje).then(
                io.sockets.emit('chatRefresh', mensaje)
            );
        } else {
            archivador.borrarMensajes();
            archivador.cargarMensajes();
            mensaje.message = "Chat borrado";
            io.sockets.emit('chatRefresh', mensaje);
        }
    })
});
