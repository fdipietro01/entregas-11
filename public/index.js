const socket = io();
let templateCompiler;
const setTableProducts = (productos) => {
      let html;
      if (productos.length === 0) {
        html = templateCompiler({ productos: productos, sinProductos: true });
      } else {
        html = templateCompiler({ productos: productos, sinProductos: false });
      }
      document.getElementById("table").innerHTML = html;
};

socket.on("launchApp", ({ products, chatHistory }) => {
  initializingTable(products);
  initializingChat(chatHistory);
});

socket.on("updateTable", (productos) => {
  setTableProducts(productos);
});

socket.on("updateChat", (chatHistory) => initializingChat(chatHistory));

socket.on("RegisterOk", (confirmation) => {
  if (confirmation) {
    document.getElementById("message-btn").removeAttribute("disabled");
  }
});

const initializingTable = (productos) => {
  fetch("/table.hbs")
    .then((response) => response.text())
    .then((template) => {
      templateCompiler = Handlebars.compile(template);
      let html;
      if (productos.length === 0) {
        html = templateCompiler({ productos: productos, sinProductos: true });
      } else {
        html = templateCompiler({ productos: productos, sinProductos: false });
      }
      document.getElementById("table").innerHTML = html;
    });
};

const initializingChat = (chatHistory) => {
  if (chatHistory.length === 0) {
    const chat = document.getElementById("chat");
    chat.innerHTML = "No messages yet";
    chat.classList.add("input-group-text", "text-danger");
  } else {
    const chat = document.getElementById("chat");
    chat.innerHTML = "";
    chat.removeAttribute("class");
    chatHistory.forEach(({message}) => {
      const doc = document.createElement("p");
      doc.innerHTML = message;
      chat.appendChild(doc);
    });
  }
};

const addProd = () => {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const img = document.getElementById("img").value;
  socket.emit("newProduct", {title, price, img});
  document.getElementById("title").value = "";
  document.getElementById("price").value = "";
  document.getElementById("img").value = "";
  return false
};

const newMail = () => {
  const mail = document.getElementById("mail").value;
  socket.emit("newMail", mail);
  document.getElementById("mailId").innerHTML = `Logged as ${mail}`;
  document.getElementById("mailId").classList.add("bg-info", "text-white", "p-1", "rounded");
  document.getElementById("mail").value= "";
  return false;
};

const setNewMessage = () => {
  const text = document.getElementById("message").value;
  const date = new Date().toLocaleString();
  socket.emit("newMessage", { text, date });
  document.getElementById("message").value = "";
  return false;
};
