// **************************************************************************//
// ************************ Uso de archivos externos ************************//
// **************************************************************************//

// Funciones para formateo de los precios**************************************
// Ver archivo base.js **************

// Obtención y Generación del array "productos" a partir de un JSON ***********
// Obtención de la cotización del dólar ***************************************
// Ver data.js ************************

// **************************************************************************//
// ************* Declaración de variables y constantes globales *************//
// **************************************************************************//

//Generales ***************************
let acumulado = 0;
let auxCarritoGuardado;
let auxCarritosGuardados;
let busqueda = false;
let carritoAbierto = false;
let carritoUsuario = {};
let checkDestacado = false;
let filtroPrecioAplicado = false;
let filtroMarcaAplicado = false;
let marcasAFiltrar = [];
let load = false;
let precioMinimo, precioMaximo, precioMinSel, precioMaxSel;
let productosFiltradosCliente;
let tempEmergente; // Variable que almacena el temporizador de los mensajes emergentes para poder quitarlos antes de que se ejecuten
let usuario = "";
let outerWidthPrevio = window.outerWidth;
const links = [
  {
    path: "/",
    categoria: "Todas"
  },
  {
    path: "bi",
    categoria: "Bicicletas"
  },
  {
    path: "co",
    categoria: "Componentes"
  },
  {
    path: "ac",
    categoria: "Accesorios"
  },
  {
    path: "eq",
    categoria: "Equipamiento"
  },
  {
    path: "in",
    categoria: "Indumentaria"
  }
];

//DOM *********************************
const $btnBuscar = $("#btnBuscar");
const $btnCarritoCerrar = $("#btnCarritoCerrar");
const $btnCerrarMensajeEmergente = $(".usuario .mensajesEmergentes button");
const $btnCerrarModalMensaje = $("#modalMensajes .modal-header button");
const $btnConfirmarCompra = $("#btnConfirmarCompra");
const $btnLogInOut = $("#btnLogInOut");
const $btnVaciarCarrito = $("#btnVaciarCarrito");
const $carritoIcon = $(".carritoIcon");
const $contenedorItemsCarrito = $("#contenedorItemsCarrito");
const $divLogUsuario = $(".logUsuario");
const $divMensajesEmergentes = $(".usuario .mensajesEmergentes");
const $divModalMensajes = $("#modalMensajes");
const $divModalMensajesFondo = $("#modalMensajesFondo");
const $filtroBuscar = $("#filtroBuscar");
const $inputBuscar = $("#inputBuscar");
const $inputPrecioMaximo = $("#inputPrecioMax");
const $inputPrecioMinimo = $("#inputPrecioMin");
const $inputUsuario = $("#inputUsuario");
const $listadoFitros = $("#filtros");
const $numItems = $("#numItems");
const $pMensajeEmergente = $(".usuario .mensajesEmergentes p");
const $rangoPrecioMaximo = $("#rangoPrecioMax");
const $rangoPrecioMinimo = $("#rangoPrecioMin");
const $selectOrdenar = $("#selectOrdenar");
const $totalCarrito = $("#totalCarrito");

// **************************************************************************//
// *********************** Definiciones de funciones ************************//
// **************************************************************************//

// Funciones de carga de Usuario y Carrito ************************************
//*****************************************************************************

const iniciar = () => {
  // Ejecuta el inicio del simulador
  productosFiltradosCliente = [...productos];

  // Carga inicial de productos en la página
  direccionarCategoria(); // cada vez que se da inicio al simulador direcciona a la categoría según el # de la url
  ordenarProductos(productosFiltradosCliente);
  seteoRangoPrecios(productosFiltradosCliente);

  validarUsuario();
  load = true;

  // esto lo hago para que no se pierda el carrito si el usuario anónimo vuelve hacia atrás en el porceso.
  // comp definí que los carritos no se cargan automáticamente si no hay usuario cargado, al volver y
  // recargarse la página no lo cargaría y se perdería la selección. De esta manera al almacenar en el sessionStorage
  // esta clave, doy por entendido que ya estuvo en esta página y está regresando al sector de showroom.
  sessionStorage.setItem("estuvoEnCompra", true);

  console.log(carritoUsuario); // Información de control interno
};

function validarUsuario() {
  //Verifica si ya se encuentra cargado un usuario en localStorage
  let user = localStorage.getItem("usuario");
  if (user) {
    //Si encuentra un usuario lo carga y setea el valor del input usuario y lo pone "disabled"
    $inputUsuario.val(user);
    $inputUsuario.attr("disabled", true);
    usuario = user;
  }
  asignarCarrito(usuario);
}

