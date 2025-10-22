(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

const navbarLinks = document.querySelectorAll(".navbar-nav .nav-link");
const currentPath = window.location.pathname;

navbarLinks.forEach((link) => {
  if (link.getAttribute("href") === currentPath) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

const dropdown = document.getElementById("dropdown");
const btn = dropdown.querySelector(".dropdown-btn");

btn.addEventListener("click", () => {
  dropdown.classList.toggle("active");
});

// Close dropdown if clicked outside
document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove("active");
  }
});

const sortToggle = document.getElementById("sortToggle");
const sortMenu = document.getElementById("sortMenu");
const sortInput = document.getElementById("sortInput");
const selected = document.getElementById("selected");

// Toggle dropdown
sortToggle.addEventListener("click", () => {
  sortMenu.style.display =
    sortMenu.style.display === "block" ? "none" : "block";
});

// Select option
document.querySelectorAll(".dpn-menu li").forEach((li) => {
  li.addEventListener("click", () => {
    document
      .querySelectorAll(".dpn-menu li")
      .forEach((item) => item.classList.remove("active"));
    li.classList.add("active");
    selected.innerText = li.innerText.trim();
    sortInput.value = li.dataset.value;
    sortMenu.style.display = "none";
    li.closest("form").submit(); // auto-submit
  });
});

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!sortToggle.contains(e.target) && !sortMenu.contains(e.target)) {
    sortMenu.style.display = "none";
  }
});

// Map

let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");
  for (info of taxInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});
