/** Tailwind + tailwindcss-animate bundles: ease-out, short duration, gated with motion-safe. */
export const pageContentEnter =
  'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200 motion-safe:ease-out motion-safe:fill-mode-both'

export const cardEnter = (delayClass: string) =>
  `motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-200 motion-safe:ease-out motion-safe:fill-mode-both ${delayClass}`

export const subtleZoomEnter =
  'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-200 motion-safe:ease-out motion-safe:fill-mode-both'
