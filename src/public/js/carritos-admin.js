/* eslint-disable no-undef */
//Variables
//DOM *********************************
const $cartInfoMessages = document.getElementById("cartInfoMessages");
const $selectCart = document.getElementById("selectCart");
const $btnDeleteCart = document.getElementById("btnDeleteCart");
const $cartProducts = document.getElementById("cartProducts");
const $maskElement = $("main");

// **************************************************************************//
// *********************** Definiciones de funciones ************************//
// **************************************************************************//

// Funciones para inetractuar con la api de carritos
const cartsApi = {
  getCarts: async () => {
    return fetch(`/api/carritos`).then(data => data.json());
  },
  getCartProducts: async id => {
    return fetch(`/api/carritos/${id}/productos`).then(data => data.json());
  },
  deleteCart: async id => {
    return fetch(`/api/carritos/${id}`, {
      method: "DELETE"
    }).then(data => data.json());
  },
  deleteProductFromCart: async (id, id_prod) => {
    return fetch(`/api/carritos/${id}/productos/${id_prod}`, {
      method: "DELETE"
    }).then(data => data.json());
  }
};

// Funciones CRUD carritos  ***************************************************
//*****************************************************************************
function deleteCart() {
  const id = $selectCart.value;
  applyLoaderMask($maskElement);
  cartsApi
    .deleteCart(id)
    .then(processResponse("Carrito eliminado con éxito"))
    .then(data => {
      if (data) {
        updateCartsList();
      }
    })
    .catch(error => {
      console.error(error);
      removeLoaderMask($maskElement);
    });
}

function deleteProductFromCart(id, id_prod) {
  if (id) {
    applyLoaderMask($maskElement);
    cartsApi
      .deleteProductFromCart(id, id_prod)
      .then(processResponse("Producto eliminado del carrito"))
      .then(data => {
        if (data) {
          updateCartTable();
        }
      })
      .catch(error => {
        console.error(error);
        removeLoaderMask($maskElement);
      });
  }
}

// Funciones para mostrar y/o actualizar la información de los carritos  ******
//*****************************************************************************

function updateCartsList() {
  applyLoaderMask($maskElement);
  cartsApi
    .getCarts()
    .then(data => {
      if (Array.isArray(data)) {
        return Promise.resolve(data);
      } else {
        return Promise.reject("Error de datos");
      }
    })
    .then(cartsData => {
      let htmlCode = `<option value="" selected>Seleccionar carrito</option>`;
      const options = cartsData.map(
        cartData =>
          `<option value="${cartData.cartId}" data-cart-timestamp="${
            cartData.timestamp
          }" data-cart-user="${cartData.cartUser}">[${new Date(
            cartData.timestamp
          ).toLocaleDateString()}] ID ${cartData.cartId}</option>`
      );
      htmlCode += options.join("");
      $selectCart.innerHTML = htmlCode;
      hiddenButton();
      updateCartTable();
    })
    .catch(error => {
      $cartInfoMessages.innerText =
        "Error: No se pudo cargar el listado de carritos";
      $cartInfoMessages.classList.add("show", "warning");
      setTimeout(() => {
        $cartInfoMessages.classList.remove("show", "warning");
      }, 4000);
    })
    .finally(() => removeLoaderMask($maskElement));
}

function hiddenButton() {
  if (!$selectCart.value) {
    $btnDeleteCart.classList.add("hidden");
  } else {
    $btnDeleteCart.classList.remove("hidden");
  }
}

