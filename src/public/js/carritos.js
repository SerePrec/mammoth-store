//Variables
//Generales ***************************
let busqueda = false;
let filtroPrecioAplicado = false;
let filtroMarcaAplicado = false;
let primerCarga = true;
let marcasAFiltrar = [];
let precioMinimo, precioMaximo, precioMinSel, precioMaxSel;
let productos = [];
let productosFiltradosCliente = [];

//DOM *********************************
const $contenedorProductos = document.querySelector(
  "#contenedorProductos .loader"
);
const $btnBuscar = $("#btnBuscar");
const $filtroBuscar = $("#filtroBuscar");
const $inputBuscar = $("#inputBuscar");
const $inputPrecioMaximo = $("#inputPrecioMax");
const $inputPrecioMinimo = $("#inputPrecioMin");
const $listadoFitros = $("#filtros");
const $cartInfoMessages = document.getElementById("cartInfoMessages");
const $rangoPrecioMaximo = $("#rangoPrecioMax");
const $rangoPrecioMinimo = $("#rangoPrecioMin");
const $selectOrdenar = $("#selectOrdenar");
const $selectCart = document.getElementById("selectCart");
const $btnCreateCart = document.getElementById("btnCreateCart");
const $btnDeleteCart = document.getElementById("btnDeleteCart");
const $cartProducts = document.getElementById("cartProducts");

// **************************************************************************//
// *********************** Definiciones de funciones ************************//
// **************************************************************************//

// Clase para los objetos marcas presentes en la selección madre
// (Filtro de Busqueda por palabra, categoria o destacado) del usuario
class ItemMarca {
  constructor(marca, cant) {
    this.brand = marca;
    this.qty = cant;
  }
}

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

// Funciones para inetractuar con la api de productos
const productsApi = {
  getProducts: async () => {
    return fetch(`/api/productos`).then(data => data.json());
  }
};

// Funciones para ordenar los productos *******************
//*********************************************************

function ordenarProductos(vectorAOrdenar) {
  //procesa la opción seleccionada de orden en el select y llama a la función de orden respectiva
  let tipoOrden = $selectOrdenar.val().toLowerCase();
  let funcion;
  switch (tipoOrden) {
    case "a":
      funcion = ordenarAZ;
      break;

    case "z":
      funcion = ordenarZA;
      break;

    case "-":
      funcion = ordenarMenorPrecio;
      break;

    case "+":
      funcion = ordenarMayorPrecio;
      break;

    default:
      break;
  }
  vectorAOrdenar.sort(funcion);
}

const ordenarAZ = (a, b) => {
  // Función de ordenamiento alfabético (a-Z) por marca y descripción
  if (a.brand.localeCompare(b.brand) == 0) {
    return a.title.localeCompare(b.title);
  }
  return a.brand.localeCompare(b.brand);
};

const ordenarZA = (a, b) => {
  // Función de ordenamiento alfabético (Z-a) por marca y descripción
  if (b.brand.localeCompare(a.brand) == 0) {
    return b.title.localeCompare(a.title);
  }
  return b.brand.localeCompare(a.brand);
};

const ordenarMenorPrecio = (a, b) => {
  // Función de ordenamiento por menor precio y por marca (a-Z)
  if (a.price - b.price == 0) {
    if (a.brand.localeCompare(b.brand) == 0) {
      return a.title.localeCompare(b.title);
    }
    return a.brand.localeCompare(b.brand);
  }
  return a.price - b.price;
};

const ordenarMayorPrecio = (a, b) => {
  // Función de ordenamiento por mayor precio y por marca (a-Z)
  if (b.price - a.price == 0) {
    if (a.brand.localeCompare(b.brand) == 0) {
      return a.title.localeCompare(b.title);
    }
    return a.brand.localeCompare(b.brand);
  }
  return b.price - a.price;
};

// Funciones de filtrado de productos *****************************************
//*****************************************************************************

