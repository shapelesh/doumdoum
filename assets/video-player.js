/**
 * Custom Video Player Component - Horizon Shopify
 */
class DoumdoumVideoPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
    this.isMuted = true;
  }

  connectedCallback() {
    this.render();
    this.initHoverVideo();
    this.setupEventListeners();
  }

  render() {
    const coverSrc = this.getAttribute("data-cover-image");

    this.shadowRoot.innerHTML = `
    <style>
      :host {
        display: block;
        position: relative;
        width: 100%;
        aspect-ratio: 9/16;
        cursor: pointer;
        border-radius: 24px;
        overflow: hidden;
        background: #000;
      }
      .main-container { width: 100%; height: 100%; position: relative; }
      .cover-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
      :host(:hover) .cover-image { transform: scale(1.05); }
      
      .hover-video-el {
        position: absolute; inset: 0; width: 100%; height: 100%; 
        object-fit: cover; opacity: 0; transition: opacity 0.3s;
        pointer-events: none;
      }

      .play-button {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 60px; height: 60px; background: rgba(255, 255, 255, 0.9);
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        z-index: 2; pointer-events: none;
      }
      .play-icon { width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 16px solid #f570b7; margin-left: 4px; }

      /* Modal Overlay */
      .overlay {
        position: fixed; inset: 0; width: 100vw; height: 100dvh;
        background: rgba(0,0,0,0.8); z-index: 9999;
        display: none; justify-content: center; align-items: center;
        backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      }
      .overlay.active { display: flex; justify-content: flex-start;}
      
      .overlay-content {
        display: grid; grid-template-columns: 106.21px 1fr;
        width: calc(100% - 400px); height: 100%; gap: 20px; padding: 0px;
      }

      .player-col {
        position: relative; align-self: center; justify-self: center;
        width: 100%; max-width: 450px; height: 100vh;
        background: #000; overflow: hidden;
      }
      
      #video-dest { width: 100%; height: 100%; object-fit: contain; }

      .vid-button {
        position: absolute; top: 16px; z-index: 10;
        background: rgba(0, 0, 0, 0); border: none; border-radius: 50%;
        cursor: pointer; padding: 10px; display: flex; transition: 0.3s;
      }
      .vid-button:hover { background: rgba(0,0,0,0.6); }
      .close-overlay { left: 30px; }
      .mute-vid { right: 30px; }

      .thumbnails-col { overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; gap: 10px; padding: 10px; }
      .thumb { width: 100%; height: 86.21px; aspect-ratio: 9/16; object-fit: cover; border-radius: 10.34px; cursor: pointer; opacity: 0.6; border: 2px solid transparent; }
      .thumb.active { opacity: 1; border-color: #f570b7; }
      .cart-col {
        background: #fff; display: flex;
        flex-direction: column;
        overflow-y: auto;
      }
      @media (max-width: 990px) {
        .overlay-content { grid-template-columns: 1fr; width: 100%;}
      }  
      @media (max-width: 768px) {
        .overlay-content { grid-template-columns: 1fr; }
        .thumbnails-col { display: none; }
      }
    </style>

    <div class="main-container">
      <img src="${coverSrc}" class="cover-image" alt="Vidéo cover">
      <video class="hover-video-el" muted playsinline loop></video>
      <div class="play-button"><div class="play-icon"></div></div>
    </div>

    <div class="overlay" id="overlay">
      <div class="overlay-content">
        <div class="thumbnails-col" id="thumbs-container"></div>
        
        <div class="player-col">
          <button class="vid-button close-overlay" id="close-overlay">${this.getCloseSvg()}</button>
          <button class="vid-button mute-vid" id="mute-vid">${this.getMuteSvg()}</button>
          <div id="video-dest"></div> <!-- C'est ici qu'on injecte la vidéo -->
        </div>
        
        <div class="cart-col" id="product-aside">
           <div id="product-loading">Chargement du produit...</div>
        </div>
      </div>
    </div>
    `;
  }

  getCloseSvg() {
    return ` <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
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
           </svg>`;
  }
  getMuteSvg() {
    return this.isMuted
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="36" viewBox="0 0 24 24" fill="none"><path d="M15 8.37003V7.41003C15 4.43003 12.93 3.29003 10.41 4.87003L7.49 6.70003C7.17 6.89003 6.8 7.00003 6.43 7.00003H5C3 7.00003 2 8.00003 2 10V14C2 16 3 17 5 17H7" stroke="#353535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.41 19.13C12.93 20.71 15 19.56 15 16.59V12.95" stroke="#353535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.81 9.41992C19.71 11.5699 19.44 14.0799 18 15.9999" stroke="#353535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.15 7.80005C22.62 11.29 22.18 15.37 19.83 18.5" stroke="#353535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 2L2 22" stroke="#353535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      : ` <svg xmlns="http://www.w3.org/2000/svg" width="42" height="36" viewBox="0 0 42 36" fill="none"> <g filter="url(#filter0_d_3634_18577)"> <path d="M6.6499 14.8293V20.4293C6.6499 23.2293 8.0499 24.6293 10.8499 24.6293H12.8519C13.3699 24.6293 13.8879 24.7833 14.3359 25.0493L18.4239 27.6113C21.9519 29.8233 24.8499 28.2133 24.8499 24.0553V11.2033C24.8499 7.03134 21.9519 5.43534 18.4239 7.64734L14.3359 10.2093C13.8879 10.4753 13.3699 10.6293 12.8519 10.6293H10.8499C8.0499 10.6293 6.6499 12.0293 6.6499 14.8293Z" stroke="white" stroke-width="2.1"/> <path d="M29.0503 12.0294C31.5423 15.3474 31.5423 19.9114 29.0503 23.2294" stroke="white" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/> <path d="M31.6123 8.52936C35.6583 13.9194 35.6583 21.3394 31.6123 26.7294" stroke="white" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/> </g> <defs> <filter id="filter0_d_3634_18577" x="-1.7499" y="-4.77065" width="44.8001" height="44.8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/> <feOffset/> <feGaussianBlur stdDeviation="2.8"/> <feComposite in2="hardAlpha" operator="out"/> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3634_18577"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3634_18577" result="shape"/> </filter> </defs> </svg>;`;
  }

  initHoverVideo() {
    const hoverVid = this.shadowRoot.querySelector(".hover-video-el");
    const videoUrl = this.getAttribute("data-video-url");

    this.addEventListener("mouseenter", () => {
      if (this.isOpen) return;
      hoverVid.src = videoUrl;
      hoverVid.style.opacity = "1";
      hoverVid.play().catch(() => {});
    });

    this.addEventListener("mouseleave", () => {
      hoverVid.pause();
      hoverVid.style.opacity = "0";
      hoverVid.src = "";
    });
  }

  setupEventListeners() {
    this.shadowRoot
      .querySelector(".main-container")
      .addEventListener("click", () => this.openOverlay());
    this.shadowRoot
      .getElementById("close-overlay")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeOverlay();
      });
    this.shadowRoot
      .getElementById("mute-vid")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleMute();
      });

    this.shadowRoot.getElementById("overlay").addEventListener("click", (e) => {
      if (e.target.id === "overlay") this.closeOverlay();
    });
  }

  openOverlay() {
    if (this.isOpen) return;
    this.isOpen = true;

    const overlay = this.shadowRoot.getElementById("overlay");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    document.body.classList.add("video-component-active");

    this.renderThumbs();
    this.loadVideo(this.getAttribute("data-video-url"));

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
  renderThumbs() {
    const container = this.shadowRoot.getElementById("thumbs-container");
    const allVids = Array.from(
      document.querySelectorAll("doumdoum-video-player"),
    );

    container.innerHTML = allVids
      .map(
        (vid) => `
      <img src="${vid.getAttribute("data-cover-image")}" 
           class="thumb ${vid === this ? "active" : ""}" 
           data-url="${vid.getAttribute("data-video-url")}">
    `,
      )
      .join("");

    container.querySelectorAll(".thumb").forEach((t) => {
      t.addEventListener("click", (e) => {
        container
          .querySelectorAll(".thumb")
          .forEach((img) => img.classList.remove("active"));
        t.classList.add("active");
        this.loadVideo(t.dataset.url);
      });
    });
  }

  loadVideo(url) {
    const dest = this.shadowRoot.getElementById("video-dest");
    dest.innerHTML = `<video src="${url}" playsinline controls autoplay loop style="width:100%; height:100%;"></video>`;

    const video = dest.querySelector("video");
    video.muted = this.isMuted;
    video.play();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    const video = this.shadowRoot.querySelector("#video-dest video");
    if (video) video.muted = this.isMuted;

    this.shadowRoot.getElementById("mute-vid").innerHTML = this.getMuteSvg();
  }

  closeOverlay() {
    this.isOpen = false;
    this.shadowRoot.getElementById("overlay").classList.remove("active");
    this.shadowRoot.getElementById("video-dest").innerHTML = "";
    document.body.style.overflow = "";
    document.body.classList.remove("video-component-active");

    this.toggleCustomCart(false);
  }
}

if (!customElements.get("doumdoum-video-player")) {
  customElements.define("doumdoum-video-player", DoumdoumVideoPlayer);
}
