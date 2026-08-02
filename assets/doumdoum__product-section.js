// getting liquid element from section.liquid
function getSectionId(element) {
  if (element) {
    const parentSection = element.closest("section");
    if (parentSection) {
      return parentSection.getAttribute("data-section-id");
    }
  }
  return window.doumdoumSettings ? window.doumdoumSettings.sectionId : "";
}

// Helper for money shopifyu format
function formatMoney(cents, format) {
  if (typeof cents === "string") cents = cents.replace(".", "");
  let value = "";
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = format || "${{amount}}";
  const match = formatString.match(placeholderRegex);
  if (!match) return (cents / 100).toFixed(2);

  switch (match[1]) {
    case "amount":
      value = (cents / 100)
        .toFixed(2)
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      break;
    case "amount_no_decimals":
      value = (cents / 100)
        .toFixed(0)
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      break;
    case "amount_with_comma_separator":
      value = (cents / 100)
        .toFixed(2)
        .replace(".", ",")
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = (cents / 100)
        .toFixed(0)
        .replace(".", ",")
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      break;
    default:
      value = (cents / 100).toFixed(2);
  }
  return formatString.replace(placeholderRegex, value);
}

// price update
function updateStickyPrice(qty) {
  const priceDisplay = document.getElementById("sticky-cart-price-display");
  if (!priceDisplay) return;

  const basePrice = parseInt(priceDisplay.getAttribute("data-base-price"), 10);
  if (isNaN(basePrice)) return;

  const totalPrice = basePrice * qty;
  const moneyFormat = window.doumdoumSettings
    ? window.doumdoumSettings.moneyFormat
    : "${{amount}}";

  priceDisplay.innerHTML = formatMoney(totalPrice, moneyFormat);
}

function handleActiveState(element, selector) {
  if (element && element.classList.contains("active")) {
    return;
  }
  document
    .querySelectorAll(selector)
    .forEach((el) => el.classList.remove("active"));

  if (element) {
    element.classList.add("active");
  }
}
// quantity selector
function selectQuantity(val, element = null, fromDropdown = false) {
  const sectionId = getSectionId(element);
  const hiddenInput = document.getElementById("Quantity-" + sectionId);
  const stickyInput = document.getElementById("StickyQuantity-" + sectionId);
  const stickyQtyDisplay = document.getElementById("sticky-qty-display");
  const triggerBtn = document.getElementById("custom-qty-trigger");
  const manualInput = document.getElementById("manual-qty-input");
  const btnText = document.getElementById("custom-qty-btn-text");

  if (hiddenInput) {
    hiddenInput.value = val;
  }
  if (stickyInput) {
    stickyInput.value = val;
  }
  if (stickyQtyDisplay) {
    stickyQtyDisplay.innerText = val + "x";
  }
  updateStickyPrice(val);

  if (fromDropdown) {
    handleActiveState(triggerBtn, ".qty-btn, .manual-input");
    if (btnText) {
      btnText.innerText = val + "x";
    }
    if (manualInput) {
      manualInput.style.display = "none";
    }
    if (triggerBtn) {
      triggerBtn.style.display = "flex";
    }
  } else if (element) {
    handleActiveState(element, ".qty-btn, .manual-input");

    if (btnText) {
      btnText.innerText = "4x";
    }
    if (manualInput) {
      manualInput.style.display = "none";
    }
    if (triggerBtn) {
      triggerBtn.style.display = "flex";
    }
  }

  closeDropdown();
}
// input quantity selector
function showManualInput(element) {
  const triggerBtn = document.getElementById("custom-qty-trigger");
  const manualInput = document.getElementById("manual-qty-input");
  const sectionId = getSectionId(element);
  const hiddenInput = document.getElementById("Quantity-" + sectionId);
  const stickyInput = document.getElementById("StickyQuantity-" + sectionId);
  const stickyQtyDisplay = document.getElementById("sticky-qty-display");

  if (triggerBtn) triggerBtn.style.display = "none";
  if (manualInput) {
    manualInput.style.display = "block";
    handleActiveState(manualInput, ".static-qty-btn, .manual-input");

    if (!manualInput.classList.contains("active")) {
      manualInput.value = 10;
      if (hiddenInput) hiddenInput.value = 10;
      if (stickyInput) stickyInput.value = 10;
      if (stickyQtyDisplay) {
        stickyQtyDisplay.innerText = "10x";
      }
      updateStickyPrice(10);
    }
    manualInput.focus();
  }

  closeDropdown();
}
// update quantity
function updateManualQuantity(val, element) {
  const sectionId = getSectionId(element);
  const parsedVal = parseInt(val, 10) || 0;
  const hiddenInput = document.getElementById("Quantity-" + sectionId);
  const stickyInput = document.getElementById("StickyQuantity-" + sectionId);
  const stickyQtyDisplay = document.getElementById("sticky-qty-display");

  if (hiddenInput) hiddenInput.value = parsedVal;
  if (stickyInput) {
    stickyInput.value = parsedVal;
  }
  if (stickyQtyDisplay) {
    stickyQtyDisplay.innerText = parsedVal + "x";
  }
  updateStickyPrice(parsedVal);
}

