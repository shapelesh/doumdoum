/**
 * Custom Video Player Component
 * Usage: <doumdoum-video-player data-video-url="..." data-cover-image="..." data-product-handle="..."></doumdoum-video-player>
 */

class DoumdoumVideoPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleOpenClick);
  }

  get videoUrl() {
    return this.getAttribute("data-video-url");
  }
  get coverImage() {
    return this.getAttribute("data-cover-image");
  }
  get productHandle() {
    return this.getAttribute("data-product-handle");
  }
  get allVideos() {
    const carouselContainer = this.parentElement.parentNode;

    return Array.from(
      carouselContainer.querySelectorAll("doumdoum-video-player"),
    );
  }
  getSvgVolumeHigh() {
    return `
     <svg xmlns="http://www.w3.org/2000/svg" width="42" height="36" viewBox="0 0 42 36" fill="none">
<g filter="url(#filter0_d_3634_18577)">
<path d="M6.6499 14.8293V20.4293C6.6499 23.2293 8.0499 24.6293 10.8499 24.6293H12.8519C13.3699 24.6293 13.8879 24.7833 14.3359 25.0493L18.4239 27.6113C21.9519 29.8233 24.8499 28.2133 24.8499 24.0553V11.2033C24.8499 7.03134 21.9519 5.43534 18.4239 7.64734L14.3359 10.2093C13.8879 10.4753 13.3699 10.6293 12.8519 10.6293H10.8499C8.0499 10.6293 6.6499 12.0293 6.6499 14.8293Z" stroke="white" stroke-width="2.1"/>
<path d="M29.0503 12.0294C31.5423 15.3474 31.5423 19.9114 29.0503 23.2294" stroke="white" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M31.6123 8.52936C35.6583 13.9194 35.6583 21.3394 31.6123 26.7294" stroke="white" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<filter id="filter0_d_3634_18577" x="-1.7499" y="-4.77065" width="44.8001" height="44.8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="2.8"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3634_18577"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3634_18577" result="shape"/>
</filter>
</defs>
</svg>`;
  }
  getSvgVolumeMute() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="42" height="36" viewBox="0 0 42 36" fill="none" class="icon-sound">
        <g filter="url(#filter0_d_3634_18577)">
          <path d="M6.6499 14.8293V20.4293C6.6499 23.2293 8.0499 24.6293 10.8499 24.6293H12.8519C13.3699 24.6293 13.8879 24.7833 14.3359 25.0493L18.4239 27.6113C21.9519 29.8233 24.8499 28.2133 24.8499 24.0553V11.2033C24.8499 7.03134 21.9519 5.43534 18.4239 7.64734L14.3359 10.2093C13.8879 10.4753 13.3699 10.6293 12.8519 10.6293H10.8499C8.0499 10.6293 6.6499 12.0293 6.6499 14.8293Z" stroke="white" stroke-width="2.1"/>
          <!-- Ligne diagonale (Slash) -->
          <path d="M5 5 L35 30" stroke="white" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
          <filter id="filter0_d_3634_18577" x="-1.7499" y="-4.77065" width="44.8001" height="44.8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="2.8"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3634_18577"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3634_18577" result="shape"/>
          </filter>
        </defs>
      </svg>`;
  }

  render() {
    const coverSrc = this.coverImage;
    this.shadowRoot.innerHTML = `

    <style>
    :host {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 24px;
  overflow: hidden;
}
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
}
.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
:host(:hover) .cover-image {
  transform: scale(1.05);
}
.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 2;
}
.play-icon {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 16px solid #f570b7;
  margin-left: 4px;
}

