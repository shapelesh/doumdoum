export const sliderRegistry = {
  product: {
    type: "slider",
    perView: 5,
    bound: true,
    gap: 10,
    breakpoints: {
      992: { perView: 3 },
      // 768: { perView: 2 },
      480: { perView: 1 },
    },
  },
};
