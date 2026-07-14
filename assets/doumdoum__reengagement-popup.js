import { createGlide } from "@theme/glide";
import { sliderRegistry } from "@theme/slider-registry";

/**
 * @type {null}
 */
let popupGlide = null;

(function () {
  "use strict";

  const POPUP_SELECTOR = ".doumdoum__reengagement-popup";
  const SESSION_KEY = "doumdoum_reengagement_popup_shown";

  document.addEventListener("DOMContentLoaded", initializeReengagementPopup);

  function initializeReengagementPopup() {
    const popupElement = document.querySelector(POPUP_SELECTOR);
    if (!popupElement) return;

    // if (sessionStorage.getItem(SESSION_KEY) === "true") return;
    // @ts-ignore
    const targetHandlesRaw = popupElement.dataset.targetHandles || "";
    const targetHandles = targetHandlesRaw
      .split(",")
      // @ts-ignore
      .map((handle) => handle.trim())
      .filter(Boolean);

    const currentPageHandle = window.location.pathname
      .split("/")
      .filter(Boolean)
      .pop();

    if (!targetHandles.includes(currentPageHandle)) return;

    // @ts-ignore
    const triggerDelaySeconds =
      // @ts-ignore
      parseInt(popupElement.dataset.triggerDelay, 10) || 30;

    setTimeout(() => {
      showPopupA(popupElement);
      sessionStorage.setItem(SESSION_KEY, "true");
    }, 1 * 1000);

    bindPopupEvents(popupElement);
  }

  // @ts-ignore
  function showPopupA(popupElement) {
    popupElement.inert = false;
    popupElement.setAttribute("aria-hidden", "false");
    popupElement.classList.add("doumdoum__reengagement-popup-active");
    popupElement.classList.add("doumdoum__reengagement-popup-state-a");
    document.body.classList.add("disable_scroll");
  }

  // @ts-ignore
  function showPopupB(popupElement) {
    popupElement.classList.remove("doumdoum__reengagement-popup-state-a");
    popupElement.classList.add("doumdoum__reengagement-popup-state-b");
    if (!popupGlide) {
      const sliderEl = popupElement.querySelector("[data-slider='popup']");
      if (sliderEl) {
        popupGlide = createGlide(sliderEl, sliderRegistry.popup);
      }
    }
  }

  // @ts-ignore
  function closePopup(popupElement) {
    popupElement.setAttribute("aria-hidden", "true");
    popupElement.inert = true;
    popupElement.classList.remove("doumdoum__reengagement-popup-active");
    popupElement.classList.remove("doumdoum__reengagement-popup-state-a");
    popupElement.classList.remove("doumdoum__reengagement-popup-state-b");

    if (popupGlide) {
      // @ts-ignore
      popupGlide.destroy();
      popupGlide = null;
    }
    document.body.classList.remove("disable_scroll");
  }

  // @ts-ignore
  function bindPopupEvents(popupElement) {
    const popupAOverlay = popupElement.querySelector(
      ".doumdoum__reengagement-popup-overlay-a",
    );
    const popupBOverlay = popupElement.querySelector(
      ".doumdoum__reengagement-popup-overlay-b",
    );

    const popupAContainer = popupElement.querySelector(
      ".doumdoum__reengagement-popup-container-a",
    );
    const popupBContainer = popupElement.querySelector(
      ".doumdoum__reengagement-popup-container-b",
    );

    const popupAExitButton = popupAContainer.querySelector(
      ".doumdoum__reengagement-popup-exit",
    );
    const popupABackButton = popupAContainer.querySelector(
      ".doumdoum__reengagement-popup-back-button",
    );
    const popupABuyButton = popupAContainer.querySelector(
      ".doumdoum__reengagement-popup-buy-button",
    );

    const popupBExitButton = popupBContainer.querySelector(
      ".doumdoum__reengagement-popup-exit",
    );

    // Prevent clicks inside the container from bubbling to the overlay
    // @ts-ignore
    popupAContainer.addEventListener("click", (event) =>
      event.stopPropagation(),
    );
    // @ts-ignore
    popupBContainer.addEventListener("click", (event) =>
      event.stopPropagation(),
    );

    // Click outside (on overlay) closes / transitions
    popupAOverlay.addEventListener("click", () => showPopupB(popupElement));
    popupBOverlay.addEventListener("click", () => closePopup(popupElement));

    popupAExitButton.addEventListener("click", () => showPopupB(popupElement));
    popupABackButton.addEventListener("click", () => showPopupB(popupElement));
    popupBExitButton.addEventListener("click", () => closePopup(popupElement));

    popupABuyButton.addEventListener("click", () =>
      handleBuyButtonClick(popupABuyButton),
    );
  }

  // @ts-ignore
  function handleBuyButtonClick(buyButtonElement) {
    const variantId = buyButtonElement.dataset.variantId;
    if (!variantId) return;

    buyButtonElement.disabled = true;

    fetch("/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: variantId, quantity: 1 }],
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Add to cart failed");
        window.location.href = "/checkout";
      })
      .catch((error) => {
        console.error("doumdoum reengagement popup: add to cart failed", error);
        buyButtonElement.disabled = false;
      });
  }
})();
