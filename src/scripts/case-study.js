import "../styles/case-study.scss";

function initCaseStudyMediaScrollAnimation() {
  const mediaItems = document.querySelectorAll(".case-study__media, .case-study__cover");
  if (!mediaItems.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    mediaItems.forEach((item) => {
      item.classList.add("is-inview");
    });
    return;
  }

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

initCaseStudyMediaScrollAnimation();