function asignarCarrito(user) {
  // Si esta logueado, carga el carrito de compra según el caso (uno activo o uno guardado voluntariamente)
  let miSelecc = [];
  let estuvoEnCompra = sessionStorage.getItem("estuvoEnCompra"); // es para ver si proviene de la pagina de compra y permitir cargar un carrito anónimo, cosa que por defecto no lo permito
  if (user || estuvoEnCompra) {
    // si no hay usuario, genera carrito vacio. Sino siguen otras verificaciones

    if (!load) {
      // si es durante la fase de carga inicial y hay un carrito activo no vacio, lo carga automaticamente
      let carritoGuardado = localStorage.getItem("carritoUsuario");
      carritoGuardado = JSON.parse(carritoGuardado);

      if (
        carritoGuardado &&
        carritoGuardado.usuario == user &&
        carritoGuardado.miSeleccion.length != 0
      ) {
        validarCarritoGuardado(user, carritoGuardado);
        actualizarIconoCarrito();
        ordenarProductos(productosFiltradosCliente);
        actualizarCarritoEnStorage();
        return;
      }
    } else if (user) {
      // si el ususario se logue posterior a la carga de la página verifica si este usuario posee un carrito guardado. Solo si hay usuario!!
      let carritosGuardados = localStorage.getItem("carritosGuardados");
      carritosGuardados = JSON.parse(carritosGuardados);
      let carritoGuardado;
      // si hay un carrito guardado con el nombre del usuario, pregunta si lo desea cargar
      if (
        carritosGuardados &&
        (carritoGuardado = carritosGuardados.find(
          carr => carr.usuario == user
        )) &&
        carritoGuardado.miSeleccion.length != 0
      ) {
        mostrarModalConfirm(
          user + ", tienes un carrito guardado.<br>¿Deseas cargarlo?",
          "siCargarCarrito",
          "noCargarCarrito"
        );
        auxCarritosGuardados = carritosGuardados;
        auxCarritoGuardado = carritoGuardado;
        return;
      }

      // si no hay carrito guardado se genera un carrito con el nombre de usuario y la seleccion
      // que lleva en el momento de loguearse
      miSelecc = carritoUsuario.miSeleccion;
    }
  }

  carritoUsuario = new CarritoUsuario(user, miSelecc);
  actualizarCarritoEnStorage();
}

function siCargarCarritoGuardado() {
  // Se llama cuando el usuario decide cargar un carrito que tenía guardado
  // Se devuelven los productos que pudiese tener seleccionados al momento de loguearse
  if (carritoUsuario.miSeleccion && carritoUsuario.miSeleccion.length)
    vaciarCarrito();
  // Se procede a la carga del carrito guardado y todas las actualizaciones necesarias
  validarCarritoGuardado(usuario, auxCarritoGuardado);
  animarIconoCarritoIn();
  actualizarInfoTarjetas();
  actualizarCarritoEnStorage();
  removerCarritoGuardado(auxCarritoGuardado, auxCarritosGuardados);
}

function noCargarCarritoGuardado() {
  // Se llama si decide no cargar el carrito guardado
  removerCarritoGuardado(auxCarritoGuardado, auxCarritosGuardados); // Se elimina del storage el carrito guardado a nombre del usuario
  // Se continua con la seleccion que tenía pero generando un carrito con su nombre, en lugar de anónimo
  let miSelecc = carritoUsuario.miSeleccion;
  carritoUsuario = new CarritoUsuario(usuario, miSelecc);
  actualizarCarritoEnStorage();
}

function validarCarritoGuardado(user, carritoGuard) {
  // Valida las cantidades del carrito de compra guardado y filtra lo que se puede vender
  let productoItem;
  // recorre el carrito tomado y se fija si al momento actual todos los productos se encuentran
  // en stock en las cantidades solicitadas, generando un carrito validado solo con los
  // productos posibles de vender. (Es por si luego de un tiempo se carga un carrito y ese producto ya no tiene stock)
  let miSeleccionValidada = carritoGuard.miSeleccion.filter(item => {
    productoItem = productos.find(producto => producto.id == item.id);
    if (productoItem.vender(item.cant)) {
      console.log(
        "%cComprando",
        "color: white; background-color: green; padding: 3px",
        productoItem.title,
        "// Cant:",
        item.cant
      );
      return true;
    }
  });

  carritoUsuario = new CarritoUsuario(user, miSeleccionValidada);
  //si hubo que quitar productos de la selección del carrito guardado, lo advierte, sino muestra un mensaje de que todo resulto OK
  if (carritoUsuario.miSeleccion.length < carritoGuard.miSeleccion.length) {
    mostrarEmergente(
      `
            Atención:<br>
            Alguno de los productos de su carrito guardado fueron removidos porque la cantidad solicitada no se encuentra actualmente disponible.<br>
            Sepa disculpar las molestias.<br>
            Muchas gracias.`,
      10000,
      true
    );
  } else if (load) {
    mostrarEmergente(
      "Todos los productos de su carrito guardado fueron añadidos con éxito",
      4000
    );
  }
}

// Funciones para ordenar los productos ***************************************
//*****************************************************************************

function ordenarProductos(vectorAOrdenar) {
  //procesa la opción seleccionada de orden en el select y llama a la función de orden respectiva
  let tipoOrden = $selectOrdenar.val().toLowerCase();
  let funcion;
  switch (tipoOrden) {
    case "p":
      funcion = ordenarDestacado;
      break;

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

    case "d-":
      funcion = ordenarMenorDescuento;
      break;

    case "d+":
      funcion = ordenarMayorDescuento;
      break;

    default:
      break;
  }
  vectorAOrdenar.sort(funcion);
  mostrarProductos(vectorAOrdenar);
  actCantProductosEncontrados(vectorAOrdenar);
}

const ordenarDestacado = (a, b) => {
  // Función de ordenamiento destacados primero, luego alfabetico de marca y descripción (a-Z)
  if (a.highlight == b.highlight) {
    if (a.brand.localeCompare(b.brand) == 0) {
      return a.title.localeCompare(b.title);
    }
    return a.brand.localeCompare(b.brand);
  }
  return b.highlight - a.highlight; // en este caso true toma el valor de 1 y false el de 0
};

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

