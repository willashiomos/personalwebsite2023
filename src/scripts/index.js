import "../styles/home.scss";

function initProjectRowScrollAnimation() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".project-row__media").forEach((item) => {
      item.classList.add("is-inview");
    });
    return;
  }

  const mediaItems = document.querySelectorAll(".project-row__media");
  if (!mediaItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (let i = 0; i < entries.length; i += 1) {
        const entry = entries[i];
        if (!entry.isIntersecting) continue;

        entry.target.classList.add("is-inview");
        observer.unobserve(entry.target);
      }
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  for (let i = 0; i < mediaItems.length; i += 1) {
    observer.observe(mediaItems[i]);
  }
}

function getProjectCategories(row) {
  const meta = row.querySelector(".project-row__meta > span");
  if (!meta) return [];

  const text = meta.textContent.toLowerCase();
  const categories = [];

  if (text.includes("design")) categories.push("design");
  if (text.includes("development")) categories.push("development");

  return categories;
}

function revealVisibleProjectMedia() {
  document.querySelectorAll(".project-row:not(.is-hidden) .project-row__media").forEach((media) => {
    media.classList.add("is-inview");
  });
}

function initProjectFilters() {
  const filters = document.querySelector(".filters");
  if (!filters) return;

  const links = filters.querySelectorAll("[data-filter]");
  const rows = document.querySelectorAll(".project-row");
  if (!links.length || !rows.length) return;

  function setFilter(filter) {
    links.forEach((link) => {
      const isActive = link.getAttribute("data-filter") === filter;
      link.classList.toggle("filters__link--active", isActive);
      link.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    rows.forEach((row) => {
      const categories = getProjectCategories(row);
      const matches = filter === "all" || categories.includes(filter);
      row.classList.toggle("is-hidden", !matches);
    });

    revealVisibleProjectMedia();
  }

  filters.addEventListener("click", (event) => {
    const link = event.target.closest("[data-filter]");
    if (!link || !filters.contains(link)) return;

    event.preventDefault();
    setFilter(link.getAttribute("data-filter"));
  });
}

initProjectRowScrollAnimation();
initProjectFilters();
