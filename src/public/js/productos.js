const $productForm = document.getElementById("productForm");
const $productsTable = document.getElementById("productsTable");
const $productInfoMessages = document.getElementById("productInfoMessages");

let user = null;

const productsApi = {
  getProducts: () => {
    return fetch(`/api/productos`).then(data => data.json());
  },
  getProduct: id => {
    return fetch(`/api/productos/${id}`).then(data => data.json());
  },
  saveProduct: productData => {
    return fetch(`/api/productos`, {
      method: "POST",
      body: productData
    }).then(data => data.json());
  },
  updateProduct: productData => {
    return fetch(`/api/productos/${id}`, {
      method: "PUT",
      body: productData
    }).then(data => data.json());
  },
  deleteProduct: id => {
    return fetch(`/api/productos/${id}`, {
      method: "DELETE"
    }).then(data => data.json());
  }
};

// Renderiza la tabla de productos utilizando template de hbs
function renderTable(data) {
  let html = `
    <div class="listado">
      <h2>PRODUCTOS CARGADOS</h2>`;
  if (data.length > 0) {
    html += `
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">Título</th>
            <th scope="col">Precio</th>
            <th scope="col">Imágen</th>
          </tr>
        </thead>
        <tbody>`;
    data.forEach(
      product =>
        (html += `
        <tr>
          <td>${product.id}</td>
          <td>${product.title}</td>
          <td>${product.price}</td>
          <td><img class="table__image" src="${product.thumbnail}" alt="producto" /></td>
        </tr>`)
    );
    html += `
        </tbody>
      </table>`;
  } else {
    html += `
      <div class="container p-5 mb-4 bg-yellow rounded-3">
        <div class="py-5">
          <h3 class="display-6 fw-bold">¡Oops!, listado vacío</h1>
          <p>No se encontraron productos cargados.</p>
        </div>
      </div>`;
  }
  return html;
}

// Acciones al enviar el formulario de productos
$productForm.addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData($productForm);
  productsApi
    .saveProduct(formData)
    .then(data => {
      if (data.error) {
        $productInfoMessages.innerText = data.error;
        $productInfoMessages.classList.add("show", "warning");
        setTimeout(() => {
          $productInfoMessages.classList.remove("show", "warning");
        }, 4000);
        return;
      }
      if (data.result === "ok") {
        $productForm.reset();
        $productInfoMessages.innerText = `Producto cargado con éxito`;
        $productInfoMessages.classList.add("show", "info");
        setTimeout(() => {
          $productInfoMessages.classList.remove("show", "info");
        }, 4000);
        updateTable();
      }
    })
    .catch(error => {
      console.log(error);
    });
});

function updateTable() {
  productsApi
    .getProducts()
    .then(renderTable)
    .then(html => ($productsTable.innerHTML = html));
}

updateTable();