function buscarProductos(e) {
  //procesa el valor de búsqueda que el usario introdujo en el input
  let fraseBuscar = $inputBuscar.val().trim();

  // busca en los productos que se listan en ese momento, una coincidencia con la palabra o
  // conjunto de caracteres ingresado por el usuario
  if (fraseBuscar) {
    fraseBuscar = fraseBuscar.toLowerCase();
    productosFiltradosCliente = productos.filter(
      prod =>
        prod.title.toLowerCase().indexOf(fraseBuscar) !== -1 ||
        prod.brand.toLowerCase().indexOf(fraseBuscar) !== -1
    );

    $filtroBuscar.removeClass("ocultar"); // Hace visible un botón para luego quitar esté filtrado por búsqueda. Este boton esta oculto al inicio
    busqueda = true;
  } else if (!$filtroBuscar.hasClass("ocultar")) {
    $filtroBuscar.trigger("click");
  }
}

function filtrarCategoria(vectorAFiltrar) {
  // Filtra al vector pasado por la categoría seleccionada por el usuario
  let categoria = $listadoFitros.find(":radio:checked").val().toLowerCase();
  if (categoria == "todas") {
    productosFiltradosCliente = vectorAFiltrar;
  } else {
    productosFiltradosCliente = vectorAFiltrar.filter(
      prod => prod.category.toLowerCase() == categoria
    );
  }
}

function listarMarcas(vectorAProcesar) {
  // Encuentra las marcas y los productos dentro de cada una de ellas que
  //corresponden a la selección madre (Filtro de Busqueda por palabra, categoria o destacado) del usuario
  let listadoMarcas = [];
  let marca;
  for (const producto of vectorAProcesar) {
    marca = producto.brand;
    let coincidencia = listadoMarcas.find(prod => prod.brand == marca);
    if (coincidencia) {
      // si ya existía la marca en el array, le suma una unidad
      coincidencia.qty++;
    } else {
      // sino, agrega la marca al listado
      listadoMarcas.push(new ItemMarca(marca, 1));
    }
  }
  listadoMarcas.sort((a, b) => a.brand.localeCompare(b.brand));
  return listadoMarcas;
}

