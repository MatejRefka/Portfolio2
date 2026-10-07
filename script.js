const featuredPage = document.querySelector("#featured-page");
const archivePage = document.querySelector("#archive-page");
const archiveTitle = document.querySelector("#archive-title");
const showArchiveButton = document.querySelector("#show-archive");
const hideArchiveButton = document.querySelector("#hide-archive");
const archiveContent = archivePage.querySelector(".page-content");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const getPageTop = (page) => Math.round(window.scrollY + page.getBoundingClientRect().top);

const jumpToPage = (page) => {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo(0, getPageTop(page));
  root.style.scrollBehavior = previousScrollBehavior;
};

const scrollToPage = (page, onComplete) => {
  if (reducedMotion.matches) {
    jumpToPage(page);
    onComplete();
    return;
  }

  let completed = false;
  let fallbackTimer;
  const handleScrollEnd = () => {
    if (completed) {
      return;
    }

    completed = true;
    window.clearTimeout(fallbackTimer);
    window.removeEventListener("scrollend", handleScrollEnd);

    jumpToPage(page);
    onComplete();
  };

  window.addEventListener("scrollend", handleScrollEnd, { once: true });
  fallbackTimer = window.setTimeout(handleScrollEnd, 1000);
  window.scrollTo({ top: getPageTop(page), behavior: "smooth" });
};

showArchiveButton.addEventListener("click", () => {
  archivePage.hidden = false;
  archiveContent.scrollTo({ top: 0, behavior: "auto" });
  document.documentElement.classList.add("page-transitioning");
  showArchiveButton.setAttribute("aria-expanded", "true");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToPage(archivePage, () => {
        document.documentElement.classList.remove("page-transitioning");
        archiveTitle.focus({ preventScroll: true });
      });
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
