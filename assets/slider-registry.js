export const sliderRegistry = {
  scrolling_text: {
    type: "carousel",
    perView: 3,
    focusAt: "center",
    autoplay: 16,
    animationDuration: 3000,
    rewind: false,
    animationTimingFunc: "cubic-bezier(0,0,1,1)",
    breakpoints: {
      768: { perView: 2 },
      480: { perView: 1.2 },
    },
  },
  products: {
    type: "slider",
    perView: 3,
  },
};