const ordenarMenorDescuento = (a, b) => {
  // Función de ordenamiento por menor descuento y por marca (a-Z)
  if (a.discount - b.discount == 0) {
    if (a.brand.localeCompare(b.brand) == 0) {
      return a.title.localeCompare(b.title);
    }
    return a.brand.localeCompare(b.brand);
  }
  return a.discount - b.discount;
};

const ordenarMayorDescuento = (a, b) => {
  // Función de ordenamiento por mayor descuento y por marca (a-Z)
  if (b.discount - a.discount == 0) {
    if (a.brand.localeCompare(b.brand) == 0) {
      return a.title.localeCompare(b.title);
    }
    return a.brand.localeCompare(b.brand);
  }
  return b.discount - a.discount;
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
      prod => prod.title.toLowerCase().indexOf(fraseBuscar) != -1
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

function filtrarDestacados(vectorAFiltrar) {
  // Filtra al vector pasado por si es o no un producto destacado
  checkDestacado = $listadoFitros.find(":checkbox").prop("checked");
  if (checkDestacado) {
    productosFiltradosCliente = vectorAFiltrar.filter(prod => prod.highlight);
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
      coincidencia.cant++;
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
                )}">${item.brand} (${item.cant})</label>
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
                        <h5 class="card-title">${producto.brand}</h5>
                        <p class="card-text">${producto.title}</p>
                        <p class="my-2"><b>Precio: $${formatoPrecio(
                          producto.price
                        )}</b> ${precioSinDescuento}</p>
                        <p class="my-2">Disponible: ${producto.stock}u</p>`;

      if (producto.stock > 0) {
        // Si se puede vender genera los botones de agregar y el input de cantidad
        // setea el atributo "data-" con el valor del id del producto. esto lo hice así para guardar
        // una referencia al producto, pero sin usar id (ya que deben ser únicos en el documento) porque
        // puede repetirse en distintos lugares esta referencia. Aparte tambien queda más limpio que usar clases.
        // seteo el atributo del input "max" en el actual valor de stock para tener un control extra sobre el rango.
        codigoHTML += `
                        <div class="form-inline">
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
    let id = $(this).data("productoId");
    let $inputCantidad = $(this).next();
    let cant = parseInt($inputCantidad.val());
    // primero verifico si la cantidad es valida entes de agregar al carrito. Si bien setee el
    // atributo "max" en el input, puede que el usuario manualmente fuerce un valor no admisible
    if (validarCantidad(id, cant)) {
      agregarCarrito(id, cant);
    }
    $inputCantidad.val(1); // devuelve el valor del input a 1
  });
}

function actualizarInfoTarjetas() {
  // en lugar de cambiar la cantidad de la tarjeta asociada al evento agregar, eliminar prodcuto, etc, se
  // actualiza el conjuto de información mostrada en ese momento por si a futuro desde un servidor vienen los datos actualizados y hay otros
  // productos distintos al que interactuamos que cambiaron su disponibilidad por acciones de otros usuarios

  let $botonesTarjetas = $("#contenedorProductos .card-body button");

  $botonesTarjetas.each(function () {
    let prodId = $(this).data("productoId");
    let producto = productos.find(prod => prod.id == prodId);
    let prodStock = producto.stock;
    let $bodyTarjeta = $(this).closest(".card-body");
    $bodyTarjeta.find("p:nth-of-type(3)").html(`Disponible: ${prodStock}u`);
    if (prodStock < 1 && $(this).parent(".form-inline").length) {
      $(this).parent(".form-inline").remove();
      $bodyTarjeta.append(
        `<button type="button" class="btn btn-danger" data-producto-id="${producto.id}" disabled>Agotado</button>`
      );
    }
    if (prodStock >= 1) {
      if ($(this).parent(".form-inline").length == 0) {
        $(this).remove();
      } else {
        $(this).parent(".form-inline").remove();
      }
      $bodyTarjeta
        .append(
          `
                    <div class="form-inline">
                        <button type="button" class="btn btn-danger w-50 btnAgregar" data-producto-id="${producto.id}">Agregar</button>
                        <input type="number" class="form-control ml-2 inputCantidad" value="1" min="1" max="${producto.stock}">
                     </div>`
        )
        .find(".btnAgregar")
        .click(function (e) {
          // genero los eventos para todos los botones agregar
          // para luego pasar los valores del producto correspondiente a la funcion de agregar al carrito,
          // tomo esos valores del atributo "data-" mediante el metodo data()
          let id = $(this).data("productoId");
          let $inputCantidad = $(this).next();
          let cant = parseInt($inputCantidad.val());
          // primero verifico si la cantidad es valida entes de agregar al carrito. Si bien setee el
          // atributo "max" en el input, puede que el usuario manualmente fuerce un valor no admisible
          if (validarCantidad(id, cant)) {
            agregarCarrito(id, cant);
          }
          $inputCantidad.val(1); // devuelve el valor del input a 1
        });
    }
  });
}

// Funciones relacionadas a agregar o sacar productos del carrito *************
//*****************************************************************************

