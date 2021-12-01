const $productForm = document.getElementById("productForm");
const $userForm = document.getElementById("userForm");
const $messageForm = document.getElementById("messageForm");
const $productsTable = document.getElementById("productsTable");
const $usersQty = document.getElementById("usersQty");
const $inputEmail = document.getElementById("inputEmail");
const $inputMessage = document.getElementById("inputMessage");
const $btnLog = document.getElementById("btn-log");
const $btnSend = document.getElementById("btn-send");
const $messagesWrapper = document.getElementById("messages-wrapper");
const $tableErrors = document.getElementById("tableErrors");
const $messageErrors = document.getElementById("messageErrors");
let user = null;
const socket = io();

// (async function generateTemplates() {
//   let responseTable = fetch("/templates/table.hbs");
//   let responseChat = fetch("/templates/chats.hbs");
//   responseTable = await responseTable;
//   const templateTable = await responseTable.text();
//   responseChat = await responseChat;
//   const templateChat = await responseChat.text();

// })();

async function renderTable(file, data) {
  let response = await fetch(file);
  const templateFile = await response.text();
  const template = Handlebars.compile(templateFile);
  const html = template(data);
  return html;
}

function renderUsers(data) {
  const { usersQty } = data;
  return usersQty === 1
    ? `<b>1 Usuario Conectado</b>`
    : `<b>${usersQty} Usuarios Conectados</b>`;
}

function renderMessages(data) {
  const { messages } = data;
  let html = "";
  messages.forEach(message => {
    html += `
    <div class="message">
      <b>${message.user}</b>
      [ <span style="color:brown;">${new Date(
        message.fyh
      ).toLocaleString()}</span> ] :
      <i style="color:green;">${message.text}</i>
    </div>
    `;
  });
  return html;
}

socket.on("allProducts", async products => {
  $productsTable.innerHTML = await renderTable("/templates/table.hbs", {
    list: products
  });
});

socket.on("tableErrors", error => {
  $tableErrors.innerText = error;
  $tableErrors.classList.add("show");
  setTimeout(() => {
    $tableErrors.classList.remove("show");
  }, 4000);
});

socket.on("usersCount", async usersQty => {
  $usersQty.innerHTML = renderUsers({
    usersQty
  });
});

socket.on("allMessages", async messages => {
  $messagesWrapper.innerHTML = renderMessages({
    messages
  });
  $messagesWrapper.scrollTo(0, $messagesWrapper.scrollHeight);
});

socket.on("messageErrors", error => {
  $messageErrors.innerText = error;
  $messageErrors.classList.add("show");
  setTimeout(() => {
    $messageErrors.classList.remove("show");
  }, 4000);
});

$productForm.addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData($productForm);
  const product = {
    title: data.get("title"),
    price: data.get("price"),
    thumbnail: data.get("thumbnail")
  };
  socket.emit("loadProduct", product);
});

$userForm.addEventListener("submit", e => {
  e.preventDefault();
  if (user) {
    user = null;
    $inputEmail.disabled = false;
    $btnLog.innerText = "Login";
    $userForm.reset();
    $inputMessage.disabled = true;
    $btnSend.disabled = true;
    return;
  }
  const inputValue = $inputEmail.value;
  if (/^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$/.test(inputValue)) {
    user = inputValue;
    $inputEmail.disabled = true;
    $btnLog.innerText = "Logout";
    $inputMessage.disabled = false;
    $btnSend.disabled = !$inputMessage.value.trim();
  }
});

$inputMessage.addEventListener("input", e => {
  $btnSend.disabled = !$inputMessage.value.trim();
});

$messageForm.addEventListener("submit", e => {
  e.preventDefault();
  const inputValue = $inputMessage.value;
  if (inputValue.trim()) {
    const text = inputValue;
    socket.emit("newMessage", { user, text });
    $messageForm.reset();
    $btnSend.disabled = !$inputMessage.value.trim();
  }
});
