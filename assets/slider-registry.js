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
      992: { perView: 2 },
      768: { perView: 1.5 },
      480: { perView: 1.2 },
    },
  },
  products: {
    type: "slider",
    perView: 3,
  },
  testimonials: {
    type: "carousel",
    perView: 6,
    bound: true,
    gap: 0,
    focusAt: "center",
    startAt: 3,
    breakpoints: {
      1280: { perView: 5 },
      1050: { perView: 4 },
      992: { perView: 3.5 },
      768: { perView: 3 },
      700: { perView: 2.5 },
      600: { perView: 2.2 },
      500: { perView: 1.8 },
      420: { perView: 1.5 },
    },
  },
  video_carousel: {
    type: "slider",
    perView: 5,
    breakpoints: {
      600: {
        perView: 1.8,
      },
    },
  },
};
