(() => {
  const $btnLogin = document.getElementById("btn-login");
  const $form = document.querySelector(".needs-validation");

  $form.addEventListener("submit", event => {
    if (!$form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      $btnLogin.disabled = true;
      $btnLogin.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Ingresando...
      `;
    }
    $form.classList.add("was-validated");
  });
})();
