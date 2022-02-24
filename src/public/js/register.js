(() => {
  const $form = document.querySelector(".needs-validation");
  const $inputPwd = document.getElementById("inputPassword");
  const $inputRepeatPwd = document.getElementById("inputRepeatPassword");

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

  $form.addEventListener("submit", event => {
    const validPwd = validateRepeatPwd();
    if (!$form.checkValidity() || !validPwd) {
      event.preventDefault();
      event.stopPropagation();
    }
    $form.classList.add("was-validated");
  });
  $inputPwd.addEventListener("input", validateRepeatPwd);
  $inputRepeatPwd.addEventListener("input", validateRepeatPwd);
})();
