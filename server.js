const express = require("express");
const app = express();
const Contenedor = require("./contenedor/contenedor");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");
const sqlConfig = require("./db/mySqlConfig");
const sqlLiteConfig = require("./db/sqliteConfig");

const productosContainer = new Contenedor("productos", sqlConfig);
productosContainer.createProdsTable();

const chatContainer = new Contenedor("chat", sqlLiteConfig);
chatContainer.createChatTable()

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public");
});

const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

socketServer.on("connection", async (socket) => {
  const productos = await productosContainer.getProducts();
  const chat = await chatContainer.getChat();
  socket.emit("launchApp", {
    products: productos,
    chatHistory: chat,
  });

  // listener para registrar nuevo correo y confirmarlo
  socket.on("newMail", (mail) => {
    socket.email = mail;
    socket.emit("RegisterOk", true);
  });

  // listener para añadir mensaje a la colección y actualizar el histial
  socket.on("newMessage", async({ text, date }) => {
    const message = `<p class="input-group-text">
    <span class="text-primary font-weight-bold"> ${socket.email} </span> &nbsp
    <span class="text-danger"> [${date}]: </span> &nbsp
    <span class="text-success font-italic"> ${text} </span>
    </p>`;
    await chatContainer.addMessage(message);
    const chat = await chatContainer.getChat();
    socketServer.sockets.emit("updateChat", chat);
  });

  // listener para añadir producto a la colección y actualizar la tabla
  socket.on("newProduct", async(producto) => {
    await productosContainer.addItem(producto);
    const productos = await productosContainer.getProducts();
    socketServer.sockets.emit("updateTable", productos);
  });
});
httpServer.listen(8080, () => {
  console.log("Escuchando en el puerto 8080");
});