function validarCantidad(prodId, cant) {
  //valida la cantidad del producto a agregar ingresada por el cliente
  let producto = productos.find(prod => prod.id == prodId);

  if (!(cant >= 1)) {
    // si el valor no es lógico, lo avisa
    mostrarEmergente(
      `Cantidad NO válida.<br>Reingrese la cantidad.`,
      4000,
      true
    ); // gerero un mensaje destacado que se cierra a los 4 segundos
    return false;
  } else if (!producto.consultaVenta(cant)) {
    // Si el valor es lógico, pero la cantidad solicitada es mayor al stock lo avisa.
    mostrarEmergente(
      `
            No se puede comprar esa cantidad, stock insuficiente.<br>
            Disponible: ${producto.stock} unidades.<br>
            Verifique la disponibilidad y reingrese la cantidad.`,
      10000,
      true
    ); // genero un mensaje destacado que se cierra a los 10 segundos para dar más importancia

    return false;
  } else {
    // si la cantidad es válida pasa
    return true;
  }
}

function agregarCarrito(prodId, cant) {
  //agrega los productos al carrito y los agrupa si son del mismo tipo. También actualiza la página y el stock
  let producto = productos.find(prod => prod.id == prodId);
  producto.vender(cant);
  let coincidencia = carritoUsuario.miSeleccion.find(item => item.id == prodId);
  if (coincidencia) {
    // si ya existía el producto en el carrito, le suma la cantidad ingresada
    coincidencia.cant += cant;
  } else {
    // sino, agrega el item completo
    const miItem = new ItemCarrito(producto, cant);
    carritoUsuario.miSeleccion.push(miItem);
  }

  let mensajeEmergente = `Agregado: ${producto.title}<br>Cantidad: ${cant} unidades.`;
  mostrarEmergente(mensajeEmergente, 4000); // genero mensaje normal por 4 segundos

  console.log(
    "%cComprando",
    "color: white; background-color: green; padding: 3px",
    producto.title,
    "// Cant:",
    cant
  ); // simulando un control interno de la operación

  // hago las actualizaciones correspondientes
  animarIconoCarritoIn();
  actualizarCarritoEnStorage();
  actualizarInfoTarjetas();
}

function restarUnidadCarrito(prodId) {
  // resta una unidad del ítem del carrito elegido
  let itemCarrito = carritoUsuario.miSeleccion.find(item => item.id == prodId);
  let productoItem = productos.find(prod => prod.id == prodId);

  productoItem.ingresar(1); // devuelvo esa unidad al stock
  itemCarrito.cant--;

  console.log(
    "%cRestando",
    "color: white; background-color: orange; padding:3px",
    itemCarrito.prod,
    "// Cant:",
    1
  ); // Infomación de control interno

  if (itemCarrito.cant == 0) {
    // si el item del carrito quedo en cero unidades, lo elimino
    let indice = carritoUsuario.miSeleccion.indexOf(itemCarrito);
    carritoUsuario.miSeleccion.splice(indice, 1);
    eliminarElemCarritoFade(prodId, 350);
  } else {
    mostrarCarrito();
  }

  // hago las actualizaciones correspondientes
  animarIconoCarritoOut();
  actualizarCarritoEnStorage();
  actualizarInfoTarjetas();
}

function eliminarProductoCarrito(prodId) {
  // elimina un item completo del carrito
  let itemCarrito = carritoUsuario.miSeleccion.find(item => item.id == prodId);
  let productoItem = productos.find(prod => prod.id == prodId);

  productoItem.ingresar(itemCarrito.cant); // devuelvo la cantidad de ese item al stock

  console.log(
    "%cEliminando",
    "color: white; background-color: red; padding:3px",
    itemCarrito.prod,
    "// Cant:",
    itemCarrito.cant
  ); // Infomación de control interno

  let indice = carritoUsuario.miSeleccion.indexOf(itemCarrito);
  carritoUsuario.miSeleccion.splice(indice, 1); // elimino del array miSeleccion, el objeto item correspondiente

  eliminarElemCarritoFade(prodId, 350);
  // hago las actualizaciones correspondientes
  animarIconoCarritoOut();
  actualizarCarritoEnStorage();
  actualizarInfoTarjetas();
}

function vaciarCarrito() {
  // vacía el carrito activo del usuario
  let productoItem;
  let cont = 0;

  for (let item of carritoUsuario.miSeleccion) {
    // devuelvo al stock las cantidades del los productos que se eliminan del carrito
    cont++;
    productoItem = productos.find(producto => producto.id == item.id);
    productoItem.ingresar(item.cant);
    $contenedorItemsCarrito
      .find(`button[data-producto-id='${item.id}']`)
      .parent()
      .parent()
      .css("backgroundColor", "#b30404ba")
      .fadeOut(750 * (1 + cont * 0.05));
  }
  $contenedorItemsCarrito
    .parent()
    .next()
    .fadeOut(750 * (1 + cont * 0.05), () => {
      mostrarCarrito();
      $contenedorItemsCarrito.parent().next().show();
    });

  carritoUsuario.miSeleccion = [];
  // hago las actualizaciones correspondientes
  animarIconoCarritoOut();
  actualizarCarritoEnStorage();
  actualizarInfoTarjetas();

  console.log(
    "%c----- Carrito vaciado -----",
    "color:white; background-color: red; padding: 3px"
  ); // Infomación de control interno
}

// Funciones para mostrar y/o actualizar la información del carrito ***********
//*****************************************************************************

