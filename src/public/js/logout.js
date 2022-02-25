let initialCount = 5;

document.getElementById("seconds").innerText = initialCount;

const timer = setInterval(() => {
  document.getElementById("seconds").innerText = --initialCount;
  if (initialCount === 0) {
    clearInterval(timer);
    location.assign("/");
  }
}, 1000);
