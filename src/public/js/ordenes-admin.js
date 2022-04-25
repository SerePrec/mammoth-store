/* eslint-disable no-undef */
//Variables
//DOM *********************************
const $btnCloseModal = document.querySelector(
  "#modalOrden .modal-footer .btn.close"
);
const $btnUpdateModal = document.querySelector(
  "#modalOrden .modal-footer .btn.update"
);
const $divModalMensajes = document.getElementById("modalOrden");
const $divModalMensajesFondo = document.getElementById("modalMensajesFondo");
const $maskElement = $("main");
const $orderInfoMessages = document.getElementById("orderInfoMessages");
const $orderList = document.getElementById("orderList");

// **************************************************************************//
// *********************** Definiciones de funciones ************************//
// **************************************************************************//

// Funciones para inetractuar con la api de órdenes
const ordersApi = {
  getOrders: async () => {
    return fetch(`/api/ordenes`).then(data => data.json());
  },
  getOrder: async id => {
    return fetch(`/api/ordenes/${id}`).then(data => data.json());
  },
  updateOrderStatus: async (id, status) => {
    return fetch(`/api/ordenes/${id}/estado`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    }).then(data => data.json());
  }
};

// Funciones CRUD ordenes  ***************************************************
//*****************************************************************************
function getOrder(id) {
  applyLoaderMask($maskElement);
  ordersApi
    .getOrder(id)
    .then(processResponse())
    .then(data => {
      if (data) {
        showOrder(data);
        assignEventsToOrderModal(data.status);
      }
    })
    .catch(error => {
      console.error(error);
    })
    .finally(() => removeLoaderMask($maskElement));
}

function updateOrderStatus(id, status) {
  applyLoaderMask($maskElement);
  ordersApi
    .updateOrderStatus(id, status)
    .then(processResponse("Estado de orden modificado"))
    .then(data => {
      if (data) {
        return updateOrderList();
      }
    })
    .catch(error => {
      console.error(error);
    })
    .finally(() => removeLoaderMask($maskElement));
}

// Funciones para mostrar y/o actualizar la información de las ordenes ******
//***************************************************************************

function renderOrderTable(orders) {
  let html = "";
  if (orders && orders.length > 0) {
    for (const order of orders) {
      const { id, number, timestamp, username, total, status } = order;
      html += `
          <tr data-order="${id}" class=${assignClassColor(status)}>
            <td>${number.toString().padStart(6, "0")}</td>
            <td>${new Date(timestamp).toLocaleString()}</td>
            <td>${username}</td>
            <td>$${formatoPrecio(total)}</td>
            <td>${status.toUpperCase()}</td>
          </tr>`;
    }
  }
  return html;
}

function showOrder(orderData) {
  $btnUpdateModal.classList.add("hidden");
  document.querySelector("#modalOrden .modal-content .modal-body").innerHTML =
    renderModalOrder(orderData);
  $divModalMensajes.classList.add("show");
  $divModalMensajesFondo.classList.add("show");
}

function renderModalOrder(order) {
  const {
    id,
    number,
    username,
    name,
    timestamp,
    address,
    cp,
    phone,
    status,
    total,
    products
  } = order;
  let html = `
    <div class="detail">
      <p><b>N°: ${number.toString().padStart(6, "0")}</b></p>
      <p><b>Usuario: </b>${username}</p>
      <p><b>Nombre: </b>${name}</p>
      <p><b>Fecha: </b>${new Date(timestamp).toLocaleString()}</p>
      <p><b>Domicilio: </b>${address}</p>
      <p><b>C.P.: </b>${cp}</p>
      <p><b>Teléfono: </b>${phone}</p>
      <div class="row mb-3">
        <label for="status" class="col-sm-2 col-form-label col-form-label-sm">
          <i><b>ESTADO: </b></i>
        </label>
        <div class="col-sm-4">
          <select id="status" class="form-select" aria-label="Estado" data-order="${id}">
            <option value="generada" ${
              status === "generada" ? "selected" : ""
            }>Generada</option>
            <option value="procesando" ${
              status === "procesando" ? "selected" : ""
            }>Procesando</option>
            <option value="terminada" ${
              status === "terminada" ? "selected" : ""
            }>Terminada</option>
            <option value="cancelada" ${
              status === "cancelada" ? "selected" : ""
            }>Cancelada</option>
          </select>
        </div>
      </div>
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

// Funciones de lógica de carga inicial y respuestas del servidor  ************
//*****************************************************************************

function updateOrderList() {
  applyLoaderMask($maskElement);
  return ordersApi
    .getOrders()
    .then(data => {
      if (Array.isArray(data)) {
        return Promise.resolve(data);
      } else {
        return Promise.reject("Error de datos");
      }
    })
    .then(ordersData => {
      $orderList.innerHTML = renderOrderTable(ordersData);
      assignEventsToOrderTable();
      $(".table-wrapper").slideDown();
    })
    .catch(error => {
      $orderInfoMessages.innerText =
        "Error: No se pudo cargar el listado de pedidos";
      $orderInfoMessages.classList.add("show", "warning");
      setTimeout(() => {
        $orderInfoMessages.classList.remove("show", "warning");
      }, 4000);
    })
    .finally(() => removeLoaderMask($maskElement));
}

function processResponse(okText) {
  return data => {
    if (data.error) {
      $orderInfoMessages.innerText =
        data.error === "no autorizado"
          ? "No posee los permisos necesarios"
          : data.error;
      $orderInfoMessages.classList.add("show", "warning");
      setTimeout(() => {
        $orderInfoMessages.classList.remove("show", "warning");
      }, 4000);
      return;
    }
    if (data.result === "ok" || data.id || Array.isArray(data)) {
      if (okText) {
        $orderInfoMessages.innerText = okText;
        $orderInfoMessages.classList.add("show", "info");
        setTimeout(() => {
          $orderInfoMessages.classList.remove("show", "info");
        }, 2500);
      }
      return data;
    }
  };
}

function applyLoaderMask(elem) {
  elem.addClass("loaderMask");
}

function removeLoaderMask(elem) {
  elem.removeClass("loaderMask");
}

// **********************************************************************//
// ***************************** Eventos ********************************//
// **********************************************************************//

function assignEventsToOrderTable() {
  $("#orderList").click(function (e) {
    // genero los eventos para todas las filas
    const $file = e.target.closest("tr");
    if ($file) {
      const id = $file.dataset.order;
      getOrder(id);
    }
  });
}

function assignEventsToOrderModal(status) {
  const $selectStatus = document.getElementById("status");
  $selectStatus.addEventListener("change", () => {
    if ($selectStatus.value !== status) {
      $btnUpdateModal.classList.remove("hidden");
    } else {
      $btnUpdateModal.classList.add("hidden");
    }
  });
}

$btnUpdateModal.addEventListener("click", () => {
  $divModalMensajes.classList.remove("show");
  $divModalMensajesFondo.classList.remove("show");
  $btnUpdateModal.classList.add("hidden");
  const $selectStatus = document.getElementById("status");
  updateOrderStatus($selectStatus.dataset.order, $selectStatus.value);
});

$btnCloseModal.addEventListener("click", () => {
  $divModalMensajes.classList.remove("show");
  $divModalMensajesFondo.classList.remove("show");
});

// Accion botón logout
document.getElementById("btn-logout").addEventListener("click", e => {
  location.assign("/logout");
});
document.getElementById("btn-logout-mobile").addEventListener("click", e => {
  location.assign("/logout");
});

// Inicio
updateOrderList();