function mostrarCarrito() {
  //genera el HTML para la ventana modal del carrito
  // En el modal ya tengo dos secciones pre-confeccionadas con formatos distintos
  // para un carrito vacío o uno con contenido. La sección vacía ya tiene todo
  // el código necesario para mostrarse.
  // Lo hice de esta manera distinta, para probar distintas opciones de manejo del DOM.
  let $htmlCarritoNoVacio = $("#modalCarrito .carritoNoVacio");
  let $htmlCarritoVacio = $("#modalCarrito .carritoVacio");

  if (carritoUsuario.miSeleccion.length == 0) {
    // si el carrito esta vacio, manejo display:none para mostrar la sección correspondiente
    $htmlCarritoNoVacio.hide();
    $htmlCarritoVacio.show();
  } else {
    // Si tiene productos, manejo display:none para mostrar la sección correspondinte
    // si esta abierto no lo oculto para no generar una nueva animación. De lo contrario,
    // lo oculto para habilitar la animación final del slideDown
    if (!carritoAbierto) $htmlCarritoNoVacio.hide();
    $htmlCarritoVacio.hide();

    //genero un array donde almaceno todo el HTML necesario así lo inserto en el DOM en una unica vez
    const arrayFilas = [];
    let total = 0;
    for (const item of carritoUsuario.miSeleccion) {
      // genero las filas de la tabla del carrito dinámicamente con los datos del producto
      let productoItem = productos.find(prod => prod.id == item.id);
      let fila = `
                <tr>
                    <td><img src="${
                      productoItem.thumbnail
                    }" class="card-img-top" alt=""></td>
                    <td>${productoItem.title}</td>
                    <td class="text-center">${item.cant}x</td>
                    <td class="text-right font-weight-bold">$${formatoPrecio(
                      productoItem.price
                    )}</td>
                    <td class="text-right font-weight-bold">
                        <button class="menos" type="button" data-producto-id="${
                          productoItem.id
                        }">-</button>
                        <button class="eliminar" type="button" data-producto-id="${
                          productoItem.id
                        }">x</button>
                    </td>
                </tr>`;
      arrayFilas.push(fila);
      total += productoItem.price * item.cant;
    }
    $contenedorItemsCarrito.empty();
    $contenedorItemsCarrito.append(arrayFilas);

    acumulado = total;
    $totalCarrito.text("$" + formatoPrecio(total)); // inserto el importe total acumulado en la respectiva seccion del HTML
    $htmlCarritoNoVacio.delay(500).slideDown(1200); // Genero la animación desplegable con un delay previo para dar lugar a que el html generado este cargado
    carritoAbierto = true;
  }
}

function eliminarElemCarritoFade(prodId, tiempo) {
  $contenedorItemsCarrito
    .find(`button[data-producto-id='${prodId}']`)
    .parent()
    .parent()
    .css("backgroundColor", "#b30404ba")
    .fadeOut(tiempo, function () {
      // hago las actualizaciones correspondientes
      mostrarCarrito();
    });
}

function animarIconoCarritoIn() {
  // animacion encadenada del icono del carrito
  $numItems.stop(true);
  $numItems
    .css({
      top: "-55px",
      opacity: "0"
    })
    .animate(
      {
        top: "-10px",
        opacity: ".3"
      },
      600
    )
    .animate(
      {
        opacity: "1"
      },
      250
    );
  actualizarIconoCarrito();
}

function animarIconoCarritoOut() {
  // animacion encadenada del icono del carrito
  $numItems.stop(true);
  $numItems
    .animate(
      {
        top: "-55px",
        opacity: "0"
      },
      600,
      () => {
        $numItems.css("top", "-10px");
        actualizarIconoCarrito();
      }
    )
    .animate(
      {
        opacity: "1"
      },
      250
    );
}

function actualizarIconoCarrito() {
  //refresca el contador del ícono carrito
  let contador = 0;
  for (const producto of carritoUsuario.miSeleccion) {
    contador += producto.cant;
  }
  $numItems.text(contador);
}

// Funciones de Login Logout del usuario **************************************
//*****************************************************************************

function loguearUsuario() {
  // Se ejecuta al tocar en el boton I/O de logueo
  if (!usuario) {
    // si no hay usuario, porcede al login
    if (logInUsuario()) {
      validarUsuario();
    }
  } else {
    // sino al logout
    logOutUsuario();
  }
}

function logInUsuario() {
  // Genera al usuario en caso de no tener una sesion abierta (login)
  let user;

  user = $inputUsuario.val();

  // si el valor ingresado no cumple los requisitos, genero un HTML para mostrar un mensaje de
  // error debajo del input de login/out
  let $errorInputUsuario = $("#errorInputUsuario");
  if (
    user.trim().length < 5 ||
    user.trim().length > 20 ||
    !isNaN(parseInt(user))
  ) {
    // acá inpongo los requisitos a cumplir en el nombre de usuario (para practicar)
    // paro todas las animaciones que puedan estar ejecutandose sobre el elmento. Por ejemplo si tecleo rápido usuarios erroneos
    $errorInputUsuario.stop(true);
    // El mensaje aparece en 0.3s, dura 4 segundos visible y se oculta en 0.3s
    $errorInputUsuario.slideDown(300, () => {
      // paso un callback a la animación para encadenarlas
      $errorInputUsuario.delay(4000).slideUp(300);
    });

    $inputUsuario.val(""); // reseteo el valor del input para que vuelva a ingresar
    return false;
  } else {
    // si cumple los requisitos, seteo el usuario y guardo en storage
    $errorInputUsuario.stop(true).slideUp(300); // encadeno primero las paradas de animaciones y luego ejecuto la animacion de ocultar

    usuario = user;
    localStorage.setItem("usuario", user);
    return true;
  }
}

