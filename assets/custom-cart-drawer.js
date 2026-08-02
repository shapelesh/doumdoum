// import { Component } from "@theme/component";
// import { CartAddEvent, CartUpdateEvent } from "@theme/events";

// export default class CustomCartDrawer extends Component {
//   constructor() {
//     super();
//     this._handleCartUpdate = this._handleCartUpdate.bind(this);
//   }

//   connectedCallback() {
//     super.connectedCallback();

//     // header opener
//     document.addEventListener("click", (e) => {
//       if (e.target.closest('[data-action="open-custom-drawer"]')) {
//         e.preventDefault();
//         this.open();
//       }
//     });

//     document.addEventListener(CartAddEvent.eventName, this._handleCartUpdate);
//     document.addEventListener(
//       CartUpdateEvent.eventName,
//       this._handleCartUpdate,
//     );

//     // colse
//     this.querySelectorAll("[data-close-drawer]").forEach((btn) =>
//       btn.addEventListener("click", () => this.close()),
//     );

//     document
//       .querySelector(".cart-drawer-overlay")
//       ?.addEventListener("click", () => this.close());

//     this.addEventListener("click", (e) => {
//       const btnQty = e.target.closest(".quantity-btn, .item-remove");
//       const btnAddRec = e.target.closest(".btn-add-rec");

//       if (btnQty) {
//         e.preventDefault();
//         this._onQuantityChange(btnQty);
//       } else if (btnAddRec) {
//         e.preventDefault();
//         this._onAddRecommendation(btnAddRec);
//       }
//     });
//   }

//   // open fucntion
//   open(isFromVideo = false) {
//     if (isFromVideo) {
//       this.classList.add("is-from-video");
//     } else {
//       this.classList.remove("is-from-video");
//     }

//     this.classList.add("is-open");

//     if (!isFromVideo) {
//       document.querySelector(".cart-drawer-overlay")?.classList.add("is-open");
//     }

//     document.body.style.overflow = "hidden";
//     this.updateRecommendations();
//   }
//   // close function
//   close() {
//     this.classList.remove("is-open");
//     this.classList.remove("is-from-video");
//     document.querySelector(".cart-drawer-overlay")?.classList.remove("is-open");
//     document.body.style.overflow = "";
//   }

//   // quantity handler
//   async _onQuantityChange(btn) {
//     const key = btn.dataset.key;
//     const currentQty = parseInt(btn.dataset.qty || "0");
//     const action = btn.dataset.action;
//     let newQty = action === "plus" ? currentQty + 1 : currentQty - 1;
//     if (action === "remove") newQty = 0;
//     if (newQty < 0) newQty = 0;

//     await this._updateCart({ id: key, quantity: newQty }, "/cart/change.js");
//   }

//   async _onAddRecommendation(btn) {
//     const variantId = btn.dataset.variantId;
//     btn.disabled = true;
//     btn.innerText = "...";

//     await this._updateCart(
//       { items: [{ id: variantId, quantity: 1 }] },
//       "/cart/add.js",
//     );
//   }

//   //cart update with the current data and the endpoint to request new data making a loading animation between
//   async _updateCart(bodyData, endpoint) {
//     // loading display in change
//     this.classList.add("is-loading");
//     const sectionId = "custom-cart-drawer";

//     // section rendring API CONFIG
//     const body = {
//       ...bodyData,
//       sections: sectionId,
//       sections_url: window.Shopify
//         ? window.Shopify.routes.root + "cart"
//         : "/cart",
//     };

