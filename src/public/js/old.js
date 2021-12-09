//Generales ***************************
let acumulado = 0;

let busqueda = false;

let checkDestacado = false;
let filtroPrecioAplicado = false;
let filtroMarcaAplicado = false;
let marcasAFiltrar = [];
let load = false;
let precioMinimo, precioMaximo, precioMinSel, precioMaxSel;
let productosFiltradosCliente;
let tempEmergente; // Variable que almacena el temporizador de los mensajes emergentes para poder quitarlos antes de que se ejecuten
let usuario = "";

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
  ordenarProductos(productosFiltradosCliente);
  seteoRangoPrecios(productosFiltradosCliente);
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

// **************************************************************************//
// ******************************* Ejecución ********************************//
// **************************************************************************//

// Evalúo ambas solicitudes AJAX y ejecuto las funciones según se resuelvan
// ambas exitosamente o no.
$.when(Promise.reject()).then(cargaOk, cargaError);

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

//********************************************************************* */
/********************************************************************* */
/********************************************************************* */
/********************************************************************* */
/********************************************************************* */
/********************************************************************* */
/********************************************************************* */
/********************************************************************* */
/********************************************************************* */
/********************************************************************* */
/********************************************************************* */
/********************************************************************* */

function cargaError() {
  // si no se cumple alguna de las solicitudes, genero un cartel
  // avisando del error y dando lugar a que el usuario vuelva a intentarlo
  $("#contenedorProductos .loader").html(`
                <h3>Ocurrió Un Error De Carga</h3>
                <p>Intenta recargar la página o regresa más tarde.</p>
                <p>Disculpe las molestias.</p>
                `);
}

