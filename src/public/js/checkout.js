/* eslint-disable no-undef */
// **************************************************************************//
// ************* Declaración de variables y constantes globales *************//
// **************************************************************************//

//Generales ***************************
let acumulado = 0;
let carritoUsuario = {};
let usuario = "";

const interes3Cuotas = 8;
const interes6Cuotas = 12;
const interes12Cuotas = 20;
const interes18Cuotas = 30;

//DOM *********************************
const $contenedorCuotas = $("#contenedorCuotas");
const $contenedorResumenCompra = $("#contenedorResumenCompra");
const $importe = $(".importe p");
$(document).ready(function () {
  $inputRadios = $("[name='numCuotas']");
});

// **************************************************************************//
// *********************** Definiciones de funciones ************************//
// **************************************************************************//

// Funciones de carga de Usuario y Carrito ************************************
//*****************************************************************************

const inicioCompra = () => {
  // Inicializa la página
  if (!cargarCarrito(usuario) || carritoUsuario.length == 0) {
    // recoje el carrito actual
    // si no hay carrito por algún motivo, o no se puede obtener la lista de productos o el dolar del sessionStorage,
    // redirige a la página anterior del proceso. Ej: Esto puede pasar al recargar la página una vez terminada
    // la compra o si la pagina se abre independiente de la sesion.

    console.log("No hay carrito que procesar, se redirige a index.html"); // para control interno
    location.assign("index.html");
    return;
  }

  mostrarResumenCompra(); // carga el contenido HTML relativo a la selección de productos previa
  animarResumenCompra();
};

// Funciones relacionadas a mostrar el resumen de compra **********************
//*****************************************************************************

function mostrarResumenCompra(cart) {
  console.log(cart);
  //genera el HTML para la zona de resumen de compra

  let arrayFilas = []; // trabajo con un array para evitar múltiples regeneraciones del DOM
  let total = 0;

  for (const item of cart) {
    //generación del HTML de las filas de la tabla del resumen de compra
    let productoItem = item.product;
    let fila = `
            <tr>
                <td><img src="${
                  productoItem.thumbnail
                }" class="card-img-top" alt=""></td>
                <td>${productoItem.title}</td>
                <td class="text-center">${item.quantity}x</td>
                <td class="text-right font-weight-bold">$${formatoPrecio(
                  productoItem.price
                )}</td>
            </tr>`;

    arrayFilas.push(fila);
    total += productoItem.price * item.quantity;
  }

  $contenedorResumenCompra.append(arrayFilas); // inserto el HTML de la tabla en el contenedor por medio de un array
  acumulado = total;
  $importe.html(`Total de compra <span>$${formatoPrecio(total)}</span>`); // inserto el HTML del total en el elemento predefinido correspondiente

  // finalmente calculo el importe de cada cuota según su interés y genero dinámicamente el HTML
  // del interior del contenedor de cuotas
  let importeC3 = (acumulado * (1 + interes3Cuotas / 100)) / 3;
  let importeC6 = (acumulado * (1 + interes6Cuotas / 100)) / 6;
  let importeC12 = (acumulado * (1 + interes12Cuotas / 100)) / 12;
  let importeC18 = (acumulado * (1 + interes18Cuotas / 100)) / 18;

  $contenedorCuotas.html(`
            <div class="form-check">
                <input class="form-check-input" type="radio" name="numCuotas" id="inputRadio1"
                    value="1" checked>
                <label class="form-check-label" for="inputRadio1">
                    <span>1 Cuota de $${formatoPrecio(acumulado)}</span>
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="numCuotas" id="inputRadio2"
                    value="3">
                <label class="form-check-label" for="inputRadio2">
                <span>3 Cuotas de $${formatoPrecio(
                  importeC3
                )}</span><i> (Int.: ${interes3Cuotas}%) Total: $${formatoPrecio(
    importeC3 * 3
  )}</i>
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="numCuotas" id="inputRadio3"
                    value="6">
                <label class="form-check-label" for="inputRadio3">
                <span>6 Cuotas de $${formatoPrecio(
                  importeC6
                )}</span><i> (Int.: ${interes6Cuotas}%) Total: $${formatoPrecio(
    importeC6 * 6
  )}</i>
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="numCuotas" id="inputRadio4"
                    value="12">
                <label class="form-check-label" for="inputRadio4">
                <span>12 Cuotas de $${formatoPrecio(
                  importeC12
                )}</span><i> (Int.: ${interes12Cuotas}%) Total: $${formatoPrecio(
    importeC12 * 12
  )}</i>
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="numCuotas" id="inputRadio5"
                    value="18">
                <label class="form-check-label" for="inputRadio5">
                <span>18 Cuotas de $${formatoPrecio(
                  importeC18
                )}</span><i> (Int.: ${interes18Cuotas}%) Total: $${formatoPrecio(
    importeC18 * 18
  )}</i>
                </label>
            </div>`);
}