function mostrarListadoMarcas(vectorMarcas) {
  // Genera el HTML del array de marcas encontradas
  let codigoHTML = "";
  for (const item of vectorMarcas) {
    codigoHTML += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" data-marca="${
                  item.brand
                }" id="marca${vectorMarcas.indexOf(item)}">
                <label class="form-check-label" for="marca${vectorMarcas.indexOf(
                  item
                )}">${item.brand} (${item.qty})</label>
            </div>`;
  }

  $("#contenedorMarcas").html(codigoHTML);
}

function filtrarMarcas(vectorAFiltrar, vectorMarcas) {
  // filtra los productos del array pasado en funcion de un array de marcas
  let productosFiltradosMarca = [];
  if (vectorMarcas.length == 0) {
    productosFiltradosMarca = vectorAFiltrar;
  } else {
    productosFiltradosMarca = vectorAFiltrar.filter(elem => {
      for (const marcaElegida of vectorMarcas) {
        if (elem.brand == marcaElegida) {
          return true;
        }
      }
    });
  }
  return productosFiltradosMarca;
}

function seteoRangoPrecios(vectorAProcesar) {
  // Controla la selección del rango de precios por el usuario y colocar su valor en los input respectivos
  // esta bandera es para que luego cuando se ordena/muestra los productos,
  // se sepa si ordenar procesa el conjunto del vector productosFiltradosCliente
  // o solo un vector auxiliar que devuelve la función filtrarRangoPrecio()
  filtroPrecioAplicado = false;
  if (vectorAProcesar.length == 0) {
    // Si no hay productos, se pone en disabled los controles "range" y se vacía su valor para mostrar placeholder
    $rangoPrecioMinimo.val(50).attr("disabled", true);
    $rangoPrecioMaximo.val(50).attr("disabled", true);
    $inputPrecioMinimo.val("");
    $inputPrecioMaximo.val("");
    return;
  }
  precioMinimo = +Infinity;
  precioMaximo = -Infinity;
  let precio;
  for (const producto of vectorAProcesar) {
    // se obtiene el precio máximo y mínimo del vector a procesar
    precio = producto.price;
    if (precio > precioMaximo) precioMaximo = precioMaxSel = precio;
    if (precio < precioMinimo) precioMinimo = precioMinSel = precio;
  }
  // esos valores extremos se muestran el los inputs
  $inputPrecioMinimo.val(
    `$${quitarDecimales(formatoPrecio(Math.ceil(precioMinimo)))}`
  );
  $inputPrecioMaximo.val(
    `$${quitarDecimales(formatoPrecio(Math.ceil(precioMaximo)))}`
  );
  if (vectorAProcesar.length == 1) {
    // si hay un solo producto, se bloquean los controles "range" ya que no tiene sentido seleccionar un rango de precios
    $rangoPrecioMinimo.val(50).attr("disabled", true);
    $rangoPrecioMaximo.val(50).attr("disabled", true);
    return;
  }
  // de lo contrario se habilitan los controles
  $rangoPrecioMinimo.val(0).attr("disabled", false);
  $rangoPrecioMaximo.val(100).attr("disabled", false);
}

function actFiltroPrecioMax(e) {
  // Se encarga de ir actualizando el valor del input precio máximo según el desplazamiento del control "range"
  // opto por una escala no lineal porque se hace dificil seleccionar con tanto rango de precio
  precioMaxSel =
    precioMinimo +
    ((precioMaximo - precioMinimo) * $(e.target).val() ** 2) / 10000;

  if (precioMinSel >= precioMaxSel) {
    // Si quiere selecionar un rango ilógico, se fija el valor compatible según la selección del otro control
    $(e.target).next().val($inputPrecioMinimo.val());
    precioMaxSel = precioMinSel;
  } else {
    $(e.target)
      .next()
      .val(`$${quitarDecimales(formatoPrecio(Math.ceil(precioMaxSel)))}`);
  }
}

function actFiltroPrecioMin(e) {
  // Se encarga de ir actualizando el valor del input precio mínimo según el desplazamiento del control "range"
  // opto por una escala no lineal porque se hace dificil seleccionar con tanto rango de precio
  precioMinSel =
    precioMinimo +
    ((precioMaximo - precioMinimo) * $(e.target).val() ** 2) / 10000;

  if (precioMinSel >= precioMaxSel) {
    // Si quiere selecionar un rango ilógico, se fija el valor compatible según la selección del otro control
    $(e.target).next().val($inputPrecioMaximo.val());
    precioMinSel = precioMaxSel;
  } else {
    $(e.target)
      .next()
      .val(`$${quitarDecimales(formatoPrecio(Math.ceil(precioMinSel)))}`);
  }
}

function filtrarRangoPrecio(vectorAFiltrar) {
  // filtra el vector pasado según el rango de precio elegido. No sobreescribe el vector, sino que devuelve otro
  filtroPrecioAplicado = true;
  // se crea y se devuelve un vector auxiliar, para no sobreescribir el vector pasado
  // y poder seguir operando posteriormente con el mismo si se van cambiando solo los rangos de precio
  let vectorAuxiliar = vectorAFiltrar.filter(prod =>
    Boolean(prod.price >= precioMinSel && prod.price <= precioMaxSel)
  );
  return vectorAuxiliar;
}

function actCantProductosEncontrados(vectorAContar) {
  // Actualiza el contador de productos encontrados según los criterios
  let encontrados = vectorAContar.length;
  if (encontrados == 1) {
    $("#cantProductosEncontrados").text(`${encontrados} producto`);
  } else {
    $("#cantProductosEncontrados").text(`${encontrados} productos`);
  }
}

// Funciones para mostrar y/o actualizar la información de los productos ******
//*****************************************************************************

function mostrarProductos(vectorProductos) {
  // Carga los productos en la página en formato de tarjetas, a partir del array que toma como parámetro
  const $contenedorProductos = $("#contenedorProductos");

  if (vectorProductos.length == 0) {
    // Si no hay productos que mostrar lo avisa
    $contenedorProductos.html(`
            <div class="errorResultadoBuscar">
                <i class="fa fa-search grayscale fa-3x"></i>
                <h2>¡Oops!</h2>  
                <h3>No existe ningún producto con estos criterios de búsqueda.</h3>
                <h3>Prueba modificando alguno.</h3>
            </div>`);
  } else {
    // si ha productos genera el HTML norrespondiente a las tarjetas de los mismos

    const arrayTarjetas = [];
    for (let producto of vectorProductos) {
      // recorre el array de productos a mostrar generando dinámicamente el HTML
      const $contenedorTarjeta = $(`<div class="col mb-4"></div>`);
      let precioSinDescuento = "";
      let codigoHTML = `
                <div class="card h-100">`;

      if (producto.discount > 0) {
        codigoHTML += `
                    <div class="descuento">-${producto.discount}%</div>`;
        precioSinDescuento = `<del>$${formatoPrecio(
          producto.price * (1 - producto.discount)
        )}<del>`;
      }

      codigoHTML += `
                    <img src="${
                      producto.thumbnail
                    }" class="card-img-top" alt="${producto.title}">
                    <div class="card-body">
                      <h5 class="card-title">
                        ${producto.brand} - <small>${producto.code}</small>
                      </h5>
                      <p class="card-text">${producto.title}</p>
                      <p class="my-2"><b>Precio: $${formatoPrecio(
                        producto.price
                      )}</b> ${precioSinDescuento}</p>
                      <p class="my-2">Disponible: ${producto.stock}u</p>`;

      if (producto.stock > 0) {
        // Si se puede vender genera los botones de agregar y el input de cantidad
        // setea el atributo "data-" con el valor del id del producto.
        // seteo el atributo del input "max" en el actual valor de stock para tener un control extra sobre el rango.
        codigoHTML += `
                        <div class="d-flex">
                            <button type="button" class="btn btn-danger w-50 btnAgregar" data-producto-id="${producto.id}">Agregar</button>
                            <input type="number" class="form-control ml-2 inputCantidad" value="1" min="1" max="${producto.stock}">
                        </div>`;
      } else {
        // Si el producto no tiene stock genera una tarjeta con un boton "disbled" que notifica "Agotado"
        codigoHTML += `<button type="button" class="btn btn-danger" data-producto-id="${producto.id}" disabled>Agotado</button>`;
      }
      codigoHTML += `
                    </div>
                </div>`;

      $contenedorTarjeta.html(codigoHTML);
      arrayTarjetas.push($contenedorTarjeta);
    }

    $contenedorProductos.empty();
    $contenedorProductos.append(arrayTarjetas);
  }

  $("#contenedorProductos .btnAgregar").click(function (e) {
    // genero los eventos para todos los botones agregar
    // para luego pasar los valores del producto correspondiente a la funcion de agregar al carrito,
    // tomo esos valores del atributo "data-" mediante el metodo data()
    const id = $selectCart.value;
    const id_prod = $(this).data("productoId");
    const $inputCantidad = $(this).next();
    const cant = parseInt($inputCantidad.val());
    addProductToCart(id, id_prod, cant);
    $inputCantidad.val(1); // devuelve el valor del input a 1
  });
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

function quitarDecimales(string) {
  // Quita los decimales del string pasado por formatoPrecio
  string = string.slice(0, string.indexOf(","));
  return string;
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

function addProductToCart(id, id_prod, quantity) {
  if (id) {
    cartsApi
      .addProductToCart(id, id_prod, quantity)
      .then(processResponse("Selección agregada al carrito"))
      .then(data => {
        if (data) {
          updateCartTable();
        }
      })
      .catch(console.log);
  }
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
      htmlCode = `<option value="" selected>Seleccionar carrito</option>`;
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
      <h3>PRODUCTOS EN CARRITO ID ${id}</h3>`;
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

