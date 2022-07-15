import express from "express";
import ContenedorC from "./contenedor/contenedorChat.js";
import { ContenedorP } from "./contenedor/contenedorProd.js";
import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { engine } from "express-handlebars";
import { normalizeChat } from "./helpers/normalizr.js";

const app = express();
const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

const prodsContainer = new ContenedorP();
const chatContainer = new ContenedorC();


app.use(express.static("public"));

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs"
  })
);


app.set("views", "./src/hbs_views");
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  let prods = [];
  for (let i = 0; i < 5; i++) {
    prods.push(prodsContainer.generarProductos());
  }

  res.render("main",{sinProductos : true, productos : []})
});

app.get("/api/prods", (req, res) => {
  let productos = [];
  for (let i = 0; i < 5; i++) {
    productos.push(prodsContainer.generarProductos());
  }
  res.render("main",{sinProductos : false, productos})
});

socketServer.on("connection", async (socket) => {
  const chat = await chatContainer.getChat();
  socket.emit("launchApp", {
    chatHistory: chat,
  });

  // listener para añadir mensaje a la colección y actualizar el histial
  socket.on("newMessage", async ({ message }) => {
    console.log(message)
    const messageNormalized = normalizeChat(message);
    console.log("noramalized", messageNormalized)
    
/*     await chatContainer.addMessage(message);
    const chat = await chatContainer.getChat();
    socketServer.sockets.emit("updateChat", chat); */
  });
});

httpServer.listen(8080, () => {
  console.log("Escuchando en el puerto 8080");
});
