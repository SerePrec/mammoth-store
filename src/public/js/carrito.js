/* eslint-disable no-undef */
//Variables
let cartProductsQty = 0;

let primerCarga = true;
let tempEmergente; // temporizador de los mensajes emergentes
let userCartId = null;

//DOM *********************************
const $cartInfoMessages = document.getElementById("cartInfoMessages");
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
  getUserCart: async () => {
    return fetch(`/api/carritos/usuario`).then(data => data.json());
  },
  getCartProducts: async id => {
    return fetch(`/api/carritos/${id}/productos`).then(data => data.json());
  },
  createCart: async () => {
    return fetch(`/api/carritos`, {
      method: "POST"
    }).then(data => data.json());
  },
  deleteCart: async id => {
    return fetch(`/api/carritos/${id}`, {
      method: "DELETE"
    }).then(data => data.json());
  },
  addProductToCart: async (id, id_prod, quantity) => {
    return fetch(`/api/carritos/${id}/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id_prod, quantity })
    }).then(data => data.json());
  },
  updateProductFromCart: async (id, id_prod, quantity) => {
    return fetch(`/api/carritos/${id}/productos`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id_prod, quantity })
    }).then(data => data.json());
  },
  deleteProductFromCart: async (id, id_prod) => {
    return fetch(`/api/carritos/${id}/productos/${id_prod}`, {
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
function deleteCart() {
  const id = userCartId;
  applyLoaderMask($maskElement);
  cartsApi
    .deleteCart(id)
    .then(processResponse("Carrito eliminado con éxito"))
    .then(data => {
      if (data) {
        cargar();
      }
    })
    .catch(console.error);
}

function updateProductFromCart(id, id_prod, quantity) {
  if (id) {
    applyLoaderMask($maskElement);
    cartsApi
      .updateProductFromCart(id, id_prod, quantity)
      .then(processResponse("Cantidad actualizada en el carrito"))
      .then(data => {
        if (data) {
          updateCartTable();
        }
      })
      .catch(console.error);
  }
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
      .catch(console.error);
  }
}

// Funciones para mostrar y/o actualizar la información de los carritos  ******
//*****************************************************************************

// Renderiza la tabla de productos utilizando template
function renderCartTable(id, data) {
  let qty = 0;
  let total = 0;
  data.forEach(({ product, quantity }) => {
    total += product.price * quantity;
    qty += quantity;
  });
  let html = `
    <div class="listado">
      <h3>PRODUCTOS SELECCIONADOS <i>${qty}</i></h3>`;
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
          <td>
            <a href="/producto/${product.id}">
              <img class="table__image" src="${
                product.thumbnail
              }" alt="producto" />
            </a>
          </td>
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
      <h3>TOTAL $${formatoPrecio(total)}</h3>
      <div class="col-sm-12 d-flex justify-content-evenly actions">
        <a href="/" class="my-5 font-weight-bold btn btn-dark d-block">VOLVER A SHOWROOM</a>
        <a id="confirmCart" class="my-5 font-weight-bold btn btn-danger d-block" href="/checkout">
          CONFIRMAR MI PEDIDO
          <img src="/img/check.svg" alt="">
        </a>
      </div>`;
  } else {
    html += `
      <div class="container emptyCart animate__fadeIn">
        <img src="/img/icon_cart2_red.png" alt="Carrito vacío">
        <h2>¡TU CARRITO ESTÁ VACÍO!</h2>
        <p>Aún no has añadido productos para tu compra</p>
        <h4>Continuá eligiendo productos desde aquí:</h4>
        <div><a href="/">SHOWROOM</a></div>
      </div>`;
  }
  updateCartWidget(cartProductsQty, qty);
  cartProductsQty = qty;
  hiddenButton();
  return html;
}

function hiddenButton() {
  if (cartProductsQty > 0) {
    $btnDeleteCart.classList.remove("hidden");
  } else {
    $btnDeleteCart.classList.add("hidden");
  }
}