function logOutUsuario() {
  // hace el logOut del usuario
  // remueve el "usuario" del localStorage y setea los valores a vacíos
  localStorage.removeItem("usuario");
  usuario = "";
  $inputUsuario.val("");
  $inputUsuario.attr("disabled", false); // habilita la interaccion con el el input usuario

  // si el carrito actual contiene productos, pregunto si quiere guardarlos
  if (carritoUsuario.miSeleccion && carritoUsuario.miSeleccion.length != 0) {
    mostrarModalConfirm(
      `
            Has salido de tu usuario y tienes productos seleccionados en tu carrito!<br>
            ¿Deseas guardarlos para poderlos recuperar más adelante?`,
      "siGuardarCarrito",
      "noGuardarCarrito"
    ); // genero modal de confirmación preguntando si gurada carrito
  } else {
    carritoUsuario.usuario = "";
    actualizarCarritoEnStorage();
  }
}

function siGuardarCarrito() {
  // función que llama el boton "Si" del modal generado por la funcion logOutUsuario() si hay un carrito para guardar
  guardarCarritoEnStorage(); // guardo el carrito en el localStorage
  let mensaje = `${
    carritoUsuario.usuario
  }, tu carrito fue guardado.<br><br>Has guardado ${$numItems.text()} producto/s`;
  mostrarModalInfo(mensaje); // muestro modal informativo

  // hago las actualizaciones correspondientes
  vaciarCarrito();
  carritoUsuario.usuario = "";
  actualizarCarritoEnStorage();
}

function noGuardarCarrito() {
  // función que llama el boton "No" del modal generado por la funcion logOutUsuario() si hay un carrito para guardar
  vaciarCarrito();
  carritoUsuario.usuario = "";
  actualizarCarritoEnStorage();
}

function actualizarCarritoEnStorage() {
  // almacena el carrito del usuario actual en el localStorage como carrito actual ("carritoUsuario")
  localStorage.setItem("carritoUsuario", JSON.stringify(carritoUsuario));
}

function guardarCarritoEnStorage() {
  // guarda el carrito del usuario actual en el localStorage dentro de un array que contiene los carritos guardados
  // por distintos usuarios de la computadora ("carritosGuardados")

  if (localStorage.getItem("carritosGuardados")) {
    // si ya existe la variable en el localStorage, verifica si ya hay algún carrito de ese mismo usuario guardado anteriormente
    let carritosGuardados = JSON.parse(
      localStorage.getItem("carritosGuardados")
    );
    let coincidencia = carritosGuardados.find(
      carr => carr.usuario == carritoUsuario.usuario
    );
    if (coincidencia) {
      // si ya habia un guardado un carrito con ese usuario, reemplaza su contenido, lo parsea y guarda
      coincidencia.miSeleccion = carritoUsuario.miSeleccion;
      localStorage.setItem(
        "carritosGuardados",
        JSON.stringify(carritosGuardados)
      );
    } else {
      // si no, agrega el carrito al array, para posteriormente parsearlo y guardarlo
      carritosGuardados.push(carritoUsuario);
      localStorage.setItem(
        "carritosGuardados",
        JSON.stringify(carritosGuardados)
      );
    }
  } else {
    // si no existe la variable en el storage, la crea y guarda el carrito de ese usuario
    let carritosGuardados = [];
    carritosGuardados.push(carritoUsuario);
    localStorage.setItem(
      "carritosGuardados",
      JSON.stringify(carritosGuardados)
    );
  }
}

function removerCarritoGuardado(carritoGuardado, carritosGuardados) {
  // remueve un carrito guardado en el localStorage dentro del array parseado "carritosGuardados"
  let indice = carritosGuardados.indexOf(carritoGuardado);
  carritosGuardados.splice(indice, 1); // elimina el elemento del array y luego parsea y guarda nuevamente en storage
  localStorage.setItem("carritosGuardados", JSON.stringify(carritosGuardados));
}

// Funciones para mensajes emergentes *****************************************
//*****************************************************************************

