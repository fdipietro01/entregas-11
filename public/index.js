const socket = io();

let message;
const newUserForm = document.getElementById("registerForm");
newUserForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = document.getElementById("mail").value;
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const edad = document.getElementById("edad").value;
  const alias = document.getElementById("alias").value;
  const avatar = document.getElementById("avatar").value;

  if (id && nombre && apellido && edad && alias && avatar) {
    message = {author: { id, nombre, apellido, edad, alias, avatar }};
    const alert = document.getElementById("mailId")
    alert.innerHTML = `Logged as ${message.author.id}`;
    document.getElementById("mailId").classList.remove()
    alert.removeAttribute('class');
    alert.classList.add("bg-info", "text-white", "p-2", "rounded");
    document.getElementById("registerForm").reset();
    document.getElementById("message-btn").removeAttribute("disabled");
  } else {
    document.getElementById("mailId").innerHTML = `Error on logIn`;
    document.getElementById("mailId").classList.add("bg-danger", "text-white", "p-2", "rounded");
  }
});

const newMessageForm = document.getElementById("newMessageForm");
newMessageForm.addEventListener("submit", (event) => {
  event.preventDefault()
  message.message = document.getElementById("message").value;
  console.log(message)
  socket.emit("newMessage", { message });
  document.getElementById("message").value = "";
})
