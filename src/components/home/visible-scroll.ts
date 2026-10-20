/** Measure animated sections only while they are on screen. */
export function observeViewportScroll(el: HTMLElement, update: () => void) {
  let active = true;
  let raf = 0;
  const schedule = () => {
    if (raf || document.hidden) return;
    raf = window.requestAnimationFrame(() => { raf = 0; update(); });
  };
  const onScroll = () => { if (active) schedule(); };
  const observer = new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    // Set the final state on exit as well as the initial state on entry.
    schedule();
  });
  observer.observe(el);
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", schedule);
  document.addEventListener("visibilitychange", schedule);
  return () => {
    observer.disconnect();
    if (raf) window.cancelAnimationFrame(raf);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", schedule);
    document.removeEventListener("visibilitychange", schedule);
  };
}
