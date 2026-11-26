const navigationLinks = [...document.querySelectorAll('.page-nav a')];
const sections = navigationLinks.map((link) => document.querySelector(link.hash));
let updateQueued = false;

function updateCurrentSection() {
  const readingLine = window.innerHeight * 0.3;
  let currentSection = sections[0];

  for (const section of sections) {
    if (section.getBoundingClientRect().top <= readingLine) {
      currentSection = section;
    }
  }

  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

  if (atBottom) {
    currentSection = sections.at(-1);
  }

  for (const link of navigationLinks) {
    if (link.hash === `#${currentSection.id}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  }

  updateQueued = false;
}

function queueSectionUpdate() {
  if (!updateQueued) {
    updateQueued = true;
    window.requestAnimationFrame(updateCurrentSection);
  }
}

window.addEventListener('scroll', queueSectionUpdate, { passive: true });
window.addEventListener('resize', queueSectionUpdate);
window.addEventListener('pageshow', queueSectionUpdate);
document.addEventListener('toggle', queueSectionUpdate, true);
updateCurrentSection();
