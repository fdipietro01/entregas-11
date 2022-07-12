import express from "express";
import ContenedorC from "./contenedor/contenedorChat.js";
import { ContenedorP } from "./contenedor/contenedorProd.js";
import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

const app = express();

const prodsContainer = new ContenedorP();
const chatContainer = new ContenedorC();

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public");
});

app.get("/api/productos-test", (req, res) => {
  let prods = [];
  for (let i = 0; i < 5; i++) {
    prods.push(prodsContainer.generarProductos());
  }
  console.log(prods);
  socketServer.emit("updateTable", "prods");
  res.send(prods);
});

const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

socketServer.on("connection", async (socket) => {
  const chat = await chatContainer.getChat();
  socket.emit("launchApp", {
    products: [],
    chatHistory: chat,
  });

  app.get("/api/productos-test", (req, res) => {
    let prods = [];
    for (let i = 0; i < 5; i++) {
      prods.push(prodsContainer.generarProductos());
    }
    /* res.json({prods}) */
    socketServer.sockets.emit("updateTable", prods, ()=>{"socket sent"});
    res.send(prods);
  });

  // listener para registrar nuevo correo y confirmarlo
  socket.on("newMail", (mail) => {
    socket.email = mail;
    socket.emit("RegisterOk", true);
  });

  // listener para añadir mensaje a la colección y actualizar el histial
  socket.on("newMessage", async ({ text, date }) => {
    const message = `<p class="input-group-text">
    <span class="text-primary font-weight-bold"> ${socket.email} </span> &nbsp
    <span class="text-danger"> [${date}]: </span> &nbsp
    <span class="text-success font-italic"> ${text} </span>
    </p>`;
    await chatContainer.addMessage(message);
    const chat = await chatContainer.getChat();
    socketServer.sockets.emit("updateChat", chat);
  });
});
app.get("/api/productos-test", (req, res) => {
  let prods = [];
  for (let i = 0; i < 5; i++) {
    prods.push(prodsContainer.generarProductos());
  }
  socketServer.sockets.emit("holaa", "iiiiiiiooooo");
});
httpServer.listen(8080, () => {
  console.log("Escuchando en el puerto 8080")
  socketServer.sockets.emit("algo", "hola");
});
