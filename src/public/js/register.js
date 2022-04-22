(() => {
  const $btnRegister = document.getElementById("btn-register");
  const $form = document.querySelector(".needs-validation");
  const $inputPwd = document.getElementById("inputPassword");
  const $inputRepeatPwd = document.getElementById("inputRepeatPassword");
  const $inputFile = document.getElementById("inputFile");

  const maxFileSize = 1000000;

  const validateRepeatPwd = () => {
    if ($inputPwd.value !== "" && $inputPwd.value === $inputRepeatPwd.value) {
      $inputRepeatPwd.classList.remove("is-invalid");
      $inputRepeatPwd.classList.add("is-valid");
      return true;
    }
    $inputRepeatPwd.classList.remove("is-valid");
    $inputRepeatPwd.classList.add("is-invalid");
    return false;
  };

  const validateFileSize = () => {
    const fileSize = $inputFile.files[0]?.size;
    if (fileSize > maxFileSize) {
      //alert("El tamaño del archivo no puede superar 1MB");
      $inputFile.value = "";
      $inputFile.classList.remove("is-valid");
      $inputFile.classList.add("is-invalid");
      return false;
    }
    $inputFile.classList.remove("is-invalid");
    $inputFile.classList.add("is-valid");
    return true;
  };

  $form.addEventListener("submit", event => {
    const validPwd = validateRepeatPwd();
    const validSize = validateFileSize();
    if (!$form.checkValidity() || !validPwd || !validSize) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      $btnRegister.disabled = true;
      $btnRegister.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Registrando...
      `;
    }
    $form.classList.add("was-validated");
  });

  $inputFile.addEventListener("change", validateFileSize);
  $inputPwd.addEventListener("input", validateRepeatPwd);
  $inputRepeatPwd.addEventListener("input", validateRepeatPwd);
})();
