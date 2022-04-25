const $btnCloseModal = document.querySelector("#modalOrden .modal-footer .btn");
const $btnMyInfo = document.getElementById("myInfo");
const $btnMyOrders = document.getElementById("myOrders");
const $divModalMensajes = document.getElementById("modalOrden");
const $divModalMensajesFondo = document.getElementById("modalMensajesFondo");
const $logoImage = document.querySelector(".userStuff .userToolsData .image");
const $myOrdersTable = document.querySelector(
  ".userStuff .userToolsData .myOrdersTable"
);
const $myInfoTable = document.querySelector(
  ".userStuff .userToolsData .myInfoTable"
);
let myOrders = null;

// Funciones para inetractuar con la api de órdenes
const ordersApi = {
  getUserOrders: async () => {
    return fetch(`/api/ordenes/usuario`).then(data => data.json());
  }
};

function renderMyOrders(orders) {
  if (orders && orders.length > 0) {
    let html = `
      <table class="ordersTable table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>NÚMERO</th>
            <th>FECHA</th>
            <th>TOTAL</th>
            <th>ESTADO</th>
          </tr>
        </thead>
        <tbody>`;
    for (const order of orders) {
      const { number, timestamp, total, status } = order;
      html += `
          <tr data-order="${number}" class=${assignClassColor(status)}>
            <td>${number.toString().padStart(6, "0")}</td>
            <td>${new Date(timestamp).toLocaleString()}</td>
            <td>$${formatoPrecio(total)}</td>
            <td>${status.toUpperCase()}</td>
          </tr>`;
    }
    html += `
        </tbody>
      </table>`;
    return html;
  } else {
    return `<div class="emptyResults"><img src="/img/icon_search_r.svg" alt="Lupa"><h3>No hay resultados para mostrar</h3></div>`;
  }
}

// Asigna una clase para el color de la fila
function assignClassColor(status) {
  let colorClass;
  switch (status) {
    case "generada":
      colorClass = "table-light";
      break;
    case "procesando":
      colorClass = "table-info";
      break;
    case "terminada":
      colorClass = "table-success";
      break;
    case "cancelada":
      colorClass = "table-danger";
      break;
    default:
      colorClass = "";
      break;
  }
  return colorClass;
}

function renderModalOrder(order) {
  const { number, timestamp, address, cp, phone, status, total, products } =
    order;
  let html = `
    <div class="detail">
      <p><b>N°: ${number.toString().padStart(6, "0")}</b></p>
      <p><b>Fecha: </b>${new Date(timestamp).toLocaleString()}</p>
      <p><b>Domicilio: </b>${address}</p>
      <p><b>C.P.: </b>${cp}</p>
      <p><b>Teléfono: </b>${phone}</p>
      <p><i><b>ESTADO: </b>${status}</i></p>
      <table class="summaryTable animate__slideInUp table">
        <tbody>`;
  for (const item of products) {
    html += `
          <tr>
            <td><img class="imgWidthLoader card-img-top"
                src="${item.product.thumbnail}">
            </td>
            <td>
              <p>${item.product.title}</p>
            </td>
            <td class="text-center">${item.quantity}x</td>
            <td class="text-right font-weight-bold">$${formatoPrecio(
              item.product.price
            )}</td>
          </tr>`;
  }
  html += `
        </tbody>
      </table>
      <h3 class="total">Total: <span>$${formatoPrecio(total)}</span></h3>
    </div>`;
  return html;
}

function assignEventsToOrderTable() {
  document.querySelectorAll(".ordersTable tbody tr").forEach(elem =>
    elem.addEventListener("click", () => {
      const orderNumber = elem.dataset.order;
      const orderData = myOrders.find(order => order.number == orderNumber);
      document.querySelector(
        "#modalOrden .modal-content .modal-body"
      ).innerHTML = renderModalOrder(orderData);
      $divModalMensajes.classList.add("show");
      $divModalMensajesFondo.classList.add("show");
    })
  );
}

function formatoPrecio(num) {
  // Función para dar formato de precio con separadores de miles (.) y decimales (,)
  num = num.toFixed(2);
  let entero, decimales;
  if (num.indexOf(".") >= 0) {
    entero = num.slice(0, num.indexOf("."));
    decimales = num.slice(num.indexOf(".")).replace(".", ",");
  }
  let enteroFormateado = "";
  for (let i = 1; i <= entero.length; i++) {
    if (i % 3 == 0) {
      if (i == entero.length) {
        enteroFormateado =
          entero.substr(entero.length - i, 3) + enteroFormateado;
        break;
      }
      enteroFormateado =
        ".".concat(entero.substr(entero.length - i, 3)) + enteroFormateado;
    }
  }
  enteroFormateado = entero.slice(0, entero.length % 3) + enteroFormateado;
  num = enteroFormateado.concat(decimales);
  return num;
}

$btnMyInfo.addEventListener("click", () => {
  $logoImage.classList.add("hidden");
  $myOrdersTable.classList.add("hidden");
  $myInfoTable.classList.remove("hidden");
});

$btnMyOrders.addEventListener("click", async () => {
  $logoImage.classList.add("hidden");
  $myInfoTable.classList.add("hidden");
  $myOrdersTable.classList.remove("hidden");
  if (!myOrders) {
    $myOrdersTable.innerHTML = `<div class="loader dots"></div>`;
    const res = await ordersApi.getUserOrders();
    myOrders = res;
  }
  $myOrdersTable.innerHTML = renderMyOrders(myOrders);
  assignEventsToOrderTable();
});

$btnCloseModal.addEventListener("click", () => {
  $divModalMensajes.classList.remove("show");
  $divModalMensajesFondo.classList.remove("show");
});

// Accion botón logout
document.getElementById("btn-logout").addEventListener("click", e => {
  location.assign("/logout");
});
