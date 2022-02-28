/* eslint-disable no-undef */
//Variables
//Generales ***************************
let cartProductsQty = 0;
let tempEmergente; // temporizador de los mensajes emergentes
let productId = null;
let producto = null;
let userCartId = null;

//DOM *********************************
const $detailContainer = document.querySelector(".productDetailContainer");
const $detailLoader = document.querySelector(".productDetailContainer .loader");
const $detailInfo = document.getElementById("detailInfo");
const $btnCerrarMensajeEmergente = $(".mensajesEmergentes button");
const $divMensajesEmergentes = $(".mensajesEmergentes");
const $pMensajeEmergente = $(".mensajesEmergentes p");

// **************************************************************************//
// *********************** Definiciones de funciones ************************//
// **************************************************************************//

// Funciones para inetractuar con la api de carritos
const cartsApi = {
  getUserCart: async () => {
    return fetch(`/api/carrito/usuario`).then(data => data.json());
  },
  addProductToCart: async (id, id_prod, quantity) => {
    console.log(id, id_prod);
    return fetch(`/api/carrito/${id}/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id_prod, quantity })
    }).then(data => data.json());
  }
};

// Funciones para inetractuar con la api de productos
const productsApi = {
  getProductById: async id => {
    return fetch(`/api/productos/${id}`).then(data => data.json());
  }
};

// Funciones para mostrar y/o actualizar la información de los productos ******
//*****************************************************************************

function mostrarDetalle(product) {
  let codigoHTML = `
    <div class="productDetail ${
      product.stock > 0 ? "" : "productDetail--noStock"
    }">
      <div class="productDetail_title mb-5 row">
        <div class="col-sm-9 col-12">
          <h1>${product.title}</h1>
        </div>
        <div class="col-sm-3 col-12">
          <h3>${product.brand}</h3>
        </div>
      </div>
      <div class="productDetail_data row">
        <div class="col-md-7 col-12">
          <img class="imgWidthLoader ppalImg"
            src="${product.thumbnail}">
          <div class="paymentBanner">
            <div class="paymentBanner__item">
              <div class="image"><img src="/img/icon_money.png" alt="dinero"></div><span>Financia tus compras en 3, 6, 12 y 18 cuotas</span>
            </div>
          </div>
        </div>
        <div class="col-md-5 col-12">
          <h4>${product.category.toUpperCase()}</h4>
          <p class="price"><b>$${formatoPrecio(product.price)}</b></p>
          <h3>DETALLE</h3>
          <p>${product.detail}</p>
          <p class="productDetail_stock">Stock: ${product.stock}</p>`;

  if (producto.stock > 0) {
    codigoHTML += `
          <div class="itemCount">
            <div class="mb-3 input-group w-50 mx-auto">
              <input aria-label="Cantidad del producto" type="number" class="text-center form-control" value="1" min="1" max="${product.stock}">
            </div>
            <button type="button" class="typicBtn btn btn-danger btnAgregar w-50">Agregar</button>
          </div>`;
  } else {
    codigoHTML += `
          <div class="itemCount">
            <button type="button" class="btn btn-dark fw-bold w-50" data-producto-id="${producto.id}" disabled>Agotado</button>
          </div>`;
  }
  codigoHTML += `
          <div class="shipmentInfo">
            <div><img src="/img/casa.svg" alt="sucursal"><span>Retiro GRATIS por Sucursal</span></div>
            <div><img src="/img/camion.svg" alt="camión"><span>Envíos a todo el país</span></div>
            <div>
              <p>Envíos <b>GRATIS</b> a todo el país</p>
              <p>en compras mayores a $8000</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  $detailContainer.innerHTML = codigoHTML;

  $(".productDetail .btnAgregar").click(function (e) {
    const id = userCartId;
    const id_prod = productId;
    const $inputCantidad = document.querySelector(".itemCount input");
    const cant = parseInt($inputCantidad.value);
    const descrp = product.title;
    addProductToCart(id, id_prod, cant, descrp);
    $inputCantidad.value = 1;
  });
}

function mostrarEmergente(leyenda, tiempo = 4000, destacar = false) {
  // Funcion para mostrar mensajes emergentes (no modales). Se introduce por
  // parámetro la leyenda, el tiempo de cierre y si es destacado o no.
  $pMensajeEmergente.html(leyenda);
  $divMensajesEmergentes.addClass("show"); // muestra el HTML previamente estructurado, agregando el contenido de la leyenda
  if (destacar) {
    // si es del tipo destacado, asigna una clase que contiene estilos específicos
    $divMensajesEmergentes.addClass("destacado");
  } else {
    // si no la quita por si antes había un mensaje destacado
    $divMensajesEmergentes.removeClass("destacado");
  }
  clearTimeout(tempEmergente); // cancela un timeout previo si lo había
  tempEmergente = setTimeout(() => {
    // genera un timeout para ocultar el mensaje luego del tiempo elegido
    $divMensajesEmergentes.removeClass("show");
    $divMensajesEmergentes.removeClass("destacado");
  }, tiempo);
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

// Funciones CRUD carritos  ***************************************************
//*****************************************************************************

function addProductToCart(id, id_prod, quantity, description) {
  if (id) {
    cartsApi
      .addProductToCart(id, id_prod, quantity)
      .then(res => {
        if (res.result === "ok") {
          const prevQty = cartProductsQty;
          cartProductsQty += quantity;
          updateCartWidget(prevQty, cartProductsQty);
          mostrarEmergente(
            `Agregado: ${description}<br>Cantidad: ${
              quantity > 1 ? quantity + " unidades." : quantity + " unidad."
            }`
          );
        } else if (res.error) {
          mostrarEmergente(res.error, 5000, true);
        } else {
          return Promise.reject(res);
        }
      })
      .catch(console.error);
  }
}

// Funciones relacionadas a lógica del carrito  *******************************
// ****************************************************************************

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
        cartProductsQty > 0 &&
          !sessionStorage.getItem("init-session") &&
          mostrarEmergente(
            "¡Encontramos un carrito que te pertenece y lo cargamos!"
          );
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

$btnCerrarMensajeEmergente.click(e => {
  // Evento al clickear en la x de los mensajes emergentes para ocultarlo
  $divMensajesEmergentes.removeClass("show");
  $divMensajesEmergentes.removeClass("destacado");
  clearTimeout(tempEmergente); // quita el timer que se inicializó con el mensaje
});

// Accion botón logout
document.getElementById("btn-logout").addEventListener("click", e => {
  location.assign("/logout");
});

// Funciones de lógica de carga inicial y respuestas del servidor  ************
//*****************************************************************************

function loadError(error) {
  if (
    error == "Producto no encontrado" ||
    error == "El id no es de un formato válido"
  ) {
    $detailLoader.innerHTML = `
    <h3>Producto con id '${productId}' inexistente</h3>
    <p>Puede que se haya discontinuado o el código es erróneo.</p>
    <p>Disculpe las molestias.</p>`;
  } else {
    $detailLoader.innerHTML = `
    <h3>Ocurrió Un Error De Carga</h3>
    <p>Intenta recargar la página o regresa más tarde.</p>
    <p>Disculpe las molestias.</p>`;
  }
  console.error(error);
}

function isResponseOk(data) {
  if (data.id) {
    producto = data;
    return cartAssign();
  } else if (data.error) {
    return Promise.reject(data.error);
  } else {
    return Promise.reject("Error de datos");
  }
}

function cargar() {
  productId = $detailInfo.dataset.productId;
  if (productId) {
    productsApi
      .getProductById(productId)
      .then(isResponseOk)
      .then(() => {
        mostrarDetalle(producto);
        sessionStorage.setItem("init-session", true);
        return Promise.resolve();
      })
      .catch(loadError);
  } else {
    loadError("Error de datos");
  }
}

// Inicio
cargar();
