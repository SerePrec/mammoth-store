// **************************************************************************//
// ************************* Carga de los productos *************************//
// **************************************************************************//

const URLJSON = "/api/productos";
let productos = [];

function productosAjax() {
  return $.ajax({
    method: "GET",
    url: URLJSON,
    dataType: "json",
    success: function (respuesta) {
      console.log(respuesta);
      productos = respuesta;
    }
  });
}

// **************************************************************************//
// ************************ Carga de valor del dólar ************************//
// **************************************************************************//

const URLDOLAR = "https://www.dolarsi.com/api/api.php?type=valoresprincipales";
let valoresDolar = [];
let dolarCompra, dolarVenta;

function dolarAjax() {
  return $.ajax({
    method: "GET",
    url: URLDOLAR,
    dataType: "json",
    success: function (respuesta) {
      //console.log(respuesta);
      valoresDolar = respuesta;
      dolarOficial(valoresDolar);
      // Con una animación una vez que obtenemos la respuesta, actualiza el valor en la página
      $(".dolar").slideUp("slow", function () {
        $(this)
          .children("p")
          .text(`${formatoPrecio(dolarCompra)} / ${formatoPrecio(dolarVenta)}`)
          .parent()
          .slideDown("slow");
      });
    }
  });
}

// Recorre el array devuelto por el sitio dolarsi.com y obtiene la cotización del Dolar Oficial
function dolarOficial(vectorDolar) {
  for (const valor of vectorDolar) {
    if (valor.casa.nombre == "Dolar Oficial") {
      //lo paso a número decimal, pero debo convertir las "," en "." para que lo tome
      dolarCompra = parseFloat(valor.casa.compra.replace(",", "."));
      dolarVenta = parseFloat(valor.casa.venta.replace(",", "."));
      sessionStorage.setItem("dolar", dolarVenta);
    }
  }
}
