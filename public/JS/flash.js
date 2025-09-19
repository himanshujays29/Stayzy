
  document.querySelectorAll(".flash-msg").forEach((msg) => {
    const closeBtn = msg.querySelector(".flash-close");

    // Auto dismiss after 8s
    let timer = setTimeout(() => dismissMsg(msg), 10000);

    // Close on click
    closeBtn.addEventListener("click", () => {
      clearTimeout(timer);
      dismissMsg(msg);
    });
  });

  function dismissMsg(msg) {
    msg.style.animation = "slideOut 0.5s forwards";
    setTimeout(() => msg.remove(), 500);
  }
