import "../styles/home.scss";

function initProjectRowScrollAnimation() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

initProjectRowScrollAnimation();