// Renderiza la tabla de productos utilizando template
function renderCartTable(id, timestamp, user, data) {
  const total = data.reduce(
    (tot, { product, quantity }) => (tot += product.price * quantity),
    0
  );
  let html = `
    <div class="listado">
      <h3>PRODUCTOS EN CARRITO ID <i>${id}</i></h3>
      <h4>${new Date(timestamp).toLocaleString()}</h4>
      <h4>${user}</h4>`;
  if (data.length > 0) {
    html += `
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col"></th>
            <th scope="col">Descripción</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Subtotal</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>`;
    data.forEach(
      ({ product, quantity }) =>
        (html += `
        <tr>
          <td>${product.id}</td>
          <td><img class="table__image" src="${
            product.thumbnail
          }" alt="producto" /></td>
          <td>
            <p>${product.title}</p>
            <p><b>$${formatoPrecio(product.price)}</b><del></del></p>
            <p><b>SUBTOTAL: $${formatoPrecio(product.price * quantity)}</b></p>
          </td>
          <td>
            <div class="my-3 input-group input-group-sm">
              <input type="text" class="text-center form-control product-qty" value="${quantity}" disabled>
            </div>
          </td>
          <td>$${formatoPrecio(product.price * quantity)}</td>
          <td>
            <img class="table-trash" src="/img/trash.svg" alt="borrar" data-producto-id="${
              product.id
            }"/>
          </td>
        </tr>`)
    );
    html += `
        </tbody>
      </table>
      <h3>TOTAL $${formatoPrecio(total)}</h3>`;
  } else {
    html += `
      <div class="container p-5 mb-4 bg-yellow rounded-3">
        <div class="py-5">
          <h3 class="display-6 fw-bold">¡Oops!, carrito vacío</h1>
          <p>No se encontraron productos cargados.</p>
        </div>
      </div>`;
  }
  return html;
}

function updateCartTable() {
  const id = $selectCart.value;
  if (id) {
    applyLoaderMask($maskElement);
    cartsApi
      .getCartProducts(id)
      .then(processResponse())
      .then(data => {
        if (data) {
          const $option = $selectCart.options[selectCart.selectedIndex];
          const timestamp = $option.dataset.cartTimestamp;
          const user = $option.dataset.cartUser;
          $cartProducts.innerHTML = renderCartTable(id, timestamp, user, data);
          assignEventsToCartTable();
          $("#cartProducts").slideDown(300);
        }
      })
      .catch(console.error)
      .finally(() => removeLoaderMask($maskElement));
  } else {
    $cartProducts.innerHTML = "";
  }
}

function applyLoaderMask(elem) {
  elem.addClass("loaderMask");
}

function removeLoaderMask(elem) {
  elem.removeClass("loaderMask");
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

function processResponse(okText) {
  return data => {
    if (data.error) {
      $cartInfoMessages.innerText =
        data.error === "no autorizado"
          ? "No posee los permisos necesarios"
          : data.error;
      $cartInfoMessages.classList.add("show", "warning");
      setTimeout(() => {
        $cartInfoMessages.classList.remove("show", "warning");
      }, 4000);
      return;
    }
    if (data.result === "ok" || data.id || Array.isArray(data)) {
      if (okText) {
        $cartInfoMessages.innerText = okText;
        $cartInfoMessages.classList.add("show", "info");
        setTimeout(() => {
          $cartInfoMessages.classList.remove("show", "info");
        }, 2500);
      }
      return data;
    }
  };
}

// **********************************************************************//
// ***************************** Eventos ********************************//
// **********************************************************************//

function assignEventsToCartTable() {
  $("#cartProducts .table-trash").click(function (e) {
    // genero los eventos para todos los botones eliminar
    const id = $selectCart.value;
    const id_prod = $(this).data("productoId");
    deleteProductFromCart(id, id_prod);
  });
}

$btnDeleteCart.addEventListener("click", () => {
  deleteCart();
});

$selectCart.addEventListener("change", () => {
  $("#cartProducts").slideUp("slow", updateCartTable);
  hiddenButton();
});

// Accion botón logout
document.getElementById("btn-logout").addEventListener("click", e => {
  location.assign("/logout");
});
document.getElementById("btn-logout-mobile").addEventListener("click", e => {
  location.assign("/logout");
});

// Inicio
updateCartsList();
