const $productForm = document.getElementById("productForm");
const $productsTable = document.getElementById("productsTable");
const $productErrors = document.getElementById("productErrors");
const $userForm = document.getElementById("userForm");
const $messageForm = document.getElementById("messageForm");
const $usersQty = document.getElementById("usersQty");
const $inputEmail = document.getElementById("inputEmail");
const $inputMessage = document.getElementById("inputMessage");
const $btnLog = document.getElementById("btn-log");
const $btnSend = document.getElementById("btn-send");
const $messagesWrapper = document.getElementById("messages-wrapper");
const $messageErrors = document.getElementById("messageErrors");
let user = null;
const socket = io();

// Renderiza la tabla de productos utilizando template de hbs
async function renderTable(file, data) {
  let response = await fetch(file);
  const templateFile = await response.text();
  const template = Handlebars.compile(templateFile);
  const html = template(data);
  return html;
}

// Renderiza vista de cantidad de usuarios
function renderUsers(data) {
  const { usersQty } = data;
  return usersQty === 1
    ? `<b>1 Usuario Conectado</b>`
    : `<b>${usersQty} Usuarios Conectados</b>`;
}

// renderiza vista de mensajes
function renderMessages(data) {
  const { messages } = data;
  let html = "";
  messages.forEach(message => {
    html += `
    <div class="message">
      <b>${message.user}</b>
      [ <span style="color:brown;">${new Date(
        message.timestamp
      ).toLocaleString()}</span> ] :
      <i style="color:green;">${message.text}</i>
    </div>
    `;
  });
  return html;
}

// Escucha evento del envío del listado de productos
socket.on("allProducts", async products => {
  $productsTable.innerHTML = await renderTable("/templates/table.hbs", {
    list: products
  });
});

// Escucha evento de errores personalizados asociados a productos
socket.on("productErrors", error => {
  $productErrors.innerText = error;
  $productErrors.classList.add("show");
  setTimeout(() => {
    $productErrors.classList.remove("show");
  }, 4000);
});

// Escucha evento de cantidad de usuarios conectados
socket.on("usersCount", async usersQty => {
  $usersQty.innerHTML = renderUsers({
    usersQty
  });
});

// Escucha evento del envío de listado de mensajes
socket.on("allMessages", async messages => {
  $messagesWrapper.innerHTML = renderMessages({
    messages
  });
  $messagesWrapper.scrollTo(0, $messagesWrapper.scrollHeight);
});

// Escucha evento de errores personalizados asociados a mensajes
socket.on("messageErrors", error => {
  $messageErrors.innerText = error;
  $messageErrors.classList.add("show");
  setTimeout(() => {
    $messageErrors.classList.remove("show");
  }, 4000);
});

// Acciones al enviar el formulario de productos
$productForm.addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData($productForm);
  const product = {
    title: data.get("title"),
    price: data.get("price"),
    thumbnail: data.get("thumbnail")
  };
  socket.emit("saveProduct", product);
  $productForm.reset();
});

// Acciones al loguearse
$userForm.addEventListener("submit", e => {
  e.preventDefault();
  if (user) {
    user = null;
    $inputEmail.disabled = false;
    $inputEmail.classList.remove("logged");
    $btnLog.innerText = "Login";
    $btnLog.classList.remove("logged");
    $userForm.reset();
    $inputMessage.disabled = true;
    $btnSend.disabled = true;
    return;
  }
  const inputValue = $inputEmail.value;
  if (/^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$/.test(inputValue)) {
    user = inputValue;
    $inputEmail.disabled = true;
    $inputEmail.classList.add("logged");
    $btnLog.innerText = "Logout";
    $btnLog.classList.add("logged");
    $inputMessage.disabled = false;
    $inputMessage.focus();
    $btnSend.disabled = !$inputMessage.value.trim();
  }
});

// Acciones al tipear mensaje
$inputMessage.addEventListener("input", e => {
  $btnSend.disabled = !$inputMessage.value.trim();
});

// Acciones al enviar el mensaje
$messageForm.addEventListener("submit", e => {
  e.preventDefault();
  const inputValue = $inputMessage.value;
  if (user && inputValue.trim()) {
    const text = inputValue;
    socket.emit("newMessage", { user, text });
    $messageForm.reset();
    $inputMessage.focus();
    $btnSend.disabled = !$inputMessage.value.trim();
  }
});
