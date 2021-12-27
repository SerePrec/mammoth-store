const $userForm = document.getElementById("userForm");
const $messageForm = document.getElementById("messageForm");
const $usersQty = document.getElementById("usersQty");
const $inputEmail = document.getElementById("inputEmail");
const $inputMessage = document.getElementById("inputMessage");
const $btnSend = document.getElementById("btn-send");
const $messagesWrapper = document.getElementById("messages-wrapper");
const $messageErrors = document.getElementById("messageErrors");
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
  const today = new Date().toLocaleDateString();
  let prevDate;
  let prevUser;
  let prevToUser;
  messages.forEach(message => {
    let { id, type, user, text, timestamp } = message;
    const toUser = type === "admin" ? user : null;
    const color = stringToColour(user);
    user = type === "admin" ? "Mammoth Bike Store" : user;
    messageDate = new Date(timestamp).toLocaleDateString();
    if (prevDate !== messageDate) {
      html += `
        <div class="date">
          ${messageDate === today ? "Hoy" : messageDate}
        </div>
        `;
    }
    html += `
      <div class="message-box ${type === "admin" ? "admin" : ""}">
        <div class="color" style="background-color:${
          type === "admin" ? "#b30404" : color
        };"></div>
        <div class="message ${
          type === "user" ? "clickable" : ""
        }" data-id="${id}" data-user="${user}">
        `;
    if (
      user !== prevUser ||
      toUser !== prevToUser ||
      prevDate !== messageDate
    ) {
      html += `
        <b style="color:${type === "admin" ? "#b30404" : color};">${trimText(
        user,
        23
      )}</b>
      `;
    }
    html += `
      <i>${new Date(timestamp).toLocaleTimeString().slice(0, -3)}</i>
      `;
    if (toUser && toUser !== "all" && toUser !== prevToUser) {
      html += `
        <div class="toUser">
          <i>Re:</i>
          <b style="color:${color};">${trimText(toUser, 23)}</b>
        </div>
        `;
    }
    html += `
          <span>${text}</span>
        </div>
      </div>
      `;
    prevDate !== messageDate ? (prevDate = messageDate) : null;
    prevUser !== user ? (prevUser = user) : null;
    prevToUser !== toUser ? (prevToUser = toUser) : null;
  });
  return html;
}

function stringToColour(string) {
  const colors = [
    "#e51c23",
    "#e7477d",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#5677fc",
    "#03a9f4",
    "#11c4db",
    "#009688",
    "#259b24",
    "#8bc34a",
    "#ebf157",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#607d8b"
  ];
  let hash = 0;
  if (string.length === 0) return hash;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = ((hash % colors.length) + colors.length) % colors.length;
  return colors[hash];
}

function trimText(text, maxChars) {
  if (text.length > maxChars) {
    text = text.slice(0, maxChars - 3).concat("...");
  }
  return text;
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

// Acciones al tipear mensaje
$inputMessage.addEventListener("input", e => {
  $btnSend.disabled = !$inputMessage.value.trim();
});

// Acciones al enviar el mensaje
$messageForm.addEventListener("submit", e => {
  e.preventDefault();
  const user = $inputEmail.value.trim() || "all";
  const inputValue = $inputMessage.value;
  if (inputValue.trim()) {
    const text = inputValue;
    socket.emit("adminMessage", { user, text });
    $messageForm.reset();
    $inputMessage.focus();
    $btnSend.disabled = !$inputMessage.value.trim();
  }
});

$messagesWrapper.addEventListener("click", e => {
  const $message = e.target.closest(".message.clickable");
  if (!$message) return;
  $inputEmail.value = $message.dataset.user;
});
