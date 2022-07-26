import express, { urlencoded } from "express";
import ContenedorC from "./contenedor/contenedorChat.js";
import { ContenedorP } from "./contenedor/contenedorProd.js";
import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { engine } from "express-handlebars";
import { normalizeChat } from "./helpers/normalizr.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const pass=  "develop.flavio";

const app = express();
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: `mongodb+srv://flavio:${pass}@cluster0.u8vqpio.mongodb.net/?retryWrites=true&w=majority`, mongoOptions: advancedOptions }),
    cookie: { maxAge: 60 * 1000 }
  })
);
app.use(express.json());
app.use(urlencoded({ extended: true }));
const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

const prodsContainer = new ContenedorP();
const chatContainer = new ContenedorC();

app.use(express.static("public"));

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
  })
);

app.set("views", "./src/hbs_views");
app.set("view engine", "hbs");

app.get("/login", (req, res) => {
  const { usuario } = req.session;
  if (!usuario)
    res.render("main", { sinProductos: true, productos: [], usuario });
  else {
    let prods = [];
    for (let i = 0; i < 5; i++) {
      prods.push(prodsContainer.generarProductos());
    }
    res.render("main", {
      sinProductos: false,
      productos: prods,
      usuario,
    });
  }
});
app.post("/login", (req, res) => {
  const { loginName } = req.body;
  req.session.usuario = loginName;
  res.redirect("/login");
});

app.get("/logout", (req, res) => {
  const { usuario } = { ...req.session };
  req.session.destroy();
  res.render("logout", { usuario });
});

socketServer.on("connection", async (socket) => {
  const chat = await chatContainer.getChat();
  socket.emit("launchApp", {
    chatHistory: chat,
  });

  // listener para añadir mensaje a la colección y actualizar el histial
  socket.on("newMessage", async ({ message }) => {
    console.log(message);
    const messageNormalized = normalizeChat(message);
    console.log("noramalized", messageNormalized);

    /*     await chatContainer.addMessage(message);
    const chat = await chatContainer.getChat();
    socketServer.sockets.emit("updateChat", chat); */
  });
});

httpServer.listen(8080, () => {
  console.log("Escuchando en el puerto 8080");
});
