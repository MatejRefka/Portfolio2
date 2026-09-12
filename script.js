const featuredPage = document.querySelector("#featured-page");
const archivePage = document.querySelector("#archive-page");
const archiveTitle = document.querySelector("#archive-title");
const showArchiveButton = document.querySelector("#show-archive");
const hideArchiveButton = document.querySelector("#hide-archive");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const scrollToPage = (page, onComplete) => {
  if (reducedMotion.matches) {
    page.scrollIntoView({ behavior: "auto", block: "start" });
    onComplete();
    return;
  }

  let fallbackTimer;
  const handleScrollEnd = () => {
    window.clearTimeout(fallbackTimer);
    window.removeEventListener("scrollend", handleScrollEnd);
    onComplete();
  };

  window.addEventListener("scrollend", handleScrollEnd, { once: true });
  fallbackTimer = window.setTimeout(handleScrollEnd, 900);
  page.scrollIntoView({ behavior: "smooth", block: "start" });
};

showArchiveButton.addEventListener("click", () => {
  archivePage.hidden = false;
  document.documentElement.classList.add("page-transitioning");
  showArchiveButton.setAttribute("aria-expanded", "true");
  archiveTitle.focus({ preventScroll: true });

  requestAnimationFrame(() => {
    scrollToPage(archivePage, () => {
      document.documentElement.classList.remove("page-transitioning");
    });
  });
});

hideArchiveButton.addEventListener("click", () => {
  document.documentElement.classList.add("page-transitioning");
  showArchiveButton.setAttribute("aria-expanded", "false");

  const finishClosing = () => {
    archivePage.hidden = true;
    document.documentElement.classList.remove("page-transitioning");
    showArchiveButton.focus({ preventScroll: true });
  };

  scrollToPage(featuredPage, finishClosing);
});
