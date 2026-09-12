const featuredPage = document.querySelector("#featured-page");
const archivePage = document.querySelector("#archive-page");
const archiveTitle = document.querySelector("#archive-title");
const showArchiveButton = document.querySelector("#show-archive");
const hideArchiveButton = document.querySelector("#hide-archive");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const scrollBehavior = () => (reducedMotion.matches ? "auto" : "smooth");

showArchiveButton.addEventListener("click", () => {
  archivePage.hidden = false;
  document.body.classList.add("archive-open");
  showArchiveButton.setAttribute("aria-expanded", "true");
  archiveTitle.focus({ preventScroll: true });

  requestAnimationFrame(() => {
    archivePage.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  });
});

hideArchiveButton.addEventListener("click", () => {
  showArchiveButton.setAttribute("aria-expanded", "false");

  const finishClosing = () => {
    archivePage.hidden = true;
    document.body.classList.remove("archive-open");
    showArchiveButton.focus({ preventScroll: true });
  };

  if (reducedMotion.matches) {
    featuredPage.scrollIntoView({ behavior: "auto", block: "start" });
    finishClosing();
    return;
  }

  let fallbackTimer;
  const handleScrollEnd = () => {
    window.clearTimeout(fallbackTimer);
    window.removeEventListener("scrollend", handleScrollEnd);
    finishClosing();
  };

  window.addEventListener("scrollend", handleScrollEnd, { once: true });
  fallbackTimer = window.setTimeout(handleScrollEnd, 900);
  featuredPage.scrollIntoView({ behavior: "smooth", block: "start" });
});
