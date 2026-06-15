import { createGlide } from "@theme/glide";
import { sliderRegistry } from "@theme/slider-registry";

function initSliders() {
  const sliders = document.querySelectorAll("[data-slider]");

  sliders.forEach((el) => {
    const name = el.dataset.slider;
    const speed = el.dataset.speed;
    const config = sliderRegistry[name];

    if (speed) {
      config.autoplay = parseInt(speed);
    }

    if (!config) {
      console.warn(`Unknown slider config: ${name}`);
      return;
    }

    createGlide(el, config);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSliders);
} else {
  initSliders();
}
