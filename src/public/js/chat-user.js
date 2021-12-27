const $messagesWrapper = document.getElementById("messages-wrapper");
const $messageErrors = document.getElementById("messageErrors");

let userEmail = location.pathname.replace("/chat/", "");

const socket = io();

// renderiza vista de mensajes
function renderMessages(data) {
  const { messages } = data;
  let html = "";
  if (messages.length === 0) {
    return (html = `
              <div class="container p-5 my-4 h-100 bg-yellow rounded-3">
                <div class="py-5">
                  <h3 class="display-6 fw-bold">¡Oops!, vacío</h1>
                  <p>No se encontraron mensajes para <i>${userEmail}</i></p>
                </div>
              </div>
              `);
  }
  const today = new Date().toLocaleDateString();
  let prevDate;
  let prevUser;
  messages.forEach(message => {
    messageDate = new Date(message.timestamp).toLocaleDateString();
    const user = message.user;
    const color = stringToColour(user);
    if (prevDate !== messageDate) {
      html += `
        <div class="date">
          ${messageDate === today ? "Hoy" : messageDate}
        </div>
        `;
    }
    html += `
      <div class="message-box">
        <div class="color" style="background-color:${color};"></div>
        <div class="message">
        `;
    if (user !== prevUser || prevDate !== messageDate) {
      html += `
        <b style="color:${color};">${trimText(user, 23)}</b>
      `;
      prevUser = user;
    }
    html += `
          <i>${new Date(message.timestamp)
            .toLocaleTimeString()
            .slice(0, -3)}</i>
          <span>${message.text}</span>
        </div>
      </div>
    `;
    prevDate !== messageDate ? (prevDate = messageDate) : null;
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

// Escucha evento del envío de listado de mensajes
socket.on("allMessages", async messages => {
  const userMessages = messages.filter(message => message.user === userEmail);
  $messagesWrapper.innerHTML = renderMessages({
    messages: userMessages
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
