import shopifyLogo from './assets/logo-shopify.png';
import metaLogo from './assets/logo-meta.png';
import bombardierLogo from './assets/logo-bombardier.png';
import './styles/folio.css';

const base = import.meta.env.BASE_URL;
const external = (href, label) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`;
const tags = items => `<div class="tag-row">${items.map(item => `<span class="tag">${item}</span>`).join('')}</div>`;
const dialogTop = (chapter, label) => `<div class="dialog-top"><span class="eyebrow">${chapter} / ${label}</span><button class="close-button" data-close aria-label="Close ${label.toLowerCase()}">×</button></div>`;

export const projects = [
  {
    title: 'Gear-Pack', image: 'project-gear-pack.jpg', kicker: 'A project I keep coming back to', featured: true,
    copy: 'A trip-planning platform for the part of hiking that happens before the trailhead: planning a route, sharing gear, and figuring out who is bringing what.',
    detail: 'I built the app around collaborative trips, a PostgreSQL backend, and an AI assistant that remembers each user across sessions. An iOS app is in progress with Expo and React Native.',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'AI'],
    links: [['https://gear-pack.vercel.app/', 'Explore Gear-Pack'], ['https://github.com/zaifnatra/gear-pack', 'Source code']],
  },
  {
    title: 'mtl minted', image: 'project-mtl-minted.jpg', kicker: 'Best Use of Solana · McHacks 13 · US$1,000 microgrant', featured: true,
    copy: 'A way for artists to mint and tokenize their creative identity on Solana. I wrote the Rust and Anchor programs behind minting, transfers, and transaction history.',
    detail: 'We won Best Use of Solana at McHacks 13, and our team won a US$1,000 microgrant for mtl minted.',
    tech: ['Rust', 'Anchor', 'Solana'],
    links: [[`${base}mtl-minted.html`, 'Project story'], ['https://devpost.com/software/black-beauty', 'Devpost'], ['https://github.com/zaifnatra/solana', 'Source code']],
  },
  {
    title: 'shorten.it', image: 'project-shorten-it.jpg', kicker: '3rd overall · Meta × MLH PE Hackathon',
    copy: 'A URL shortener built to be put through its paces. Load tests, injected outages, and Grafana dashboards helped us see what held up and what broke.',
    tech: ['Production engineering', 'Observability'],
    links: [['https://devpost.com/software/shorten-it', 'The project'], ['https://github.com/zaifnatra/MetaHackathon', 'Source code']],
  },
  {
    title: 'retro secrets', image: 'project-retro-secrets.jpg', kicker: 'Winner · Web3 Challenge · ConUHacks',
    copy: 'Hidden messages inside images, using steganography and custom encryption. A small social platform gave those secrets somewhere to travel.',
    tech: ['Steganography', 'Encryption'],
    links: [['https://devpost.com/software/retro-secrets', 'The project'], ['https://github.com/deltag0/ConUHacks', 'Source code']],
  },
  {
    title: 'EV prediction model', image: 'project-ev-model.jpg', kicker: 'An experiment with data',
    copy: 'Predicting electric vehicle specifications with scikit-learn, wrapped in a small Streamlit app so the model is easy to try.',
    tech: ['Python', 'scikit-learn', 'Streamlit'],
    links: [['https://ev-prediction-zaifnatra.streamlit.app/', 'Try the model'], ['https://github.com/zaifnatra/ev-ml', 'Source code']],
  },
  {
    title: 'heroes journey', image: 'project-heroes-journey.jpg', kicker: 'Built from scratch',
    copy: 'A 2D puzzle adventure through a randomized maze. Written from scratch in Java, one room and one puzzle at a time.',
    tech: ['Java', 'Game development'],
    links: [['https://github.com/zaifnatra/spaceus', 'Source code']],
  },
  {
    title: 'campus events', image: 'project-campus-events.jpg', kicker: 'A little more campus life',
    copy: 'A place for students to find, organize, and get tickets to events on campus.',
    tech: ['Web application', 'Student project'],
    links: [['https://soen341-f25.onrender.com/', 'Open the app'], ['https://github.com/zaifnatra/SOEN341-F25', 'Source code']],
  },
];

export const hobbies = [
  {
    title: 'A long way from Montréal.', kicker: 'PERU / SALKANTAY',
    copy: 'Multi-day hiking, incredible scenery, and people I was glad to meet along the way. The Salkantay trek is still one of my favourite trips.',
    image: 'personal-salkantay.jpg', alt: 'Hikers on a rocky mountain pass during the Salkantay trek in Peru',
  },
  {
    title: '75 km. 12 hours. One more loop.', kicker: 'RUNNING / A BACKYARD ULTRA',
    copy: 'My longest run so far. A lot of running, and a lot of convincing myself to go around once more.',
    image: 'personal-ultra.jpg', alt: 'A rest between loops at a backyard ultramarathon',
  },
  {
    title: 'A little closer to home.', kicker: 'THE DAYS IN BETWEEN',
    copy: 'Hiking in the Adirondacks, winter trails, camping, and fishing. It doesn’t always need to be an expedition.',
    image: 'personal-camp.jpg', alt: 'A yellow tent among snow-dusted trees on a camping trip',
  },
  {
    title: 'Sometimes, just a round of golf.', kicker: 'NO SUMMIT REQUIRED',
    copy: 'Another reason to spend a few hours outside.',
    image: 'personal-golf.jpg', alt: 'A personal snapshot on the golf course',
  },
];

const readerPages = { projects: 0, outside: 0 };
const readerItems = { projects, outside: hobbies };
const readerAnimations = new Map();

function readerShell(kind) {
  return `<div class="folio-reader" data-folio="${kind}"><div class="folio-spread" id="${kind}-spread"></div>
    <nav class="folio-navigation" aria-label="${kind === 'projects' ? 'Project notebook' : 'Photo album'} pages">
      <button type="button" data-folio-prev="${kind}" aria-controls="${kind}-spread"><span aria-hidden="true">←</span> Previous page</button>
      <span class="folio-page-count" id="${kind}-page-count" role="status" aria-live="polite" aria-atomic="true"></span>
      <button type="button" data-folio-next="${kind}" aria-controls="${kind}-spread">Next page <span aria-hidden="true">→</span></button>
    </nav><p class="folio-keyboard-hint">E or → for next page · ← for previous page.</p></div>`;
}

function renderReader(kind, previousIndex, animate = true) {
  const spread = document.getElementById(`${kind}-spread`);
  if (!spread) return;
  const items = readerItems[kind];
  const index = readerPages[kind];
  const item = items[index];
  const project = kind === 'projects';
  const imageLabel = project ? `${item.title} project screenshot` : item.alt;
  spread.innerHTML = `<figure class="folio-image-page ${project ? 'folio-project-image' : 'folio-photo-image'}">
    <span class="folio-page-eyebrow">${project ? 'FROM THE WORKBENCH' : 'FROM MY CAMERA ROLL'}</span>
    <a href="${base}images/${item.image}" target="_blank" rel="noopener noreferrer" aria-label="Open ${imageLabel}"><img src="${base}images/${item.image}" alt="${imageLabel}" width="1200" height="900" decoding="async" /><span>View ${project ? 'screenshot' : 'photo'} ↗</span></a>
    <figcaption>${String(index + 1).padStart(2, '0')} / ${project ? 'A project notebook' : 'A few days worth remembering'}</figcaption>
    </figure><article class="folio-text-page" aria-labelledby="${kind}-page-title"><span class="folio-page-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><p class="folio-kicker">${item.kicker}</p><h3 id="${kind}-page-title">${item.title}</h3><p class="folio-copy">${item.copy}</p>
    ${item.detail ? `<p class="folio-detail">${item.detail}</p>` : ''}
    ${project ? `${tags(item.tech)}<div class="portfolio-links">${item.links.map(([href, label]) => external(href, label)).join('')}</div>` : '<span class="folio-personal-note">A little life outside the laptop.</span>'}
    </article>`;
  const count = document.getElementById(`${kind}-page-count`);
  count.textContent = `Page ${index + 1} of ${items.length}`;
  const previousButton = document.querySelector(`[data-folio-prev="${kind}"]`);
  const nextButton = document.querySelector(`[data-folio-next="${kind}"]`);
  const focusedControl = document.activeElement;
  previousButton.disabled = index === 0;
  nextButton.disabled = index === items.length - 1;
  // Keep focus inside the reader when a navigation button becomes unavailable.
  if (focusedControl === previousButton && previousButton.disabled && !nextButton.disabled) {
    nextButton.focus({ preventScroll: true });
  } else if (focusedControl === nextButton && nextButton.disabled && !previousButton.disabled) {
    previousButton.focus({ preventScroll: true });
  }
  const lastAnimation = readerAnimations.get(kind);
  lastAnimation?.cancel();
  if (animate && previousIndex !== index && !matchMedia('(prefers-reduced-motion: reduce)').matches && spread.animate) {
    const direction = index > previousIndex ? 1 : -1;
    readerAnimations.set(kind, spread.animate([
      { opacity: .4, transform: `perspective(1400px) rotateY(${direction * 4}deg) translateX(${direction * 8}px)` },
      { opacity: 1, transform: 'perspective(1400px) rotateY(0deg) translateX(0)' },
    ], { duration: 240, easing: 'cubic-bezier(.2,.7,.2,1)' }));
  }
}

/** Update a notebook/album page without opening a dialog; kinds: projects, outside. */
export function setPortfolioPage(kind, index) {
  if (!Object.hasOwn(readerItems, kind)) return;
  const previousIndex = readerPages[kind];
  const numericIndex = Number(index);
  readerPages[kind] = Math.max(0, Math.min(readerItems[kind].length - 1, Number.isFinite(numericIndex) ? Math.trunc(numericIndex) : 0));
  renderReader(kind, previousIndex);
  document.dispatchEvent(new CustomEvent('portfolio-page-change', { detail: { kind, index: readerPages[kind] } }));
}

function mountReaders() {
  for (const kind of Object.keys(readerItems)) {
    renderReader(kind, readerPages[kind], false);
    document.querySelector(`[data-folio-prev="${kind}"]`).addEventListener('click', () => setPortfolioPage(kind, readerPages[kind] - 1));
    document.querySelector(`[data-folio-next="${kind}"]`).addEventListener('click', () => setPortfolioPage(kind, readerPages[kind] + 1));
    document.getElementById(`${kind}-dialog`).addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
      const next = event.key === 'ArrowRight' || event.code === 'KeyE';
      if (event.key !== 'ArrowLeft' && !next) return;
      event.preventDefault();
      if (event.repeat) return;
      setPortfolioPage(kind, readerPages[kind] + (next ? 1 : -1));
    });
  }
}

export function mountPortfolio() {
  if (document.getElementById('experience-dialog')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="experience-dialog" class="portfolio-dialog portfolio-dialog-wide" aria-labelledby="experience-title">
      ${dialogTop('01', 'WORK & SCHOOL')}
      <h2 id="experience-title">A few stops<br>along the way.</h2>
      <p class="dialog-lead">I’m a software engineering student in Montréal. Lately, I’ve been working on the infrastructure that keeps other people’s software running.</p>
      <div class="experience-route">
        <article class="portfolio-entry portfolio-entry-current" data-experience="shopify">
          <div class="entry-heading"><div class="company-heading"><img class="company-logo" src="${shopifyLogo}" alt="" width="36" height="36" /><div><h3>Shopify</h3><p class="entry-meta">Software Engineering Intern · Streaming Infrastructure</p></div></div><span class="entry-date">Sep 2026 — present</span></div>
          <p>I’ve become very familiar with Apache Flink and Apache Kafka on Shopify’s Streaming Infrastructure team. A lot of my work is about making deployments and the systems behind merchant analytics more reliable.</p>
          <ul class="work-notes"><li>Enabled blue/green deployments for <strong>120+ production Flink pipelines</strong>, checking Kafka offset recovery and ClickHouse output consistency.</li><li>Rebuilt an Airflow Git update step with atomic, conflict-checked Python updates: recurring <strong>five-minute timeouts became a 23-second commit step</strong>.</li><li>Automated discovery of <strong>200+ environments across four Kubernetes clusters</strong> and standardized Flink configuration across 314 production and staging environments.</li></ul>
          ${tags(['Flink', 'Kafka', 'Python', 'Kubernetes', 'Helm'])}
        </article>
        <article class="portfolio-entry" data-experience="mlh">
          <div class="entry-heading"><div class="company-heading"><img class="company-logo" src="${metaLogo}" alt="" width="36" height="36" /><div><h3>Meta × MLH Fellowship</h3><p class="entry-meta">Production Engineering Fellow · Remote</p></div></div><span class="entry-date">Jun — Sep 2026</span></div>
          <p>This is where I learned Docker, Unix, and Linux by putting them to work. With mentorship from Meta production engineers, I built, deployed, monitored, and debugged real services.</p>
          <ul class="work-notes"><li>Built three validated Flask API endpoints and deployed Docker services behind NGINX on a Linux VPS.</li><li>Automated releases with GitHub Actions and nine integration tests; added <strong>16 Prometheus alert rules and a 14-panel Grafana dashboard</strong> with Discord paging.</li></ul>
          ${tags(['Docker', 'Unix', 'Linux', 'Flask', 'Prometheus', 'Grafana'])}
        </article>
        <article class="portfolio-entry" data-experience="bombardier">
          <div class="entry-heading"><div class="company-heading"><img class="company-logo" src="${bombardierLogo}" alt="" width="36" height="36" /><div><h3>Bombardier Aerospace</h3><p class="entry-meta">Software Engineering Intern · Montréal</p></div></div><span class="entry-date">Jan — Aug 2026</span></div>
          <p>A lot of Power BI, SQL, and internal tooling. Not always the flashiest work, but I learned a lot about aircraft and the engineering work behind them.</p>
          <ul class="work-notes"><li>Reverse-engineered an undocumented Java application to fetch, map, and visualize <strong>4,000+ records</strong>, saving engineers more than four hours of manual entry.</li><li>Built a SQL pipeline for <strong>10,000+ records</strong>, expanding KPI visibility through BI dashboards for 500+ engineers.</li><li>Wrote Unix and symlink work instructions that helped engineers work independently.</li></ul>
          ${tags(['Power BI', 'SQL', 'Java', 'Unix', 'Aerospace'])}
        </article>
        <article class="portfolio-entry">
          <div class="entry-heading"><div><h3>Student Works</h3><p class="entry-meta">Crew Chief & Sales</p></div><span class="entry-date">People & operations</span></div>
          <p>I led a crew of three to five people and worked in sales. A different kind of responsibility: less code, more people, and a team to look after.</p>
        </article>
        <section class="portfolio-entry work-away" aria-labelledby="work-away-title">
          <p class="eyebrow">MORE THAN A TECH RÉSUMÉ</p><h3 id="work-away-title">Work away from a screen.</h3>
          <div class="work-away-grid"><article><h4>Sushi Topia</h4><p class="entry-meta">Sushi chef · Sainte-Anne-de-Bellevue</p><p>I worked as a sushi chef in a basement in Sainte-Anne-de-Bellevue. A very different setting from a software team, and part of my story just the same.</p></article><article><h4>Chalet Thai</h4><p class="entry-meta">Dishwashing & food prep · Sainte-Anne-de-Bellevue</p><p>I washed dishes and handled food prep at Chalet Thai, also in Sainte-Anne-de-Bellevue.</p></article></div>
        </section>
        <article class="portfolio-entry">
          <div class="entry-heading"><div><h3>Concordia University</h3><p class="entry-meta">Bachelor of Software Engineering · Montréal</p></div><span class="entry-date">Expected Jun 2028</span></div>
          <p>Studying data structures, operating systems, data analytics, and web programming. Building plenty of things outside class, too.</p>
        </article>
      </div>
      <div class="portfolio-footer"><a class="text-link" href="./Huzaifa_Fareed_Resume.pdf" target="_blank" rel="noopener noreferrer">Read my résumé ↗</a><button class="text-link" data-open="projects-dialog">Next: things I’ve built →</button></div>
    </dialog>

    <dialog id="projects-dialog" class="portfolio-dialog portfolio-dialog-wide folio-dialog" aria-labelledby="projects-title">
      ${dialogTop('02', 'THINGS I’VE BUILT')}
      <h2 id="projects-title">Ideas worth staying up for.</h2>
      <p class="dialog-lead">Some weekend projects, some hackathons, and one very good excuse to keep thinking about hiking.</p>
      ${readerShell('projects')}
      <div class="portfolio-footer">${external('https://github.com/zaifnatra', 'More on GitHub')}<button class="text-link" data-open="outside-dialog">Next: away from the screen →</button></div>
    </dialog>

    <dialog id="outside-dialog" class="portfolio-dialog portfolio-dialog-wide folio-dialog" aria-labelledby="outside-title">
      ${dialogTop('03', 'AWAY FROM THE SCREEN')}
      <h2 id="outside-title">The other kind of adventure.</h2>
      <p class="dialog-lead">Usually somewhere with a little elevation. Sometimes just by a lake. These are a few of my own snapshots from the time in between.</p>
      ${readerShell('outside')}
      <div class="portfolio-footer"><button class="text-link" data-open="contact-dialog">Have a trail recommendation? Say hello →</button><a class="text-link" href="./about.html">Read the full story ↗</a></div>
    </dialog>

    <dialog id="contact-dialog" class="portfolio-dialog" aria-labelledby="contact-title">
      ${dialogTop('04', 'SAY HELLO')}
      <h2 id="contact-title">Good things start<br>with a conversation.</h2>
      <p class="dialog-lead">For work, a side project, or a trail I should know about. I’d be happy to hear from you.</p>
      <a class="contact-address" href="mailto:huzaifafareed817@gmail.com">huzaifafareed817@gmail.com <span aria-hidden="true">↗</span></a>
      <div class="contact-links">${external('https://github.com/zaifnatra', 'GitHub')}${external('https://linkedin.com/in/huzaifa-fareed', 'LinkedIn')}<a href="./Huzaifa_Fareed_Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé <span aria-hidden="true">↗</span></a></div>
      <p class="contact-location"><span class="eyebrow">BASED IN</span><br>Montréal, Québec</p>
      <div class="portfolio-footer"><a class="text-link" href="./about.html">Read the full story ↗</a><button class="text-link" data-close>Back to the trail →</button></div>
    </dialog>
  `);
  mountReaders();
  for (const entry of document.querySelectorAll('[data-experience]')) {
    const key = entry.dataset.experience;
    const title = entry.querySelector('h3').textContent;
    const detail = entry.cloneNode(true);
    detail.removeAttribute('data-experience');
    detail.classList.remove('portfolio-entry-current');
    detail.querySelector('h3').remove();
    document.body.insertAdjacentHTML('beforeend', `
      <dialog id="experience-${key}-dialog" class="portfolio-dialog" aria-labelledby="experience-${key}-title">
        ${dialogTop('01', title)}
        <h2 id="experience-${key}-title">${title}</h2>
        ${detail.outerHTML}
        <div class="portfolio-footer"><button class="text-link" data-open="experience-dialog">All experience ↗</button><button class="text-link" data-close>Back to the trail →</button></div>
      </dialog>
    `);
  }

}
