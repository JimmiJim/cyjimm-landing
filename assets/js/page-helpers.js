(function () {
  "use strict";

  document.querySelectorAll("#year").forEach(function (element) {
    element.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll(".logos img").forEach(function (image) {
    image.addEventListener("error", function () {
      image.hidden = true;
    });
  });
}());