function mostrarEmergente(leyenda, tiempo, destacar) {
  // Funcion para mostrar mensajes emergentes (no modales). Se introduce por parámetro
  // la leyenda, el tiempo antes que se cierre solo y si es destacado o no.
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

function mostrarModalInfo(leyenda) {
  // Funcion para mostrar modales del tipo Info, tomando como parametro la leyenda
  $divModalMensajes.find(".modal-body h4").html(leyenda);
  $divModalMensajes.find(".modal-footer").html(""); // quita el footer prestablecio en el HTML original, ya que contiene botones que no se usan acá.
  // mediante asignación de clases usadas en CSS, se muestra el modal y se dan los estilos del tipo ".info"
  $divModalMensajes.addClass("show");
  $divModalMensajesFondo.addClass("show");
  $divModalMensajes.find(".modal-content").addClass("info");
}

function mostrarModalConfirm(leyenda, accionSi, accionNo) {
  // Funcion para mostrar modales del tipo Confirm, tomando como parametro la leyenda, la acción del boton Si y del No
  $divModalMensajes.find(".modal-body h4").html(leyenda);

  // genero dinámicamente los botones de confirmacion, asignando su acción en caso del "Si" o el "No".
  // guardo el tipo de accion el los atributos "data-" para luego tomarlo con la propiedad "dataset" o metodo data() de jQ
  let botones = `
        <button type="button" class="btn btn-danger w-25" data-accion="${accionSi}">Si</button>
        <button type="button" class="btn btn-dark w-25" data-accion="${accionNo}">No</button>`;

  $divModalMensajes.find(".modal-footer").html(botones);
  // oculto el header que no se correspoende en este caso, ya que posee una x para cerrar, pero acá necesito un Si o un No como respuesta
  $divModalMensajes.find(".modal-header").attr("hidden", true);
  // mediante asignación de clases usadas en CSS, se muestra el modal
  $divModalMensajes.addClass("show");
  $divModalMensajesFondo.addClass("show");
}

function cerrarModalMensaje() {
  // Funcion para cerrar las ventanas modales de Info. Se llama al tocar la "x" del header del modal
  // Se oculta y resetan el conjunto de estilos y contenido HTML del modal
  $divModalMensajes.removeClass("show");
  $divModalMensajesFondo.removeClass("show");
  $divModalMensajes.find(".modal-content").removeClass("info");
  $divModalMensajes.find(".modal-header").attr("hidden", false);
  $divModalMensajes.find(".modal-body h4").html("");
  $divModalMensajes.find(".modal-footer").html("");
}

// Funciones para procesar la url por el cambio de linkeo # *******************
//*****************************************************************************

//Obtener el linkeo actual (Se usa el objeto Location y su propiedad hash)
const parseLocation = () => location.hash.slice(1).toLowerCase() || "/";

//Busca la categoría en el array links que corresponde al linkeo actual
const buscarCategoriaLinkeo = (path, links) => {
  const linkeo = links.find(l => l.path == path);
  if (linkeo) {
    return linkeo.categoria;
  } else {
    return false;
  }
};

function direccionarCategoria() {
  // direcciona ala categoría de producto según el linkeo actual de la url
  const path = parseLocation(); //Obtiene linkeo actual
  const categoria = buscarCategoriaLinkeo(path, links);

  if (categoria) {
    // si encuentra una categoría válida, simula un click en la misma
    $(`#cat${categoria}`).trigger("click");
  }
}

// **************************************************************************//
// ******************************** Eventos *********************************//
// **************************************************************************//

// Los eventos sobre el DOM, se pusieron dentro de la función cargaOk(), ya que si
// la carga de la página no es correcta por fallar alguna de las solicitudes AJAX
// no tiene sentido asignar esos eventos, es más causarían errores

let clickear = new MouseEvent("click", {
  // defino un evento "click" para simularlo desde JS
  bubbles: true,
  cancelable: true
});

$(window).resize(function () {
  // Evento por si el usuario cambia posición de dispositivo
  // para que siempre los filtros en vista xs empiecen ocultos y en mayores anchos
  // empiecen visibles. Esto se da por defecto al cargar la página, pero si el usuario
  // interactua con el toggle de filtros y lo oculta, puede llegar a verse vacio si pasa
  // a una vista de ancho mayor en donde los filtros van en una columna izquierda
  if (window.outerWidth != outerWidthPrevio) {
    // Esta comparación la hago porque en los celulares
    //al hacer scroll, se reacomoda el ALTO de la ventana y dispara el evento resize, cerrando el
    //desplegable. entonces de esta maner pregunto si el outerwidth es el mismo y no hago nada
    //de lo contrario ejecuto el código y almaceno el nuevo valor como previo
    if (
      $("#contenedorFiltros").css("display") == "none" &&
      window.innerWidth >= 576
    ) {
      $("#contenedorFiltros").css("display", "block");
    }
    if (
      $("#contenedorFiltros").css("display") == "block" &&
      window.innerWidth < 576
    ) {
      $("#contenedorFiltros").css("display", "none");
    }
    outerWidthPrevio = window.outerWidth;
  }
});

// **************************************************************************//
// ******************************* Ejecución ********************************//
// **************************************************************************//

// Evalúo ambas solicitudes AJAX y ejecuto las funciones según se resuelvan
// ambas exitosamente o no.
$.when(productosAjax(), dolarAjax()).then(cargaOk, cargaError);

function cargaOk() {
  $("#contenedorProductos .loader").hide();

  // Si las dos solicitudes AJAX se cumplen correctamente entonces asigno los
  // eventos e inicio el simulador. No asigno los eventos si no se cumple esto
  // para evitar errores de funcionamiento si el usuario intenta usar la aplicación
  // con error de carga

  // **********************************************************************//
  // ****************************** Eventos *******************************//
  // **********************************************************************//
  $btnBuscar.click(function (e) {
    // Al clickear en boton buscar al lado del input correspondiente, se llama a la funcion buscarProductos
    buscarProductos();
    filtrarCategoria(productosFiltradosCliente);
    filtrarDestacados(productosFiltradosCliente);
    ordenarProductos(productosFiltradosCliente);
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

  $btnCarritoCerrar.click(e => {
    // Evento para indicar que se cerro el carrito y hacer luego animación slidedown en mostrarCarrito
    carritoAbierto = false;
  });

  $btnCerrarMensajeEmergente.click(e => {
    // Evento al clickear en la x de los mensajes emergentes para ocultarlo
    $divMensajesEmergentes.removeClass("show");
    $divMensajesEmergentes.removeClass("destacado");
    clearTimeout(tempEmergente); // quita el timer que se inicializó con el mensaje
  });

  $btnCerrarModalMensaje.click(e => {
    // cierra el modal de tipo Info al clickear en la x (el de tipo Confirm, no muestra esta x)
    cerrarModalMensaje();
  });

  $btnConfirmarCompra.click(function (e) {
    //Actualizo el listado de productos en el sesionStorage con las cantidades de stock que quedaron
    //para simular correctamente la venta y para luego hacer util a la funcion verificarReposicion() en la pagina compra.html
    let productosJSON = JSON.stringify(productos);
    sessionStorage.setItem("productos", productosJSON);
    location.assign("compra.html"); // redirijo a la pagina compra.html
  });

  $btnLogInOut.click(function (e) {
    loguearUsuario();
  }); // Llama a la funcion loguearUsuario al clickear el botón I/O del logueo

  $btnVaciarCarrito.click(function (e) {
    // Evento al clickear sobre el botón de vaciar el carrito dentro de la ventana del carrito
    vaciarCarrito();
  });

  $carritoIcon.click(function (e) {
    // evento asociado al icono del carrito para mostrar su información
    mostrarCarrito();
  });

  $contenedorItemsCarrito.click(function (e) {
    // evento global dentro del contenedor de los itmes del carrito
    // se toma el elemento que se esta clickeando dentro del contenedor y se pregunta por el atributo data Id
    let $elemento = $(e.target);
    let id = $elemento.data("productoId");
    if (!id) return; // si no tiene ese atributo, no se hace nada porque se esta clickeando en un lugar que no interesa
    if ($elemento.hasClass("menos")) {
      // si tiene id y la clase .menos, se trata del boton restar unidad y se llama a la función respectiva pasando como parámetro el id del producto
      restarUnidadCarrito(id);
    } else if ($elemento.hasClass("eliminar")) {
      // si la clase es .eliminar, se trata del boton eliminar item y se llama a la función respectiva pasando el id como parámetro
      eliminarProductoCarrito(id);
    }
  });

  $divModalMensajes.find(".modal-footer").click(function (e) {
    // Evento general del footer de la ventana modal de mensajes
    // se toma el elemento que se esta clickeando dentro del footer del modal y se pregunta por el atributo data-accion
    let $elemento = $(e.target);
    let accion = $elemento.data("accion");
    if (!accion) return;
    cerrarModalMensaje();
    switch (
      accion // Según el valor del atributo data-accion, se porcede a llamar a la funcion que corresponda
    ) {
      case "siCargarCarrito":
        siCargarCarritoGuardado();
        break;
      case "noCargarCarrito":
        noCargarCarritoGuardado();
        break;
      case "siGuardarCarrito":
        siGuardarCarrito();
        break;
      case "noGuardarCarrito":
        noGuardarCarrito();
        break;
      default:
        console.log("Hay algún error");
        break;
    }
  });

  $filtroBuscar.click(function (e) {
    // Este evento se dispara, al clickear el botón que aparece luego de hacer una búsqueda por descripción
    $(this).addClass("ocultar"); // vuelve a ocultar el botón
    // Acá se vuelven a mostrar todos los productos y ordenados según la selección del select, reseteando el campo del input de búsqueda
    busqueda = false;
    filtrarCategoria(productos);
    filtrarDestacados(productosFiltradosCliente);
    ordenarProductos(productosFiltradosCliente);
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
    filtrarDestacados(productosFiltradosCliente);
    ordenarProductos(productosFiltradosCliente);
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

  $inputUsuario.keyup(function (e) {
    // Llama a la funcion loguearUsuario al presionar la tecla Enter en el input del logueo
    if (e.key == "Enter") {
      loguearUsuario();
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
    filtrarDestacados(productosFiltradosCliente);
    ordenarProductos(productosFiltradosCliente);
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
    filtrarDestacados(productosFiltradosCliente);

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
  });

  $listadoFitros.find(":input[type='range']").change(function (e) {
    // Agrego enevto a los dos input "range" para que al cambiar su valor, muestre los productos con el orden seleccionado
    let vectorAFiltrar = [...productosFiltradosCliente];
    if (filtroMarcaAplicado) {
      vectorAFiltrar = filtrarMarcas(vectorAFiltrar, marcasAFiltrar);
    }

    ordenarProductos(filtrarRangoPrecio(vectorAFiltrar));
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
  });

  $(window).on("hashchange", function () {
    //Cada vez que se detecta un cambio en el # de la URL llama a la función direccionarCategoria
    direccionarCategoria();
  });

  // Función principal de inicio del simulador******************************
  // ***********************************************************************
  iniciar();
}

function cargaError() {
  // si no se cumple alguna de las solicitudes, genero un cartel
  // avisando del error y dando lugar a que el usuario vuelva a intentarlo
  $("#contenedorProductos .loader").html(`
                <h3>Ocurrió Un Error De Carga</h3>
                <p>Intenta recargar la página o regresa más tarde.</p>
                <p>Disculpe las molestias.</p>
                `);
}
