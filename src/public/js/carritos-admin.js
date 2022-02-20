/* eslint-disable no-undef */
//Variables
//DOM *********************************
const $cartInfoMessages = document.getElementById("cartInfoMessages");
const $selectCart = document.getElementById("selectCart");
const $btnCreateCart = document.getElementById("btnCreateCart");
const $btnDeleteCart = document.getElementById("btnDeleteCart");
const $cartProducts = document.getElementById("cartProducts");

// **************************************************************************//
// *********************** Definiciones de funciones ************************//
// **************************************************************************//

// Funciones para inetractuar con la api de carritos
const cartsApi = {
  getCarts: async () => {
    return fetch(`/api/carrito`).then(data => data.json());
  },
  getCartProducts: async id => {
    return fetch(`/api/carrito/${id}/productos`).then(data => data.json());
  },
  createCart: async () => {
    return fetch(`/api/carrito`, {
      method: "POST"
    }).then(data => data.json());
  },
  deleteCart: async id => {
    return fetch(`/api/carrito/${id}`, {
      method: "DELETE"
    }).then(data => data.json());
  },
  addProductToCart: async (id, id_prod, quantity) => {
    return fetch(`/api/carrito/${id}/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id_prod, quantity })
    }).then(data => data.json());
  },
  updateProductFromCart: async (id, id_prod, quantity) => {
    return fetch(`/api/carrito/${id}/productos`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id_prod, quantity })
    }).then(data => data.json());
  },
  deleteProductFromCart: async (id, id_prod) => {
    return fetch(`/api/carrito/${id}/productos/${id_prod}`, {
      method: "DELETE"
    }).then(data => data.json());
  }
};

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

// Funciones CRUD carritos  ***************************************************
//*****************************************************************************
function createCart() {
  cartsApi
    .createCart()
    .then(processResponse("Carrito creado con éxito"))
    .then(data => {
      if (data) {
        updateCartsList();
      }
    })
    .catch(console.log);
}

function deleteCart() {
  const id = $selectCart.value;
  cartsApi
    .deleteCart(id)
    .then(processResponse("Carrito eliminado con éxito"))
    .then(data => {
      if (data) {
        updateCartsList();
      }
    })
    .catch(console.log);
}

function updateProductFromCart(id, id_prod, quantity) {
  if (id) {
    cartsApi
      .updateProductFromCart(id, id_prod, quantity)
      .then(processResponse("Cantidad actualizada en el carrito"))
      .then(data => {
        if (data) {
          updateCartTable();
        }
      })
      .catch(console.log);
  }
}

function deleteProductFromCart(id, id_prod) {
  if (id) {
    cartsApi
      .deleteProductFromCart(id, id_prod)
      .then(processResponse("Producto eliminado del carrito"))
      .then(data => {
        if (data) {
          updateCartTable();
        }
      })
      .catch(console.log);
  }
}

// Funciones para mostrar y/o actualizar la información de los carritos  ******
//*****************************************************************************

function updateCartsList() {
  cartsApi
    .getCarts()
    .then(data => {
      if (Array.isArray(data)) {
        return Promise.resolve(data);
      } else {
        return Promise.reject("Error de datos");
      }
    })
    .then(cartsId => {
      let htmlCode = `<option value="" selected>Seleccionar carrito</option>`;
      const options = cartsId.map(
        cartId => `<option value="${cartId}">ID ${cartId}</option>`
      );
      htmlCode += options.join("");
      $selectCart.innerHTML = htmlCode;
      hiddenButton();
      updateCartTable();
    })
    .catch(error => {
      $cartInfoMessages.innerText =
        "Error. No se pudo cargar el listado de carritos";
      $cartInfoMessages.classList.add("show", "warning");
      setTimeout(() => {
        $cartInfoMessages.classList.remove("show", "warning");
      }, 4000);
    });
}

function hiddenButton() {
  if (!$selectCart.value) {
    $btnDeleteCart.classList.add("hidden");
  } else {
    $btnDeleteCart.classList.remove("hidden");
  }
}

// Renderiza la tabla de productos utilizando template
function renderCartTable(id, data) {
  const total = data.reduce(
    (tot, { product, quantity }) => (tot += product.price * quantity),
    0
  );
  let html = `
    <div class="listado">
      <h3>PRODUCTOS EN CARRITO ID <i>${id}</i></h3>`;
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
              <div class="input-group-prepend">
                <button type="button" class="btn btn-outline-secondary btn-minus">-</button>
              </div>
              <input type="text" class="text-center form-control product-qty" data-product-stk="${
                product.stock
              }" value="${quantity}" disabled>
              <div class="input-group-append">
                <button type="button" class="btn btn-outline-secondary btn-plus" data-product-stk="${
                  product.stock
                }">+</button>
              </div>
            </div>
            <button type="button" class="typicBtn font-weight-bold btn btn-danger btn-block btn-sm btn-qty-update" data-producto-id="${
              product.id
            }">Actualizar</button>
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
    cartsApi
      .getCartProducts(id)
      .then(processResponse())
      .then(data => {
        if (data) {
          $cartProducts.innerHTML = renderCartTable(id, data);
          assignEventsToCartTable();
          $("#cartProducts").slideDown(300);
        }
      })
      .catch(console.log);
  } else {
    $cartProducts.innerHTML = "";
  }
}

function checkInputChange($input) {
  const prevQty = $input.attr("value");
  const actQty = $input.val();
  if (actQty !== prevQty) {
    $input.parent().next(".btn-qty-update").slideDown("fast");
  } else {
    $input.parent().next(".btn-qty-update").slideUp("fast");
  }
}

function assignEventsToCartTable() {
  $("#cartProducts .table-trash").click(function (e) {
    // genero los eventos para todos los botones eliminar
    const id = $selectCart.value;
    const id_prod = $(this).data("productoId");
    deleteProductFromCart(id, id_prod);
  });
  $("#cartProducts .btn-minus").click(function (e) {
    // genero los eventos para todos los botones -
    const $inputQty = $(this).parent().next();
    const qty = parseInt($inputQty.val());
    if (qty > 1) {
      $inputQty.val(qty - 1);
      checkInputChange($inputQty);
    }
  });
  $("#cartProducts .btn-plus").click(function (e) {
    // genero los eventos para todos los botones +
    const $inputQty = $(this).parent().prev();
    const qty = parseInt($inputQty.val());
    const stock = parseInt($(this).data("productStk"));
    if (qty < stock) {
      $inputQty.val(qty + 1);
      checkInputChange($inputQty);
    }
  });
  $("#cartProducts .product-qty").on("input", function (e) {
    $(this).val($(this).attr("value"));
  });
  $("#cartProducts .btn-qty-update").click(function (e) {
    const id = $selectCart.value;
    const id_prod = $(this).data("productoId");
    const $inputQty = $(this).prev(".input-group").find(".product-qty");
    const qty = parseInt($inputQty.val());
    updateProductFromCart(id, id_prod, qty);
  });
}

// Funciones de lógica de carga inicial y respuestas del servidor  ************
//*****************************************************************************

function processResponse(okText) {
  return data => {
    if (data.error) {
      $cartInfoMessages.innerText =
        data.error === -1 ? "No posee los permisos necesarios" : data.error;
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
// *********************** Eventos panel carritos ***********************//
// **********************************************************************//

$btnCreateCart.addEventListener("click", createCart);

$btnDeleteCart.addEventListener("click", () => {
  deleteCart();
});

$selectCart.addEventListener("change", () => {
  $("#cartProducts").slideUp("slow", updateCartTable);
  hiddenButton();
});

// Inicio
(() => {
  updateCartsList();
})();