//     try {
//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(body),
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur serveur: ${response.status}`);
//       }
//       const data = await response.json();

//       await this._refreshCart();

//       // Custom event in change data
//       document.dispatchEvent(
//         new CustomEvent(CartUpdateEvent.eventName, { detail: { cart: data } }),
//       );
//     } catch (e) {
//       console.error("Erreur update cart:", e);
//     } finally {
//       this.classList.remove("is-loading");
//     }
//   }

//   // refresh cart html ---> section rendring API
//   async _refreshCart() {
//     const sections = [
//     "custom-cart-drawer",
//     "header"
// ];
//     try {
//       // ajax request to shopify rendring section Api
//       const res = await fetch(`/cart?sections=${sections.join(",")}&t=${Date.now()}`);

//       // response
//       const data = await res.json();
//       if (data["custom-cart-drawer"]) {
//         // update method to the DOM ----> update HTML ine the page
//         this._updateDOM(data["custom-cart-drawer"]);
//       }
//       // Header
//     if (data["header"]) {
//       const parser = new DOMParser();
//       const doc = parser.parseFromString(data["header"], "text/html");

//       const newHeader = doc.querySelector("header");
//       const oldHeader = document.querySelector("header");

//       if (newHeader && oldHeader) {
//         oldHeader.innerHTML = newHeader.innerHTML;
//       }
//     }
//     } catch (e) {
//       console.error("Erreur refresh cart:", e);
//     }
//   }

//   // update DOM target element
//   _updateDOM(htmlString) {
//     // parse elements to extract and display without script
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(htmlString, "text/html");
//     // progress bar ---> prevent animation from blocking
//     const newShippingBar = doc.querySelector(".free-shipping-bar");
//     const oldShippingBar = this.querySelector(".free-shipping-bar");

//     if (newShippingBar && oldShippingBar) {
//       // text update
//       const newMessage = newShippingBar.querySelector(".shipping-message");
//       const oldMessage = oldShippingBar.querySelector(".shipping-message");
//       if (newMessage && oldMessage) oldMessage.innerHTML = newMessage.innerHTML;
//       // bar update
//       const newFill = newShippingBar.querySelector(".progress-fill");
//       const oldFill = oldShippingBar.querySelector(".progress-fill");
//       if (newFill && oldFill) {
//         const newWidth = newFill.style.width;
//         oldFill.style.width = newWidth;
//       }
//     }
//     // elements to update
//     const selectors = [
//       '[data-ref="items-container"]',
//       "[data-cart-buy-now]",
//       ".cart-count",
//     ];
//     // loop to update
//     selectors.forEach((sel) => {
//       const newEl = doc.querySelector(sel);
//       const oldEl = this.querySelector(sel);
//       if (newEl && oldEl) {
//         if (sel === "[data-cart-buy-now]") {
//           // buy button changing class special case
//           oldEl.innerHTML = newEl.innerHTML;
//           oldEl.className = newEl.className;
//         } else {
//           oldEl.innerHTML = newEl.innerHTML;
//         }
//       }
//     });
//     // count synchronisation
//     const newCountEl = doc.querySelector(".cart-count")?.textContent;
//     if (newCountEl !== undefined) {
//       document.querySelectorAll(".cart-count").forEach((el) => {
//         el.textContent = newCountEl;
//       });
//     }
//     // recommendation update (it changes in matter of product id)
//     this.updateRecommendations();
//   }

//   _handleCartUpdate(e) {
//     if (!this.classList.contains("is-loading")) {
//       this._refreshCart();
//     }
//     if (e.type === CartAddEvent.eventName) this.open();
//   }
//   // update recommendation in matter of product
//   // work with first product
//   // fallback for empty cart
//   updateRecommendations() {
//     const recContainer = this.querySelector("#cart-recommendations");
//     if (!recContainer) return;

//     const firstItem = this.querySelector(".cart-item");
//     // if product in cart use this product.id else use fallaback product (can choose the fall back product on editor)
//     const productId = firstItem
//       ? firstItem.dataset.productId
//       : recContainer.dataset.fallbackId;

//     if (!productId || productId === "") {
//       recContainer.innerHTML = "";
//       return;
//     }
//     // rommended product url shopify API
//     const sectionId = "custom-cart-drawer";
//     const routes = window.Shopify?.routes?.root || "/";
//     const url = `${routes}recommendations/products?section_id=${sectionId}&product_id=${productId}&limit=4`;
//     // request
//     fetch(url)
//       .then((response) => response.text())
//       .then((html) => {
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(html, "text/html");
//         const recommendationsHTML = doc.querySelector(".recommendations-grid");
//         // inection product and title
//         if (recommendationsHTML && recContainer) {
//           const title = firstItem
//             ? "Ajoutez des produits complémentaires"
//             : "Nos produits populaires";
//           recContainer.innerHTML = `<h3>${title}</h3>${recommendationsHTML.outerHTML}`;
//         }
//       })
//       .catch((e) => console.error("Erreur recommandations:", e));
//   }
// }

// if (!customElements.get("custom-cart-drawer")) {
//   customElements.define("custom-cart-drawer", CustomCartDrawer);
// }
import { Component } from "@theme/component";
import { CartAddEvent, CartUpdateEvent } from "@theme/events";

export default class CustomCartDrawer extends Component {
  constructor() {
    super();
    this._handleCartUpdate = this._handleCartUpdate.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    // header opener
    document.addEventListener("click", (e) => {
      if (e.target.closest('[data-action="open-custom-drawer"]')) {
        e.preventDefault();
        this.open();
      }
    });

    document.addEventListener(CartAddEvent.eventName, this._handleCartUpdate);
    document.addEventListener(
      CartUpdateEvent.eventName,
      this._handleCartUpdate,
    );

    // close
    this.querySelectorAll("[data-close-drawer]").forEach((btn) =>
      btn.addEventListener("click", () => this.close()),
    );

    document
      .querySelector(".cart-drawer-overlay")
      ?.addEventListener("click", () => this.close());

    this.addEventListener("click", (e) => {
      const btnQty = e.target.closest(".quantity-btn, .item-remove");
      const btnAddRec = e.target.closest(".btn-add-rec");

      if (btnQty) {
        e.preventDefault();
        this._onQuantityChange(btnQty);
      } else if (btnAddRec) {
        e.preventDefault();
        this._onAddRecommendation(btnAddRec);
      }
    });
  }

  // open function
  open(isFromVideo = false) {
    if (isFromVideo) {
      this.classList.add("is-from-video");
    } else {
      this.classList.remove("is-from-video");
    }

    this.classList.add("is-open");

    if (!isFromVideo) {
      document.querySelector(".cart-drawer-overlay")?.classList.add("is-open");
    }

    document.body.style.overflow = "hidden";
    this.updateRecommendations();
  }

  // close function
  close() {
    this.classList.remove("is-open");
    this.classList.remove("is-from-video");
    document.querySelector(".cart-drawer-overlay")?.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  // quantity handler
  async _onQuantityChange(btn) {
    const key = btn.dataset.key;
    const currentQty = parseInt(btn.dataset.qty || "0");
    const action = btn.dataset.action;
    let newQty = action === "plus" ? currentQty + 1 : currentQty - 1;
    if (action === "remove") newQty = 0;
    if (newQty < 0) newQty = 0;

    await this._updateCart({ id: key, quantity: newQty }, "/cart/change.js");
  }

  async _onAddRecommendation(btn) {
    const variantId = btn.dataset.variantId;
    btn.disabled = true;
    btn.innerText = "...";

    await this._updateCart(
      { items: [{ id: variantId, quantity: 1 }] },
      "/cart/add.js",
    );
  }

  // Récupère l'ID exact de la section header utilisée par Shopify
  _getHeaderSectionId() {
    const headerSection = document.querySelector(
      '.shopify-section-header, [id^="shopify-section-header"], [id*="__header"]',
    );
    if (headerSection) {
      return headerSection.id.replace("shopify-section-", "");
    }
    return "header";
  }

  // Met à jour le panier, rafraîchit le DOM et distribue les événements requis
  async _updateCart(bodyData, endpoint) {
    this.classList.add("is-loading");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      // Exécute la mise à jour globale
      const fullCart = await this._refreshCart();

      if (fullCart) {
        document.dispatchEvent(
          new CartUpdateEvent(fullCart, "custom-cart-drawer", {
            itemCount: fullCart.item_count,
            source: "custom-cart-drawer",
          }),
        );

        if (endpoint.includes("/cart/add.js")) {
          document.dispatchEvent(
            new CartAddEvent(fullCart, "custom-cart-drawer", {
              itemCount: 1,
              source: "custom-cart-drawer",
            }),
          );
        }
      }
    } catch (e) {
      console.error("Erreur update cart:", e);
    } finally {
      this.classList.remove("is-loading");
    }
  }

  // Recharge le tiroir ainsi que la bulle du header sans casser les événements JS du menu
  async _refreshCart() {
    const rootUrl = window.Shopify?.routes?.root || "/";
    const headerSectionId = this._getHeaderSectionId();
    const sections = ["custom-cart-drawer", headerSectionId];

    try {
      const [cartRes, sectionRes] = await Promise.all([
        fetch(`${rootUrl}cart.js`),
        fetch(`${rootUrl}cart?sections=${sections.join(",")}&t=${Date.now()}`),
      ]);

      const fullCart = await cartRes.json();
      const sectionData = await sectionRes.json();

      // 1. Mise à jour du tiroir de panier
      if (sectionData["custom-cart-drawer"]) {
        this._updateDOM(sectionData["custom-cart-drawer"]);
      }

      // 2. Extraction et injection ciblée de la bulle du header
      if (sectionData[headerSectionId]) {
        this._updateHeaderBubbleDOM(sectionData[headerSectionId]);
      }

      // 3. Mise à jour préventive des autres compteurs
      this._updateGlobalCartCount(fullCart.item_count);

      return fullCart;
    } catch (e) {
      console.error("Erreur refresh cart:", e);
      return null;
    }
  }

  // Analyse le HTML généré du header et gère l'injection ou suppression de la bulle
  _updateHeaderBubbleDOM(headerHtml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(headerHtml, "text/html");

    // Selecteurs potentiels de la bulle de notification
    const bubbleSelectors = [
      ".cart-count-bubble",
      ".header__cart-count",
      ".cart-count",
      "[data-cart-count]",
    ];

    let newBubble = null;
    let matchingSelector = null;

    // Recherche de la bulle dans le nouveau HTML rendu par Shopify
    for (const selector of bubbleSelectors) {
      newBubble = doc.querySelector(selector);
      if (newBubble) {
        matchingSelector = selector;
        break;
      }
    }

    // Recherche du conteneur parent (le lien ou bouton du panier dans le header)
    const cartLinkSelectors = [
      'a[href="/cart"]',
      ".header__icon--cart",
      '[data-action="open-custom-drawer"]',
      ".header__cart-link",
    ];

    let oldCartLink = null;
    for (const sel of cartLinkSelectors) {
      oldCartLink = document.querySelector(sel);
      if (oldCartLink) break;
    }

    if (oldCartLink) {
      const oldBubble = matchingSelector
        ? document.querySelector(matchingSelector)
        : oldCartLink.querySelector(
            ".cart-count-bubble, .header__cart-count, .cart-count",
          );

      if (newBubble) {
        if (oldBubble) {
          // Si la bulle existait déjà, on met à jour son contenu et ses classes
          oldBubble.innerHTML = newBubble.innerHTML;
          oldBubble.className = newBubble.className;
        } else {
          // Si la bulle n'existait pas (passage de 0 à 1 article), on l'insère dans le lien
          oldCartLink.appendChild(newBubble);
        }
      } else {
        // Si le nouveau rendu n'a pas de bulle (panier vidé), on retire l'ancienne bulle
        if (oldBubble) {
          oldBubble.remove();
        }
      }
    }
  }

  // Met à jour les autres valeurs de compteur statiques présentes sur la page
  _updateGlobalCartCount(count) {
    if (typeof count !== "number" || isNaN(count)) return;

    const selectors = [
      ".cart-count",
      ".cart-count-bubble",
      ".header__cart-count",
      "[data-cart-count]",
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        const target = el.querySelector("span") || el;
        target.textContent = count;

        if (count === 0) {
          el.classList.add("is-empty");
        } else {
          el.classList.remove("is-empty");
        }
      });
    });
  }

  // Met à jour le DOM interne du tiroir
  _updateDOM(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // progress bar
    const newShippingBar = doc.querySelector(".free-shipping-bar");
    const oldShippingBar = this.querySelector(".free-shipping-bar");

    if (newShippingBar && oldShippingBar) {
      const newMessage = newShippingBar.querySelector(".shipping-message");
      const oldMessage = oldShippingBar.querySelector(".shipping-message");
      if (newMessage && oldMessage) oldMessage.innerHTML = newMessage.innerHTML;

      const newFill = newShippingBar.querySelector(".progress-fill");
      const oldFill = oldShippingBar.querySelector(".progress-fill");
      if (newFill && oldFill) {
        oldFill.style.width = newFill.style.width;
      }
    }

    // elements to update
    const selectors = [
      '[data-ref="items-container"]',
      "[data-cart-buy-now]",
      ".cart-count",
    ];

    selectors.forEach((sel) => {
      const newEl = doc.querySelector(sel);
      const oldEl = this.querySelector(sel);
      if (newEl && oldEl) {
        if (sel === "[data-cart-buy-now]") {
          oldEl.innerHTML = newEl.innerHTML;
          oldEl.className = newEl.className;
        } else {
          oldEl.innerHTML = newEl.innerHTML;
        }
      }
    });

    this.updateRecommendations();
  }

  _handleCartUpdate(e) {
    if (!this.classList.contains("is-loading")) {
      this._refreshCart();
    }
    if (e.type === CartAddEvent.eventName) this.open();
  }

  updateRecommendations() {
    const recContainer = this.querySelector("#cart-recommendations");
    if (!recContainer) return;

    const firstItem = this.querySelector(".cart-item");

    if (!firstItem) {
      return;
    }

    const productId = firstItem.dataset.productId;

    const sectionId = "custom-cart-drawer";
    const routes = window.Shopify?.routes?.root || "/";
    const url = `${routes}recommendations/products?section_id=${sectionId}&product_id=${productId}&limit=4`;

    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const recommendationsHTML = doc.querySelector(".recommendations-grid");
        if (recommendationsHTML && recContainer) {
          const title = firstItem
            ? "Ajoutez des produits complémentaires"
            : "Nos produits populaires";
          recContainer.innerHTML = `<h3>${title}</h3>${recommendationsHTML.outerHTML}`;
        }
      })
      .catch((e) => console.error("Erreur recommandations:", e));
  }
}

if (!customElements.get("custom-cart-drawer")) {
  customElements.define("custom-cart-drawer", CustomCartDrawer);
}
