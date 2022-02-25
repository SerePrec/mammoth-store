const $userForm = document.getElementById("userForm");
const $messageForm = document.getElementById("messageForm");
const $usersQty = document.getElementById("usersQty");
const $inputEmail = document.getElementById("inputEmail");
const $inputMessage = document.getElementById("inputMessage");
const $btnLog = document.getElementById("btn-log");
const $btnFilter = document.getElementById("btn-filter");
const $btnSend = document.getElementById("btn-send");
const $messagesWrapper = document.getElementById("messages-wrapper");
const $messageErrors = document.getElementById("messageErrors");
let user = null;

// eslint-disable-next-line no-undef
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
  const prevData = { prevDate: null, prevUser: null, prevToUser: null };
  messages.forEach(message => {
    const { type, timestamp } = message;
    const messageDate = new Date(timestamp).toLocaleDateString();
    if (prevData.prevDate !== messageDate) {
      html += `
        <div class="date">
          ${messageDate === today ? "Hoy" : messageDate}
        </div>
        `;
    }
    if (type === "user") {
      html += renderUserMessage(message, prevData);
    } else if (type === "admin") {
      html += renderAdminMessage(message, prevData);
    }
    prevData.prevDate !== messageDate
      ? (prevData.prevDate = messageDate)
      : null;
  });
  return html;
}

function renderUserMessage(message, prevData) {
  let html = "";
  const { prevUser, prevDate } = prevData;
  const { id, user, text, timestamp } = message;
  const color = stringToColour(user);
  const messageDate = new Date(timestamp).toLocaleDateString();
  html += `
      <div class="message-box">
        <div class="color" style="background-color:${color};"></div>
        <div class="message">
        `;
  if (user !== prevUser || prevDate !== messageDate) {
    html += `
        <b style="color:${color};">${trimText(user, 23)}</b>
      `;
  }
  html += `
          <i>${new Date(timestamp).toLocaleTimeString().slice(0, -3)}</i>
          <span>${text}</span>
        </div>
      </div>
      `;

  prevData.prevUser !== user ? (prevData.prevUser = user) : null;
  return html;
}

function renderAdminMessage(message, prevData) {
  let html = "";
  const { prevUser, prevToUser, prevDate } = prevData;
  let { user, text, replyMessage, timestamp } = message;
  const toUser = user;
  const color = stringToColour(user);
  user = "Mammoth Bike Store";
  const messageDate = new Date(timestamp).toLocaleDateString();

  html += `
      <div class="message-box admin">
        <div class="color" style="background-color:#b30404;"></div>
         <div class="message ${
           toUser === "all" ? "toAll" : "toUser"
         }" style="border-color:${toUser === "all" ? "#b30404" : color};">
        `;
  if (user !== prevUser || toUser !== prevToUser || prevDate !== messageDate) {
    html += `
        <b style="color:#b30404;">${user}</b>
      `;
  }
  html += `
      <i>${new Date(timestamp).toLocaleTimeString().slice(0, -3)}</i>
      `;
  if (
    toUser &&
    toUser !== "all" &&
    (user !== prevUser ||
      toUser !== prevToUser ||
      replyMessage ||
      prevDate !== messageDate)
  ) {
    html += `
        <div class="toUser ${
          replyMessage ? "with-border" : ""
        }" style="border-color:${color};">
          <i>Re:</i>
          <b style="color:${color};">${trimText(toUser, 23)}</b>
        `;
    if (replyMessage) {
      html += `
        <i class="d-block">${replyMessage}</i>
        `;
    }
    html += `</div>`;
  }
  html += `
          <span>${text}</span>
        </div>
      </div>
      `;

  prevData.prevUser !== user ? (prevData.prevUser = user) : null;
  prevData.prevToUser !== toUser ? (prevData.prevToUser = toUser) : null;
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
  if (/^([a-z0-9_.-]+)@([a-z0-9_.-]+)\.([a-z.]{2,6})$/.test(inputValue)) {
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

$btnFilter.addEventListener("click", () => {
  location.assign(`/chat/${$inputEmail.value}`);
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

// temporizador p/iniciar sesión de chat luego de cargar la página
setTimeout(() => {
  const clickear = new MouseEvent("click", {
    bubbles: true,
    cancelable: true
  });
  $btnLog.dispatchEvent(clickear);
}, 1000);

// Accion botón logout
document.getElementById("btn-logout").addEventListener("click", e => {
  location.assign("/logout");
});
