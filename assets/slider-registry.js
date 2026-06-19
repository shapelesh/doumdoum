export const sliderRegistry = {
  scrolling_text: {
    type: "carousel",
    perView: 3,
    autoplay: 1,
    animationDuration: 5000,
    rewind: false,
    animationTimingFunc: "cubic-bezier(0,0,1,1)",
    breakpoints: {
      768: { perView: 2 },
      480: { perView: 1.2 },
    },
  },
};
