export default defineNuxtPlugin(() => {
  const layout = useLayout();
  watch(() => layout.value.bodyScrollLock, watchBodyScrollLock);

  function watchBodyScrollLock(lock: boolean) {
    if (lock) {
      activeBodyScroll();
    } else {
      deactiveBodyScroll();
    }
  }
  function activeBodyScroll() {
    const target = document.documentElement;
    layout.value.bodyScrollTop = window.scrollY;
    layout.value.bodyScrollbarWidth = window.innerWidth - target.clientWidth;

    target.style.position = "fixed";
    target.style.top = layout.value.bodyScrollTop * -1 + "px";
    if (layout.value.bodyScrollbarWidth > 0) {
      target.style.overflowY = "scroll";
    }
  }
  function deactiveBodyScroll() {
    const target = document.documentElement;
    target.style.position = "unset";
    target.style.top = "unset";
    target.style.overflowY = "auto";
    window.scrollTo({
      top: layout.value.bodyScrollTop,
    });
  }
});
