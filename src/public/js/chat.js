const $productInfoMessages = document.getElementById("productInfoMessages");
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
