class DoumdoumVideoPlayer extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ddvInit === "true") return;
    this.dataset.ddvInit = "true";

    this.classList.add("ddv-trigger");
    this.render();
    this.initHoverVideo();
    this.addEventListener("click", () => this.requestOpen());
  }

  render() {
    const coverSrc = this.getAttribute("data-cover-image") || "";

    this.innerHTML = `
      <div class="ddv-main-container">
        <img src="${coverSrc}" class="ddv-cover-image" alt="Vidéo cover" loading="lazy">
        <video class="ddv-hover-video-el" muted playsinline loop></video>
        <div class="ddv-play-button"><div class="ddv-play-icon"></div></div>
      </div>
    `;
  }

  initHoverVideo() {
    const hoverVid = this.querySelector(".ddv-hover-video-el");
    const videoUrl = this.getAttribute("data-video-url");

    this.addEventListener("mouseenter", () => {
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

  /** Build this trigger's payload — used both for opening and for the thumbnail rail. */
  getVideoData() {
    return {
      videoUrl: this.getAttribute("data-video-url") || "",
      coverImage: this.getAttribute("data-cover-image") || "",
      productHandle: this.getAttribute("data-product-handle") || "",
    };
  }

  requestOpen() {
    this.dispatchEvent(
      new CustomEvent("doumdoum:open-video", {
        bubbles: true,
        composed: true,
        detail: { source: this, ...this.getVideoData() },
      }),
    );
  }
}

if (!customElements.get("doumdoum-video-player")) {
  customElements.define("doumdoum-video-player", DoumdoumVideoPlayer);
}
