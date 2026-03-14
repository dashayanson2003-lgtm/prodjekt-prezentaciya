(() => {
  const SWIPE_THRESHOLD = 44;
  const slides = Array.from(document.querySelectorAll(".slide"));
  const progressBar = document.getElementById("progress-bar");
  const counter = document.getElementById("counter");
  const dotsRoot = document.getElementById("dots");
  const prevButton = document.getElementById("nav-prev");
  const nextButton = document.getElementById("nav-next");

  if (!slides.length || !progressBar || !counter || !dotsRoot || !prevButton || !nextButton) {
    return;
  }

  const totalSlides = slides.length;
  let currentSlide = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  const updateUi = index => {
    progressBar.style.width = `${((index + 1) / totalSlides) * 100}%`;
    counter.innerHTML = `<b>${index + 1}</b> / ${totalSlides}`;
    prevButton.classList.toggle("hidden", index === 0);
    nextButton.classList.toggle("hidden", index === totalSlides - 1);
    Array.from(dotsRoot.children).forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
    });
  };

  const goToSlide = index => {
    if (index < 0 || index >= totalSlides || index === currentSlide) {
      return;
    }

    slides[currentSlide].classList.remove("active");
    dotsRoot.children[currentSlide].classList.remove("active");

    currentSlide = index;

    slides[currentSlide].classList.add("active");
    dotsRoot.children[currentSlide].classList.add("active");
    updateUi(currentSlide);
  };

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = index === 0 ? "dot active" : "dot";
    dot.setAttribute("aria-label", `Слайд ${index + 1}`);
    dot.setAttribute("aria-current", index === 0 ? "true" : "false");
    dot.addEventListener("click", () => goToSlide(index));
    dotsRoot.appendChild(dot);
  });

  updateUi(0);

  prevButton.addEventListener("click", () => goToSlide(currentSlide - 1));
  nextButton.addEventListener("click", () => goToSlide(currentSlide + 1));

  document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") {
      goToSlide(currentSlide + 1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
      goToSlide(currentSlide - 1);
    }
    if (event.key === "Home") {
      goToSlide(0);
    }
    if (event.key === "End") {
      goToSlide(totalSlides - 1);
    }
  });

  document.addEventListener(
    "touchstart",
    event => {
      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    event => {
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        goToSlide(currentSlide + (deltaX < 0 ? 1 : -1));
      }
    },
    { passive: true }
  );
})();