function toggleDropdown() {
  const dropdown = document.getElementById("qty-dropdown");
  const wrapper = document.getElementById("custom-select-wrapper");
  if (dropdown) dropdown.classList.toggle("show");
  if (wrapper) wrapper.classList.toggle("open");
}

function closeDropdown() {
  const dropdown = document.getElementById("qty-dropdown");
  const wrapper = document.getElementById("custom-select-wrapper");
  if (dropdown) dropdown.classList.remove("show");
  if (wrapper) wrapper.classList.remove("open");
}

window.addEventListener("click", function (event) {
  const wrapper = document.getElementById("custom-select-wrapper");
  if (wrapper && !wrapper.contains(event.target)) {
    closeDropdown();
  }
});

// tabs
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".tab-btn");
  const displayArea = document.getElementById("TabContentDisplay");

  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      buttons.forEach((b) => b.classList.remove("selected"));
      this.classList.add("selected");

      const content = this.getAttribute("data-content") || "";

      const formattedContent = content
        .replace(/&quot;/g, '"')
        .replace(/\n/g, "<br>");

      if (displayArea) {
        displayArea.innerHTML = formattedContent;
        displayArea.style.opacity = 0;
        setTimeout(() => {
          displayArea.style.transition = "opacity 0.3s ease";
          displayArea.style.opacity = 1;
        }, 50);
      }
    });
  });

  // add to cart and but now btns
  const stickyForm = document.querySelector(".sticky-form");
  if (stickyForm) {
    stickyForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const sectionId = getSectionId(stickyForm);
      const qtyInput = document.getElementById("StickyQuantity-" + sectionId);
      const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
      const variantIdInput = stickyForm.querySelector('input[name="id"]');
      const variantId = variantIdInput ? variantIdInput.value : "";
      const submitBtn = stickyForm.querySelector('button[type="submit"]');

      if (submitBtn) {
        submitBtn.disabled = true;
      }

      try {
        const response = await fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            items: [
              {
                id: variantId,
                quantity: qty,
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur d'ajout AJAX");
        }

        const drawer = document.querySelector("custom-cart-drawer");
        if (drawer) {
          if (typeof drawer._refreshCart === "function") {
            await drawer._refreshCart();
          }
          if (typeof drawer.open === "function") {
            drawer.open();
          }
        }
      } catch (error) {
        console.error("Erreur ajout panier:", error);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      }
    });
  }

  const buyNowBtn = document.getElementById("sticky-buy-now-btn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      const stickyForm = buyNowBtn.closest(".sticky-form");
      if (!stickyForm) return;

      const sectionId = getSectionId(buyNowBtn);
      const qtyInput = document.getElementById("StickyQuantity-" + sectionId);
      const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
      const variantIdInput = stickyForm.querySelector('input[name="id"]');
      const variantId = variantIdInput ? variantIdInput.value : "";

      buyNowBtn.disabled = true;

      try {
        await fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            items: [
              {
                id: variantId,
                quantity: qty,
              },
            ],
          }),
        });

        window.location.href = "/checkout";
      } catch (error) {
        console.error("Erreur passage au paiement:", error);
        buyNowBtn.disabled = false;
      }
    });
  }
});

// loading main image
// loading main image (Optimized with onload event to avoid flickering)
function updateMainImage(imgSrc, thumbElement) {
  const sectionId = getSectionId(thumbElement);
  const mainImg = document.getElementById("MainImage-" + sectionId);

  if (mainImg) {
    // Évite de relancer l'animation si l'utilisateur clique sur la même miniature
    if (mainImg.src === imgSrc) return;

    // Transition de sortie fluide (opacité réduite)
    mainImg.style.opacity = "0.2";

    // Pré-chargement de l'image en mémoire
    const tempImg = new Image();
    tempImg.src = imgSrc;

    tempImg.onload = function () {
      mainImg.src = imgSrc;
      mainImg.style.opacity = "1";
    };

    tempImg.onerror = function () {
      // En cas d'erreur de chargement, on force l'affichage pour ne pas bloquer l'interface
      mainImg.src = imgSrc;
      mainImg.style.opacity = "1";
    };
  }

  // Mise à jour de la classe active sur les miniatures
  const thumbnails = document.querySelectorAll(".thumb-item");
  thumbnails.forEach((thumb) => thumb.classList.remove("active"));
  if (thumbElement) {
    thumbElement.classList.add("active");
  }
}
