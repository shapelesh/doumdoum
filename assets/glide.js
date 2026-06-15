import Glide from "@theme/glide-esm";
export function createGlide(el, options) {
  if (!el) return null;

  const glide = new Glide(el, options);
  glide.mount();

  return glide;
}
