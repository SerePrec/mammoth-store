// **************************************************************************//
// ****Código asociado a elementos básicos comunes a todas las páginas*******//
// **************************************************************************//

$(document).ready(function () {

    // Asociaciones de eventos relacionados al botón fijo para ir al principio
    // o final de la página. Con transición de scroll suave
    $("#botonMenu .botonMenu__link").click(() => {
        $("#botonMenu").toggleClass("active");
    });

    $("#botonMenu a.botonMenu__item:first-child").click(function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: "0"
        }, 2000);
    });

    $("#botonMenu a.botonMenu__item:last-child").click(function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $(".social").offset().top
        }, 2000);
    });

    // Eventos para el acordeón del sitemap que se ve en versión mobile 
    $(".mapaSitioAccordion .card-header").click(function (e) {
        $(this).toggleClass("desplegado");
    })
});

function formatoPrecio(num) { // Función para dar formato de precio con separadores de miles (.) y decimales (,)
    num = num.toFixed(2);
    let entero, decimales;
    if (num.indexOf(".") >= 0) {
        entero = num.slice(0, num.indexOf("."));
        decimales = (num.slice(num.indexOf("."))).replace(".", ",");
    }
    let enteroFormateado = "";
    for (let i = 1; i <= entero.length; i++) {
        if (i % 3 == 0) {
            if (i == entero.length) {
                enteroFormateado = entero.substr(entero.length - i, 3) + enteroFormateado;
                break;
            }
            enteroFormateado = (".").concat(entero.substr(entero.length - i, 3)) + enteroFormateado;
        }
    }
    enteroFormateado = entero.slice(0, entero.length % 3) + enteroFormateado;
    num = enteroFormateado.concat(decimales);
    return num;
}

function quitarDecimales(string) { // Quita los decimales del string pasado por formatoPrecio
    string = string.slice(0, string.indexOf(","));
    return string;
}