function animarResumenCompra() {
  // genera animaciones concatenadas de la columna resumen de compra y el sector de cuotas
  $(document).ready(function () {
    // verifica que este listo el documento
    $contenedorResumenCompra.find("tr").each(function (indice) {
      // sobre cada <tr> itera y aplica una animación
      if (indice == $contenedorResumenCompra.find("tr").length - 1) {
        //si es el último elemento aplica una animación
        //con 2 concatenaciones, cosa que no ocurre con los demás pasos de la iteración.
        $(this)
          .delay(indice * 150)
          .animate(
            {
              opacity: "1"
            },
            500,
            function () {
              // al terminar la animación de este último elemento, llama a animar $importe
              $importe.slideDown(200, function () {
                $(this).parent().animate(
                  {
                    opacity: "1"
                  },
                  500
                );
                // al termianr la animación, anima $contenedorCuotas
                $contenedorCuotas.parent().slideDown(1000);
              });
            }
          );
        return false;
      }
      $(this)
        .delay(indice * 150)
        .animate(
          {
            //asigna animaciones con un delay creciente para que inicien secuencialmente
            opacity: "1"
          },
          500
        );
    });
  });
}

// **************************************************************************//
// ******************************* Ejecución ********************************//
// **************************************************************************//

let cartProductsQty = 0;

let primerCarga = true;

let tempEmergente; // temporizador de los mensajes emergentes

let userCartId = null;

// Funciones para inetractuar con la api de carritos
const cartsApi = {
  getCarts: async () => {
    return fetch(`/api/carrito`).then(data => data.json());
  },
  getUserCart: async () => {
    return fetch(`/api/carrito/usuario`).then(data => data.json());
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

// Funciones relacionadas a lógica del carrito  *******************************
// ****************************************************************************

async function cartAssign() {
  return cartsApi
    .getUserCart()
    .then(res => {
      if (res.cartId && res.products.length > 0) {
        const { cartId, products } = res;
        userCartId = cartId;
        const prevCartQty = cartProductsQty;
        cartProductsQty = products.reduce(
          (tot, prod) => tot + prod.quantity,
          0
        );
        updateCartWidget(prevCartQty, cartProductsQty);
        return products;
      } else {
        return location.assign("/productos");
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
  cartAssign()
    .then(products => {
      if (primerCarga) {
        primerCarga = false;
        sessionStorage.setItem("init-session", true);
      }
      mostrarResumenCompra(products);
      animarResumenCompra();
      return Promise.resolve();
    })
    .catch(loadError);
}

//FIXME:FIXME:
function loadError(error) {
  // $contenedorProductos.innerHTML = `
  //   <h3>Ocurrió Un Error De Carga</h3>
  //   <p>Intenta recargar la página o regresa más tarde.</p>
  //   <p>Disculpe las molestias.</p>`;

  console.error(error);
}

// Inicio
cargar();