/* Styles de l'Overlay (Modal) */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background: #00000099;
  z-index: 1000;
  display: none;
  justify-content: center;
  align-items: center;
  opacity: 0;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(20px);
  transition: opacity 0.3s ease;
}
.overlay.active {
  display: flex;
  opacity: 1;
}
.overlay-content {
  display: grid;
  grid-template-columns: 106.21px 1fr auto;
  gap: 20px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.thumbnails-col {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.thumb {
  width: 100%;
  height: 86.21px;
  aspect-ratio: 9/16;
  object-fit: cover;
  border-radius: 10.34px;
  cursor: pointer;
  opacity: 0.6;
  border: 2px solid #fafafa;
}
.thumb.active {
  opacity: 1;
}
.player-col {
  align-self: center;
  justify-self: center;
  max-width: 462px;
  height: 100dvh;
}
.player-col {
  position: relative;
  display: inline-block;
}

.player-col video,
.player-col iframe {
  width: 100%;
  height: 100%;
  max-height: 100dvh;
  object-fit: contain;
}
.vid-button {
    position: absolute;
    top: 16px;
    align-self: flex-start;
    border-radius: 50%;
    border: none;
    outline: none;
    padding: 1em;
    color: black;
    background: #ffffff00;
    transition: all ease-in-out 0.3s;
}
.close-overlay {
    left:16px;
}
.mute-vid {
    right:16px;
}
@media (max-width: 990px) {
  .overlay-content {
    grid-template-columns: 106.21px 1fr;
  }

}
@media (max-width: 768px) {
  .overlay-content {
    grid-template-columns: 1fr;
    height: 100vh;
    border-radius: 0;
  }

  .thumbnails-col,
  .cart-col {
    display: none;
  }
}

@media (max-width: 500px) {
  .overlay-content {
    width: 100%;
    grid-template-columns: 1fr;
    height: 100vh;
    border-radius: 0;
  }
  .player-col {
    position:relative;
    width: 100%;
    height: 100%;
    max-width: 100%;
  }
}

    </style>
      
  

      <div class="video-container">  
        <img src="${coverSrc}" alt="Video Cover" class="cover-image" loading="lazy">
        <div class="play-button"><div class="play-icon"></div></div>
      </div>

      <div class="overlay" id="overlay">
        <div class="overlay-content">
          <div class="thumbnails-col" id="thumbs-container"></div>     
          <div class="player-col" id="player-container">
          <button id="close-overlay" class="close-overlay vid-button" aria-label="Fermer">
       <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
       <g filter="url(#filter0_d_3634_18696)">
       <path d="M6.5553 28C6.34303 28 6.13076 27.9399 5.9185 27.8197C5.74161 27.6995 5.63548 27.5343 5.6001 27.3239C5.6001 27.0836 5.74161 26.8131 6.02463 26.5127L16.0012 15.831V17.0028L6.66143 7.08732C6.37841 6.78685 6.2369 6.53145 6.2369 6.32112C6.27227 6.08075 6.37841 5.90047 6.5553 5.78028C6.76756 5.66009 6.97983 5.6 7.1921 5.6C7.47512 5.6 7.72276 5.66009 7.93503 5.78028C8.14729 5.87042 8.34187 6.02066 8.51876 6.23098L17.2217 15.5155H16.4257L25.1286 6.23098C25.3055 6.02066 25.5001 5.87042 25.7123 5.78028C25.9246 5.66009 26.1722 5.6 26.4553 5.6C26.6675 5.6 26.8621 5.66009 27.039 5.78028C27.2513 5.90047 27.3574 6.08075 27.3574 6.32112C27.3928 6.53145 27.269 6.78685 26.9859 7.08732L17.7523 16.8676V16.0113L27.6227 26.5127C27.9058 26.8131 28.0296 27.0836 27.9942 27.3239C27.9942 27.5343 27.8881 27.6995 27.6758 27.8197C27.4989 27.9399 27.3043 28 27.0921 28C26.809 28 26.5437 27.9399 26.2961 27.8197C26.0838 27.7296 25.8715 27.5793 25.6593 27.369L16.3726 17.4535H17.2217L7.93503 27.369C7.75814 27.5793 7.54587 27.7296 7.29823 27.8197C7.08596 27.9399 6.83832 28 6.5553 28Z" fill="white"/> 
       </g>
       <defs>
       <filter id="filter0_d_3634_18696" x="9.77516e-05" y="-1.43051e-06" width="33.5999" height="33.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
       <feFlood flood-opacity="0" result="BackgroundImageFix"/>
       <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
       <feOffset/>
       <feGaussianBlur stdDeviation="2.8"/>
       <feComposite in2="hardAlpha" operator="out"/>
       <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
       <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3634_18696"/>
       <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3634_18696" result="shape"/>
       </filter>
       </defs>
       </svg>
     </button>
          <button id="mute-vid" class="mute-vid vid-button" aria-label="Mute">
        ${this.videoMuted ? this.getSvgVolumeMute() : this.getSvgVolumeHigh()}
     </button>
          </div>
        </div>
      </div>
    `;
  }
  updateMuteUI() {
    const btnMute = this.shadowRoot.getElementById("mute-vid");
    if (!btnMute) return;

    btnMute.innerHTML = this.videoMuted
      ? this.getSvgVolumeMute()
      : this.getSvgVolumeHigh();

    btnMute.setAttribute(
      "aria-label",
      this.videoMuted ? "Réactiver le son" : "Couper le son",
    );
  }
  setupEventListeners() {
    this.addEventListener("click", () => this.openOverlay());

    if (!this.shadowRoot) return;

    const closeBtn = this.shadowRoot.getElementById("close-overlay");
    const overlay = this.shadowRoot.getElementById("overlay");
    const btnMute = this.shadowRoot.getElementById("mute-vid");
    const video = this.shadowRoot.querySelector("#player-container video");

    if (btnMute && video) {
      btnMute.addEventListener("click", (e) => {
        e.stopPropagation();
        this.videoMuted = !this.videoMuted;

        const video = this.shadowRoot.querySelector("#player-container video");
        if (video) {
          video.muted = this.videoMuted;
        }

        this.updateMuteUI();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeOverlay();
      });
    }

    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) this.closeOverlay();
      });
    }

    this.handleEscKey = (e) => {
      if (e.key === "Escape" && this.isOpen) this.closeOverlay();
    };
    document.addEventListener("keydown", this.handleEscKey);

    if (this.videoUrl && video) {
      this.hoverVideo = document.createElement("video");
      this.hoverVideo.src = this.videoUrl;
      this.hoverVideo.muted = true;
      this.hoverVideo.playsInline = true;
      this.hoverVideo.style.cssText =
        "position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; opacity: 0; pointer-events: none;";

      video.appendChild(this.hoverVideo);

      const playHover = () => {
        this.hoverVideo.style.opacity = "1";

        this.hoverVideo.currentTime = 0;
        this.hoverVideo.play().catch(() => {});
      };

      const stopHover = () => {
        this.hoverVideo.pause();
        this.hoverVideo.style.opacity = "0";
      };

      this.addEventListener("mouseenter", playHover);
      this.addEventListener("mouseleave", stopHover);
    }
  }
  openOverlay() {
    if (this.isOpen) return;
    this.isOpen = true;

    if (this.hoverVideo) {
      this.hoverVideo.pause();
      this.hoverVideo.currentTime = 0;
      this.hoverVideo.style.opacity = "0";
    }

    const overlay = this.shadowRoot.getElementById("overlay");
    const playerContainer = this.shadowRoot.getElementById("player-container");
    const thumbsContainer = this.shadowRoot.getElementById("thumbs-container");

    thumbsContainer.innerHTML = this.allVideos
      .map((vid, index) => {
        const isActive = vid === this ? "active" : "";
        return `<img src="${vid.coverImage}" class="thumb ${isActive}" data-index="${index}">`;
      })
      .join("");

    this._previousScrollPosition = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${this._previousScrollPosition}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    thumbsContainer.querySelectorAll(".thumb").forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        this.switchVideo(index);
        thumbsContainer
          .querySelectorAll(".thumb")
          .forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });

    this.loadVideoContent(playerContainer);

    overlay.classList.add("active");
    document.body.style.overflow = "hidden";

    // this.triggerHorizonCart();
  }

  //   triggerHorizonCart() {
  //     const cartDrawer = document.querySelector("cart-drawer-component");

  //     document.body.classList.add("no-cart-backdrop");

  //     if (cartDrawer) {
  //       cartDrawer.open();
  //     } else {
  //       customElements.whenDefined("cart-drawer-component").then(() => {
  //         document.querySelector("cart-drawer-component").open();
  //       });
  //     }
  //   }

  closeOverlay() {
    const overlay = this.shadowRoot.getElementById("overlay");
    const playerContainer = this.shadowRoot.getElementById("player-container");

    playerContainer.innerHTML = "";

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.overflow = "";

    // 4. Restaurer la position
    if (this._previousScrollPosition) {
      window.scrollTo(0, this._previousScrollPosition);
      this._previousScrollPosition = null;
    }

    document.body.classList.remove("no-cart-backdrop");

    overlay.classList.remove("active");
    document.body.style.overflow = "";
    this.isOpen = false;

    const cartDrawer = document.querySelector("cart-drawer");
    if (cartDrawer) {
      if (typeof cartDrawer.close === "function") {
        cartDrawer.close();
      } else {
        cartDrawer.classList.remove("active");
      }
    }
  }

  switchVideo(index) {
    const targetVideo = this.allVideos[index];
    if (targetVideo) {
      const playerContainer =
        this.shadowRoot.getElementById("player-container");

      this.loadVideoContent(playerContainer, targetVideo);

      const videoElement = playerContainer.querySelector("video");

      if (videoElement) {
        videoElement.muted = true;
        videoElement.playsInline = true;
        videoElement.autoplay = true;

        const playPromise = videoElement.play();

        if (playPromise !== undefined) {
          playPromise
            .then((_) => {
              this.fadeInAudio(videoElement);
              console.log("Vidéo lancée :", targetVideo);
            })
            .catch((error) => {
              console.error("Erreur autoplay :", error);
            });
        }
      }
    }
  }

  fadeInAudio(video) {
    if (video.muted) {
      return;
    }

    video.muted = false;

    if (video.volume >= 1) return;

    let vol = video.volume;
    const interval = setInterval(() => {
      if (vol < 1) {
        vol += 0.1;
        video.volume = Math.min(vol, 1);
      } else {
        clearInterval(interval);
      }
    }, 100);
  }

  loadVideoContent(container, videoComponent = this) {
    const url = videoComponent.videoUrl;
    let newElement = null;

    newElement = document.createElement("video");
    newElement.src = url;
    newElement.setAttribute("controls", "");
    newElement.setAttribute("autoplay", "");
    newElement.setAttribute("playsinline", "");

    if (newElement) {
      container.appendChild(newElement);
    }
  }
}

if (!customElements.get("doumdoum-video-player")) {
  customElements.define("doumdoum-video-player", DoumdoumVideoPlayer);
}
