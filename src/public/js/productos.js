const $productForm = document.getElementById("productForm");
const $productsTable = document.getElementById("productsTable");
const $productErrors = document.getElementById("productErrors");

let user = null;

// Renderiza la tabla de productos utilizando template de hbs
async function renderTable(file, data) {
  let response = await fetch(file);
  const templateFile = await response.text();
  const template = Handlebars.compile(templateFile);
  const html = template(data);
  return html;
}

// Acciones al enviar el formulario de productos
$productForm.addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData($productForm);
  // const product = {
  //   title: data.get("title"),
  //   detail: data.get("detail"),
  //   brand: data.get("brand"),
  //   code: data.get("code"),
  //   category: data.get("category"),
  //   price: data.get("price"),
  //   stock: data.get("stock"),
  //   thumbnail: data.get("thumbnail"),
  //   imageFile: data.get("imageFile")
  // };

  fetch("/api/productos/1", {
    method: "PUT",
    body: formData
  })
    .then(r => r.json())
    .then(data => {
      console.log(data);
    });

  //console.log(product);
  //$productForm.reset();
});