let productos = [
  {
    id: 1,
    timestamp: 1638976507527,
    category: "accesorios",
    code: "00001-B3",
    brand: "PODIUM",
    title: "Caramagnola Plástica Podium 0.5L. Versión Eco. Color A Granel.",
    detail:
      "Lorem ipsum doxoxr sit amet coxncztr adzipicg ezlxt. Harum, lacxet prxaenxtium non pzrsxciztis vzlt. Ozyo cupzdtazt anzmi harum vzl omzni tezntur tezpozrbs qzaxz pozsmus, axut dezsernt vxtae fzcre fzilis.",
    price: 450,
    stock: 50,
    thumbnail: "/img/productos/1638992489389-producto1.jpg"
  },
  {
    id: 2,
    timestamp: 1638976507528,
    category: "componentes",
    code: "M-MTB-0345",
    brand: "MAXXIS",
    title: "Cubierta De Kevlar Maxxis Race King 29 X 2,15.",
    detail:
      "Lorem ipsum doxoxr sit amet coxncztr adzipicg ezlxt. Harum, lacxet prxaenxtium non pzrsxciztis vzlt. Ozyo cupzdtazt anzmi harum vzl omzni tezntur tezpozrbs qzaxz pozsmus, axut dezsernt vxtae fzcre fzilis.",
    price: 4750,
    stock: 15,
    thumbnail: "/img/productos/1638993090558-producto2.jpg"
  },
  {
    id: 3,
    timestamp: 1638976507528,
    category: "equipamiento",
    code: "N-CA-CI-50",
    brand: "NUTRISPORT",
    title: "Gel Energizante Nutrisport Con Cafeína 50g. Express.",
    detail:
      "Lorem ipsum doxoxr sit amet coxncztr adzipicg ezlxt. Harum, lacxet prxaenxtium non pzrsxciztis vzlt. Ozyo cupzdtazt anzmi harum vzl omzni tezntur tezpozrbs qzaxz pozsmus, axut dezsernt vxtae fzcre fzilis.",
    price: 125,
    stock: 200,
    thumbnail: "/img/productos/1638993097205-producto3.jpg"
  },
  {
    id: 4,
    timestamp: 1638976507528,
    category: "equipamiento",
    code: "S-H-PREV.075-BC/RED/SM",
    brand: "SPECIALIZED",
    title: "Casco Specialized Echelon II Ruta. Verde FL / Small.",
    detail:
      "Casco de ruta sit amet consectetur adipisicing elit. Harum, id laceat praesentium non perspiciatis velit. Optio cupiditate animi harum vel omnis tenetur temporibus quasi possimus, aut deserunt vitae facere facilis.",
    price: 15480,
    stock: 5,
    thumbnail: "/img/productos/1638993102340-producto4.jpg"
  },
  {
    id: 5,
    timestamp: 1638976507529,
    category: "accesorios",
    code: "Velo.St.12",
    brand: "CATEYE",
    title: "Velocimetro Cateye Inalámbrico ST-12.",
    detail:
      "Lorem ipsum doxoxr sit amet coxncztr adzipicg ezlxt. Harum, lacxet prxaenxtium non pzrsxciztis vzlt. Ozyo cupzdtazt anzmi harum vzl omzni tezntur tezpozrbs qzaxz pozsmus, axut dezsernt vxtae fzcre fzilis.",
    price: 3560,
    stock: 0,
    thumbnail: "/img/productos/1638993106811-producto5.jpg"
  },
  {
    id: 6,
    timestamp: 1638976507529,
    category: "componentes",
    code: "TUBOLITO.C.29/1.75-SP",
    brand: "TUBOLITO",
    title: "Cámara Tubolito MTB 29 X 1.75.",
    detail:
      "Lorem ipsum doxoxr sit amet coxncztr adzipicg ezlxt. Harum, lacxet prxaenxtium non pzrsxciztis vzlt. Ozyo cupzdtazt anzmi harum vzl omzni tezntur tezpozrbs qzaxz pozsmus, axut dezsernt vxtae fzcre fzilis.",
    price: 473,
    stock: 18,
    thumbnail: "/img/productos/1638993111629-producto6.jpg"
  },
  {
    id: 7,
    timestamp: 1638976507530,
    category: "indumentaria",
    code: "S-S-SWOR.018-WT/42",
    brand: "SPECIALIZED",
    title: "Zapatillas Specialized S-Works De Ruta. Blanco. Talle: 42.",
    detail:
      "Lorem ipsum doxoxr sit amet coxncztr adzipicg ezlxt. Harum, lacxet prxaenxtium non pzrsxciztis vzlt. Ozyo cupzdtazt anzmi harum vzl omzni tezntur tezpozrbs qzaxz pozsmus, axut dezsernt vxtae fzcre fzilis.",
    price: 14910,
    stock: 3,
    thumbnail: "/img/productos/1638993117221-producto7.jpg"
  },
  {
    id: 8,
    timestamp: 1638976507531,
    category: "bicicletas",
    code: "CODIGO",
    brand: "GIANT",
    title: "Bicicleta Ruta Giant Propel Advanced Sl 0 Disc 2020",
    detail:
      "Bicicleta de ruta sit amet consectetur adipisicing elit. Harum, id laceat praesentium non perspiciatis velit. Optio cupiditate animi harum vel omnis tenetur temporibus quasi possimus, aut deserunt vitae facere facilis.",
    price: 510000,
    stock: 2,
    thumbnail: "/img/productos/1638993121872-producto8.jpg"
  },
  {
    id: 9,
    timestamp: 1638976507531,
    category: "bicicletas",
    code: "CODIGO",
    brand: "ORBEA",
    title: "Bicicleta Ruta Orbea Gain M10 2019",
    detail:
      "Bicicleta de ruta sit amet consectetur adipisicing elit. Harum, id laceat praesentium non perspiciatis velit. Optio cupiditate animi harum vel omnis tenetur temporibus quasi possimus, aut deserunt vitae facere facilis.",
    price: 374000,
    stock: 2,
    thumbnail: "/img/productos/1638993127327-producto9.jpg"
  },
  {
    id: 10,
    timestamp: 1638976507532,
    category: "bicicletas",
    code: "CODIGO",
    brand: "SPECIALIZED",
    title: "Bicicleta Ruta Specialized Creo Sl E5 Comp 2020",
    detail:
      "Bicicleta de ruta sit amet consectetur adipisicing elit. Harum, id laceat praesentium non perspiciatis velit. Optio cupiditate animi harum vel omnis tenetur temporibus quasi possimus, aut deserunt vitae facere facilis.",
    price: 412000,
    stock: 3,
    thumbnail: "/img/productos/1638993132332-producto10.jpg"
  }
];
