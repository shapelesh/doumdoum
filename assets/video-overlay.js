class DoumdoumVideoOverlay extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.isMuted = true;
    this.currentProductHandle = "";
  }

  connectedCallback() {
    if (this.dataset.ddvInit === "true") return;
    this.dataset.ddvInit = "true";

    this.classList.add("ddv-overlay-root");
    this.render();
    this.setupEventListeners();

    document.addEventListener("doumdoum:open-video", (e) => {
      this.open(e.detail);
    });
  }

  render() {
    this.innerHTML = `
      <div class="ddv-overlay" id="ddv-overlay">
        <div class="ddv-overlay-content">
          <div class="ddv-thumbnails-col" id="ddv-thumbs-container"></div>

          <div class="ddv-player-col">
            <button class="ddv-vid-button ddv-close-overlay" id="ddv-close-overlay" aria-label="Fermer">${this.getCloseSvg()}</button>
            <button class="ddv-vid-button ddv-mute-vid" id="ddv-mute-vid" aria-label="Muet">${this.getMuteSvg()}</button>
            <div id="ddv-video-dest"></div>
          </div>

          <div class="ddv-cart-col" id="ddv-product-aside">
            <div id="ddv-product-loading">Chargement du produit...</div>
          </div>
        </div>
      </div>
    `;
  }

  getCloseSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
      <g filter="url(#ddv-filter0_d_close)">
      <path d="M6.5553 28C6.34303 28 6.13076 27.9399 5.9185 27.8197C5.74161 27.6995 5.63548 27.5343 5.6001 27.3239C5.6001 27.0836 5.74161 26.8131 6.02463 26.5127L16.0012 15.831V17.0028L6.66143 7.08732C6.37841 6.78685 6.2369 6.53145 6.2369 6.32112C6.27227 6.08075 6.37841 5.90047 6.5553 5.78028C6.76756 5.66009 6.97983 5.6 7.1921 5.6C7.47512 5.6 7.72276 5.66009 7.93503 5.78028C8.14729 5.87042 8.34187 6.02066 8.51876 6.23098L17.2217 15.5155H16.4257L25.1286 6.23098C25.3055 6.02066 25.5001 5.87042 25.7123 5.78028C25.9246 5.66009 26.1722 5.6 26.4553 5.6C26.6675 5.6 26.8621 5.66009 27.039 5.78028C27.2513 5.90047 27.3574 6.08075 27.3574 6.32112C27.3928 6.53145 27.269 6.78685 26.9859 7.08732L17.7523 16.8676V16.0113L27.6227 26.5127C27.9058 26.8131 28.0296 27.0836 27.9942 27.3239C27.9942 27.5343 27.8881 27.6995 27.6758 27.8197C27.4989 27.9399 27.3043 28 27.0921 28C26.809 28 26.5437 27.9399 26.2961 27.8197C26.0838 27.7296 25.8715 27.5793 25.6593 27.369L16.3726 17.4535H17.2217L7.93503 27.369C7.75814 27.5793 7.54587 27.7296 7.29823 27.8197C7.08596 27.9399 6.83832 28 6.5553 28Z" fill="white"/>
      </g>
      <defs>
      <filter id="ddv-filter0_d_close" x="9.77516e-05" y="-1.43051e-06" width="33.5999" height="33.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="2.8"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="ddv-effect1_dropShadow_close"/>
      <feBlend mode="normal" in="SourceGraphic" in2="ddv-effect1_dropShadow_close" result="shape"/>
      </filter>
      </defs>
    </svg>`;
  }

  getMuteSvg() {
    return this.isMuted
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="36" viewBox="0 0 24 24" fill="none"><path d="M15 8.37003V7.41003C15 4.43003 12.93 3.29003 10.41 4.87003L7.49 6.70003C7.17 6.89003 6.8 7.00003 6.43 7.00003H5C3 7.00003 2 8.00003 2 10V14C2 16 3 17 5 17H7" stroke="#353535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.41 19.13C12.93 20.71 15 19.56 15 16.59V12.95" stroke="#353535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.81 9.41992C19.71 11.5699 19.44 14.0799 18 15.9999" stroke="#353535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.15 7.80005C22.62 11.29 22.18 15.37 19.83 18.5" stroke="#353535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 2L2 22" stroke="#353535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="36" viewBox="0 0 42 36" fill="none"> <g filter="url(#ddv-filter0_d_mute)"> <path d="M6.6499 14.8293V20.4293C6.6499 23.2293 8.0499 24.6293 10.8499 24.6293H12.8519C13.3699 24.6293 13.8879 24.7833 14.3359 25.0493L18.4239 27.6113C21.9519 29.8233 24.8499 28.2133 24.8499 24.0553V11.2033C24.8499 7.03134 21.9519 5.43534 18.4239 7.64734L14.3359 10.2093C13.8879 10.4753 13.3699 10.6293 12.8519 10.6293H10.8499C8.0499 10.6293 6.6499 12.0293 6.6499 14.8293Z" stroke="white" stroke-width="2.1"/> <path d="M29.0503 12.0294C31.5423 15.3474 31.5423 19.9114 29.0503 23.2294" stroke="white" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/> <path d="M31.6123 8.52936C35.6583 13.9194 35.6583 21.3394 31.6123 26.7294" stroke="white" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/> </g> <defs> <filter id="ddv-filter0_d_mute" x="-1.7499" y="-4.77065" width="44.8001" height="44.8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/> <feOffset/> <feGaussianBlur stdDeviation="2.8"/> <feComposite in2="hardAlpha" operator="out"/> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="ddv-effect1_dropShadow_mute"/> <feBlend mode="normal" in="SourceGraphic" in2="ddv-effect1_dropShadow_mute" result="shape"/> </filter> </defs> </svg>`;
  }

  setupEventListeners() {
    this.querySelector("#ddv-close-overlay").addEventListener("click", (e) => {
      e.stopPropagation();
      this.close();
    });

    this.querySelector("#ddv-mute-vid").addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleMute();
    });

    this.querySelector("#ddv-overlay").addEventListener("click", (e) => {
      if (e.target.id === "ddv-overlay") this.close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) this.close();
    });
  }

  open(detail) {
    this.isOpen = true;

    this.querySelector("#ddv-overlay").classList.add("active");
    document.body.style.overflow = "hidden";
    document.body.classList.add("video-component-active");

    this.renderThumbs(detail.videoUrl);
    this.loadVideo(detail.videoUrl);
    this.loadProduct(detail.productHandle);

    if (window.innerWidth > 990) {
      this.toggleCustomCart(true);
    }
  }

  toggleCustomCart(open = true) {
    const cartDrawer = document.querySelector("custom-cart-drawer");
    if (!cartDrawer) return;

    if (open) {
      cartDrawer.open(true);
    } else {
      cartDrawer.close();
    }
  }

  renderThumbs(activeUrl) {
    const container = this.querySelector("#ddv-thumbs-container");
    const allTriggers = Array.from(
      document.querySelectorAll("doumdoum-video-player"),
    );

    container.innerHTML = allTriggers
      .map((trigger) => {
        const data = trigger.getVideoData();
        const isActive = data.videoUrl === activeUrl;
        return `
          <img src="${data.coverImage}"
               class="ddv-thumb ${isActive ? "active" : ""}"
               data-url="${data.videoUrl}"
               data-product-handle="${data.productHandle}"
               alt="">
        `;
      })
      .join("");

    container.querySelectorAll(".ddv-thumb").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        container
          .querySelectorAll(".ddv-thumb")
          .forEach((img) => img.classList.remove("active"));
        thumb.classList.add("active");
        this.loadVideo(thumb.dataset.url);
        this.loadProduct(thumb.dataset.productHandle);
      });
    });
  }

  loadVideo(url) {
    const dest = this.querySelector("#ddv-video-dest");
    dest.innerHTML = `<video src="${url}" playsinline autoplay loop style="width:100%; height:100%;"></video>`;

    const video = dest.querySelector("video");
    video.muted = this.isMuted;
    video.play().catch(() => {});
  }

  async loadProduct(productHandle) {
    this.currentProductHandle = productHandle || "";
    const aside = this.querySelector("#ddv-product-aside");

    if (!productHandle) {
      aside.innerHTML = "";
      return;
    }

    aside.innerHTML = `<div id="ddv-product-loading">Chargement du produit...</div>`;

    try {
      const res = await fetch(`/products/${productHandle}?view=ddv-card`);
      if (!res.ok) throw new Error(`Product fetch failed: ${res.status}`);
      const html = await res.text();

      // Guard against a stale response landing after the user switched videos.
      if (this.currentProductHandle !== productHandle) return;

      aside.innerHTML = html;
    } catch (err) {
      if (this.currentProductHandle !== productHandle) return;
      aside.innerHTML = `<div id="ddv-product-error">Produit indisponible.</div>`;
      console.error("[doumdoum-video-overlay] product load failed:", err);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    const video = this.querySelector("#ddv-video-dest video");
    if (video) video.muted = this.isMuted;

    this.querySelector("#ddv-mute-vid").innerHTML = this.getMuteSvg();
  }

  close() {
    this.isOpen = false;
    this.querySelector("#ddv-overlay").classList.remove("active");
    this.querySelector("#ddv-video-dest").innerHTML = "";
    this.querySelector("#ddv-product-aside").innerHTML = "";
    document.body.style.overflow = "";
    document.body.classList.remove("video-component-active");

    this.toggleCustomCart(false);
  }
}

if (!customElements.get("doumdoum-video-overlay")) {
  customElements.define("doumdoum-video-overlay", DoumdoumVideoOverlay);
}

(function ensureSingleOverlay() {
  function mount() {
    if (document.querySelector("doumdoum-video-overlay")) return;
    const overlay = document.createElement("doumdoum-video-overlay");
    document.body.appendChild(overlay);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
