import { createGlide } from "@theme/glide";
import { sliderRegistry } from "@theme/slider-registry";

function initSliders() {
  document.querySelectorAll("[data-slider]").forEach((el) => {
    const name = el.dataset.slider;
    if (name === "popup") return;
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
      const isRTL = document.documentElement.dir === "rtl";

      createGlide(el, {
        ...config,
        direction: isRTL ? "rtl" : "ltr",
      });
    }
  });
}

function setupMobileOnlySlider(el, config, breakpoint) {
  const isRTL = document.documentElement.dir === "rtl";
  const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
  let glide = null;

  function sync(e) {
    if (e.matches && !glide) {
      glide = createGlide(el, {
        ...config,
        direction: isRTL ? "rtl" : "ltr",
      });
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