function updateCartTable() {
  const id = userCartId;
  if (id) {
    applyLoaderMask($maskElement);
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
      .catch(console.error)
      .finally(() => removeLoaderMask($maskElement));
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

// **********************************************************************//
// ***************************** Eventos  *******************************//
// **********************************************************************//

function assignEventsToCartTable() {
  $("#cartProducts .table-trash").click(function (e) {
    // genero los eventos para todos los botones eliminar
    const id = userCartId;
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
    const id = userCartId;
    const id_prod = $(this).data("productoId");
    const $inputQty = $(this).prev(".input-group").find(".product-qty");
    const qty = parseInt($inputQty.val());
    updateProductFromCart(id, id_prod, qty);
  });
}

$btnDeleteCart.addEventListener("click", () => {
  deleteCart();
});

// Accion botón logout
document.getElementById("btn-logout").addEventListener("click", e => {
  location.assign("/logout");
});

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
      removeLoaderMask($maskElement);
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

async function cartAssign() {
  return cartsApi
    .getUserCart()
    .then(res => {
      if (res.cartId) {
        const { cartId, products } = res;
        userCartId = cartId;
        const prevCartQty = cartProductsQty;
        cartProductsQty = products.reduce(
          (tot, prod) => tot + prod.quantity,
          0
        );
        updateCartWidget(prevCartQty, cartProductsQty);
      } else if (res.error == "Carrito no encontrado") {
        return cartsApi.createCart();
      } else {
        return Promise.reject(res);
      }
    })
    .then(res => {
      if (res?.result === "ok") {
        const { cartId } = res;
        userCartId = cartId;
      }
    })
    .catch(error => {
      console.error(error);
      return Promise.reject(error);
    });
}

function updateCartWidget(prevQty, finalQty) {
  const $cartWidget = document.querySelector(".itemsQuantity");
  if (finalQty < prevQty) {
    $cartWidget.classList.add("animate__fadeOutUp");
    $cartWidget.classList.remove("animate__fadeInDown");
    finalQty !== 0
      ? $cartWidget.classList.remove("hidden")
      : $cartWidget.classList.add("hidden");
    setTimeout(() => {
      $cartWidget.classList.remove("animate__fadeOutUp");
      $cartWidget.innerText = finalQty;
    }, 500);
  } else if (finalQty > prevQty) {
    $cartWidget.classList.add("animate__fadeInDown");
    $cartWidget.classList.remove("animate__fadeOutUp");
    $cartWidget.innerText = finalQty;
    finalQty !== 0
      ? $cartWidget.classList.remove("hidden")
      : $cartWidget.classList.add("hidden");
    setTimeout(() => {
      $cartWidget.classList.remove("animate__fadeInDown");
    }, 500);
  }
}

function cargar() {
  applyLoaderMask($maskElement);
  cartAssign()
    .then(() => {
      if (primerCarga) {
        primerCarga = false;
        sessionStorage.setItem("init-session", true);
      }
      $("#cartProducts").slideUp("slow", updateCartTable);
      return Promise.resolve();
    })
    .catch(loadError);
}

function loadError(error) {
  removeLoaderMask($maskElement);
  $cartProducts.innerHTML = `
    <br>
    <h3>Ocurrió Un Error De Carga</h3>
    <p>Intenta recargar la página o regresa más tarde.</p>
    <p>Disculpe las molestias.</p>
    <div class="col-sm-12 d-flex justify-content-evenly actions">
      <a href="/" class="my-5 font-weight-bold btn btn-dark d-block">VOLVER A SHOWROOM</a>
    </div>`;
  $("#cartProducts").slideDown("slow");

  console.error(error);
}

function applyLoaderMask(elem) {
  elem.addClass("loaderMask");
}

function removeLoaderMask(elem) {
  elem.removeClass("loaderMask");
}

// Inicio
cargar();
