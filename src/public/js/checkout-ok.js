(() => {
  const orderNumber = sessionStorage.getItem("order");
  if (orderNumber) {
    sessionStorage.removeItem("order");
    document.getElementById(
      "orderNumber"
    ).innerText = `Número de órden: ${orderNumber.toString().padStart(6, "0")}`;
  }

  // Accion botón logout
  document.getElementById("btn-logout").addEventListener("click", e => {
    location.assign("/logout");
  });
})();
