import { createGlide } from "@theme/glide";
import { sliderRegistry } from "@theme/slider-registry";

function initSliders() {
  document.querySelectorAll("[data-slider]").forEach((el) => {
    const name = el.dataset.slider;
    const config = sliderRegistry[name];

    if (!config) {
      console.warn(`Unknown slider config: ${name}`);
      return;
    }

    const speed = el.dataset.speed;
    if (speed) {
      config.autoplay = parseInt(speed);
    }

    const mobileBreakpoint = el.dataset.mobileSlider;
    if (mobileBreakpoint) {
      setupMobileOnlySlider(el, config, parseInt(mobileBreakpoint));
    } else {
      createGlide(el, config);
    }
  });
}

function setupMobileOnlySlider(el, config, breakpoint) {
  const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
  let glide = null;

  function sync(e) {
    if (e.matches && !glide) {
      glide = createGlide(el, config);
    } else if (!e.matches && glide) {
      glide.destroy();
      glide = null;
    }
  }

  sync(mql);
  mql.addEventListener("change", sync);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSliders);
} else {
  initSliders();
}