function loadError(error) {
  $contenedorProductos.innerHTML = `
    <h3>Ocurrió Un Error De Carga</h3>
    <p>Intenta recargar la página o regresa más tarde.</p>
    <p>Disculpe las molestias.</p>`;

  console.log(error);
}

function cargaInicialOk() {
  $("#contenedorProductos .loader").hide();

  // Si los productos cargan correctamente entonces asigno los
  // eventos del panel de productos. No si no se cumple esto
  // para evitar errores de funcionamiento si el usuario intenta
  // usar la aplicación con error de carga

  // **********************************************************************//
  // ********************* Eventos Panel Productos ************************//
  // **********************************************************************//
  $btnBuscar.click(function (e) {
    // Al clickear en boton buscar al lado del input correspondiente, se llama a la funcion buscarProductos
    buscarProductos();
    filtrarCategoria(productosFiltradosCliente);
    ordenarProductos(productosFiltradosCliente);
    mostrarProductos(productosFiltradosCliente);
    actCantProductosEncontrados(productosFiltradosCliente);
    seteoRangoPrecios(productosFiltradosCliente);
    filtroMarcaAplicado = false;
    $("#verMarcas i").removeClass("fa-toggle-on").addClass("fa-toggle-off");
    if ($("#marcas").css("display") == "block") {
      $("#marcas").slideUp(1250, function () {
        $("#marcas").stop();
        $("#verMarcas").trigger("click");
      });
    }
  });

  $filtroBuscar.click(function (e) {
    // Este evento se dispara, al clickear el botón que aparece luego de hacer una búsqueda por descripción
    $(this).addClass("ocultar"); // vuelve a ocultar el botón
    // Acá se vuelven a mostrar todos los productos y ordenados según la selección del select, reseteando el campo del input de búsqueda
    busqueda = false;
    filtrarCategoria(productos);
    ordenarProductos(productosFiltradosCliente);
    mostrarProductos(productosFiltradosCliente);
    actCantProductosEncontrados(productosFiltradosCliente);
    seteoRangoPrecios(productosFiltradosCliente);
    filtroMarcaAplicado = false;
    $("#verMarcas i").removeClass("fa-toggle-on").addClass("fa-toggle-off");
    $inputBuscar.val("");
  });

  $inputBuscar.on("input", function (e) {
    // Luego introduje este evento asociado a que a medida que cambia el input
    //de búsqueda de productos, se llama a la función. Por lo que al instante se van mostrando las coincidencias. Esto hace
    //redundante al evento anterior sobre el botón buscar, pero lo dejo por si en algún caso el evento input  no funciona
    //Evito se dispare al hacer foco con Tab  o tocar teclas que no me interesan
    buscarProductos();
    filtrarCategoria(productosFiltradosCliente);
    ordenarProductos(productosFiltradosCliente);
    mostrarProductos(productosFiltradosCliente);
    actCantProductosEncontrados(productosFiltradosCliente);
    seteoRangoPrecios(productosFiltradosCliente);
    filtroMarcaAplicado = false;
    $("#verMarcas i").removeClass("fa-toggle-on").addClass("fa-toggle-off");
    if ($("#marcas").css("display") == "block") {
      $("#marcas").stop();
      $("#marcas").slideUp(1250, function () {
        $("#verMarcas").trigger("click");
      });
    }
  });

  $listadoFitros.find(":radio, :checkbox").change(function (e) {
    //Agrego evento change a los radios y el checkbox para disparar el filtrado
    if (busqueda) {
      // Si esta activa un búsqueda, la vuelve a hacer como punto de partida para aplicar los posteriores filtros
      buscarProductos();
      filtrarCategoria(productosFiltradosCliente);
    } else {
      filtrarCategoria(productos);
    }
    ordenarProductos(productosFiltradosCliente);
    mostrarProductos(productosFiltradosCliente);
    actCantProductosEncontrados(productosFiltradosCliente);
    seteoRangoPrecios(productosFiltradosCliente);
    filtroMarcaAplicado = false;
    $("#verMarcas i").removeClass("fa-toggle-on").addClass("fa-toggle-off");
    $listadoFitros.find(":radio:checked").parent().addClass("seleccionado");
    $listadoFitros
      .find(":radio:not(:checked)")
      .parent()
      .removeClass("seleccionado");
  });

  $("#verMarcas").click(function () {
    if (productosFiltradosCliente.length == 0) return;
    if (!filtroMarcaAplicado) {
      mostrarListadoMarcas(listarMarcas(productosFiltradosCliente));
    }
    $("#marcas").slideDown();
  });

  $("#volverMarcas").click(function () {
    $("#marcas").slideUp();
  });

  $("#contenedorMarcas").change(function (e) {
    const marcasElegidas = [];
    filtroMarcaAplicado = true;
    let prodFiltradosMarca;
    $(this)
      .find(":checked")
      .each(function () {
        marcasElegidas.push($(this).data("marca"));
      });

    if (marcasElegidas.length == 0) {
      $("#verMarcas i").removeClass("fa-toggle-on").addClass("fa-toggle-off");
    } else {
      $("#verMarcas i").removeClass("fa-toggle-off").addClass("fa-toggle-on");
    }

    marcasAFiltrar = marcasElegidas;

    if (busqueda) {
      // Si esta activa un búsqueda, la vuelve a hacer como punto de partida para aplicar los posteriores filtros
      buscarProductos();
      filtrarCategoria(productosFiltradosCliente);
    } else {
      filtrarCategoria(productos);
    }

    if (filtroPrecioAplicado) {
      prodFiltradosMarca = filtrarMarcas(
        filtrarRangoPrecio(productosFiltradosCliente),
        marcasElegidas
      );
    } else {
      prodFiltradosMarca = filtrarMarcas(
        productosFiltradosCliente,
        marcasElegidas
      );
    }

    ordenarProductos(prodFiltradosMarca);
    mostrarProductos(prodFiltradosMarca);
    actCantProductosEncontrados(prodFiltradosMarca);
  });

  $listadoFitros.find(":input[type='range']").change(function (e) {
    // Agrego enevto a los dos input "range" para que al cambiar su valor, muestre los productos con el orden seleccionado
    let vectorAFiltrar = [...productosFiltradosCliente];
    if (filtroMarcaAplicado) {
      vectorAFiltrar = filtrarMarcas(vectorAFiltrar, marcasAFiltrar);
    }
    const vectorFiltradoPrecio = filtrarRangoPrecio(vectorAFiltrar);
    ordenarProductos(vectorFiltradoPrecio);
    mostrarProductos(vectorFiltradoPrecio);
    actCantProductosEncontrados(vectorFiltradoPrecio);
  });

  $rangoPrecioMaximo.on("pointerdown", function (e) {
    // Agrego eventos del pointer a los input "range" para generar la actualización en tiempo real del precio máximo
    // Canelo el evento focusout del otro range, porque puede dar en algunos casos mal comportamiento.
    // Ej con valores coincidentes de ambos input al clickear de uno en otro sin arrastrar el mouse,
    // arrastra el valor del input range hermano
    $rangoPrecioMinimo.off("focusout");

    $(this).on("pointermove", actFiltroPrecioMax);
    $(this).one("pointerup", function (e) {
      $(e.target).off("pointermove", actFiltroPrecioMax); // al soltar puntero quita el evento pointermove
      actFiltroPrecioMax(e); // Se agrega este llamado por las dudas que se haga un click solamente (sin movimiento de mouse)
      if (precioMinSel >= precioMaxSel) {
        // si el precio esta fuera del rango lógico devuelve la posición del selector donde corresponde en relación al precio mínimo
        $(e.target).val($rangoPrecioMinimo.val());
      }
    });
  });

  $rangoPrecioMaximo.on("focusin", function (e) {
    // Variante anterior para selección con Tab y flechitas
    $(this).on("keydown", actFiltroPrecioMax);
    $(this).one("focusout", function (e) {
      $(e.target).off("keydown", actFiltroPrecioMax); // al salir de foco quita el evento keydown
      if (precioMinSel >= precioMaxSel) {
        // si el precio esta fuera del rango lógico devuelve la posición del selector donde corresponde en relación al precio mínimo
        $(e.target).val($rangoPrecioMinimo.val());
      }
    });
  });

  $rangoPrecioMinimo.on("pointerdown", function (e) {
    // Agrego eventos del pointer a los input "range" para generar la actualización en tiempo real del precio mínimo
    // Canelo el evento focusout del otro range, porque puede dar en algunos casos mal comportamiento.
    // Ej con valores coincidentes de ambos input al clickear de uno en otro sin arrastrar el mouse,
    // arrastra el valor del input range hermano
    $rangoPrecioMaximo.off("focusout");

    $(this).on("pointermove", actFiltroPrecioMin);
    $(this).one("pointerup", function (e) {
      $(e.target).off("pointermove", actFiltroPrecioMin); // al soltar puntero quita el evento pointermove
      actFiltroPrecioMin(e); // Se agrega este llamado por las dudas que se haga un click solamente (sin movimiento de mouse)
      if (precioMinSel >= precioMaxSel) {
        // si el precio esta fuera del rango lógico devuelve la posición del selector donde corresponde en relación al precio máximo
        $(e.target).val($rangoPrecioMaximo.val());
      }
    });
  });

  $rangoPrecioMinimo.on("focusin", function (e) {
    // Variante anterior para selección con Tab y flechitas
    $(this).on("keydown", actFiltroPrecioMin);
    $(this).one("focusout", function (e) {
      $(e.target).off("keydown", actFiltroPrecioMin); // al salir de foco quita el evento keydown
      if (precioMinSel >= precioMaxSel) {
        // si el precio esta fuera del rango lógico devuelve la posición del selector donde corresponde en relación al precio máximo
        $(e.target).val($rangoPrecioMaximo.val());
      }
    });
  });

  $listadoFitros.children("h3").click(function () {
    if (window.innerWidth < 576) {
      $("#contenedorFiltros").slideToggle("slow");
    }
  });

  $selectOrdenar.change(function (e) {
    // Al cambiar la opción del select para ordenar, se llama a la función respectiva
    let vectorAOrdenar = [...productosFiltradosCliente];

    if (filtroMarcaAplicado) {
      vectorAOrdenar = filtrarMarcas(vectorAOrdenar, marcasAFiltrar);
    }

    if (filtroPrecioAplicado) {
      // Si hay un filtro de rengo de precio aplicado, ordena el vector que devuelve este filtrado
      vectorAOrdenar = filtrarRangoPrecio(vectorAOrdenar);
    }

    ordenarProductos(vectorAOrdenar);
    mostrarProductos(vectorAOrdenar);
    actCantProductosEncontrados(vectorAOrdenar);
  });

  $("#inputBrand").on("input", function (e) {
    $("#inputBrand").val($("#inputBrand").val().toUpperCase());
  });
}

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

function isResponseOk(data) {
  if (Array.isArray(data)) {
    productos = data;
    productosFiltradosCliente = [...productos];
    if (primerCarga) {
      cargaInicialOk();
      primerCarga = false;
    }
    return Promise.resolve();
  } else {
    return Promise.reject("Error de datos");
  }
}

function updateTable() {
  productsApi
    .getProducts()
    .then(isResponseOk)
    .then(triggerRenderTable)
    .catch(loadError);
}

function triggerRenderTable() {
  $filtroBuscar.trigger("click");
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
  updateTable();
  updateCartsList();
})();
