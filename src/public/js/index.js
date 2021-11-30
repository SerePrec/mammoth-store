const $tableErrors = document.getElementById("tableErrors");
const $productsTable = document.getElementById("productsTable");
const $productForm = document.getElementById("productForm");
const socket = io();

async function render(data) {
  let response = await fetch("/templates/table.hbs");
  const templateFile = await response.text();
  const template = Handlebars.compile(templateFile);
  const html = template({ list: data });
  return html;
}

socket.on("allProducts", async products => {
  $productsTable.innerHTML = await render(products);
});

socket.on("tableErrors", error => {
  $tableErrors.innerText = error;
  $tableErrors.classList.add("show");
  setTimeout(() => {
    $tableErrors.classList.remove("show");
  }, 2000);
});

$productForm.addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData($productForm);
  const product = {
    title: data.get("title"),
    price: data.get("price"),
    thumbnail: data.get("thumbnail")
  };
  socket.emit("loadProduct", product);
});
