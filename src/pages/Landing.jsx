import '../styles/theme.css';
import imgSalkantay2 from '../assets/salkantay2.JPG';
import imgLogo_shopify from '../assets/logo-shopify.png';
import imgLogo_meta from '../assets/logo-meta.png';
import imgLogo_bombardier from '../assets/logo-bombardier.png';
import imgSalkantay from '../assets/salkantay.JPG';
import imgUltra from '../assets/ultra.JPG';
import imgCat from '../assets/cat.jpg';
import imgGolf from '../assets/golf.JPG';
import imgOriginal from '../assets/original.png';
import imgOriginal2 from '../assets/original2.png';
import imgScreenShot from '../assets/screenShot.png';
import imgDashboard from '../assets/dashboard.png';
import imgRetro1 from '../assets/retro1.png';
import imgRetro from '../assets/retro.png';
import imgS1 from '../assets/S1.jpg';
import imgEv from '../assets/ev.png';
import imgHeroes1 from '../assets/heroes1.jpg';
import imgCampus from '../assets/campus.jpg';
// imported rather than hardcoded as "/cv.pdf" so Vite rewrites them for the
// /website/ base path on GitHub Pages
import cvUrl from '../assets/cv.pdf';
import gameUrl from '../assets/game.jar';

export default function Landing() {
  return (
      <div style={{ background: '#FFFFFF', color: '#000000', overflowX: 'hidden' }}>

        <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: '0', right: '0', bottom: '0', top: '300px', zIndex: '0', overflow: 'hidden' }}>
            <img src={imgSalkantay2} alt="Humantay Lake, Salkantay" fetchPriority="high" decoding="async" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
            <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(to bottom,#FFFFFF 0%,rgba(255,255,255,.88) 18%,rgba(255,255,255,.45) 52%,rgba(255,255,255,.8) 100%)' }}></div>
          </div>

          <nav style={{ position: 'relative', zIndex: '10', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 2rem' }}>
            <a href="#top" style={{ fontFamily: "'Instrument Serif',serif", fontSize: '1.875rem', letterSpacing: '-0.02em', color: '#000000', lineHeight: '1' }}>huzaifa<sup style={{ fontSize: '.5em', verticalAlign: 'super', letterSpacing: '0' }}>®</sup></a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem 1.5rem', justifyContent: 'flex-end' }}>
              <div className="nav-links" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem 1.5rem', justifyContent: 'flex-end' }}>
                <a href="#top" style={{ fontSize: '.875rem', color: '#000000', transition: 'color .2s ease' }}>Home</a>
                <a href="#about" style={{ fontSize: '.875rem', color: '#6F6F6F', transition: 'color .2s ease' }} className="nav-link">About</a>
                <a href="#work" style={{ fontSize: '.875rem', color: '#6F6F6F', transition: 'color .2s ease' }} className="nav-link">Work</a>
                <a href="#outside" style={{ fontSize: '.875rem', color: '#6F6F6F', transition: 'color .2s ease' }} className="nav-link">Outside</a>
                <a href="#contact" style={{ fontSize: '.875rem', color: '#6F6F6F', transition: 'color .2s ease' }} className="nav-link">Reach Me</a>
              </div>
              <a href="#contact" style={{ borderRadius: '999px', padding: '.625rem 1.5rem', fontSize: '.875rem', background: '#000000', color: '#FFFFFF', transition: 'transform .25s ease', whiteSpace: 'nowrap' }} className="btn">Get in touch</a>
            </div>
          </nav>

          <section id="top" style={{ position: 'relative', zIndex: '10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'calc(8rem - 75px) 1.5rem clamp(6rem,14vw,10rem) 1.5rem' }}>
            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: '400', fontSize: 'clamp(3rem,7.5vw,6rem)', lineHeight: '.95', letterSpacing: '-2.46px', maxWidth: '80rem', color: '#000000', textWrap: 'pretty', animation: 'fadeRise .8s ease-out both' }}>Huzaifa Fareed{' '}<em style={{ fontStyle: 'italic', color: 'rgb(111, 111, 111)' }}>Portfolio</em>{' '}Site.</h1>
            <p style={{ maxWidth: '42rem', marginTop: '2rem', fontSize: '1.125rem', lineHeight: '1.7', color: '#6F6F6F', animation: 'fadeRise .8s ease-out .2s both' }}>Software engineering student, outdoor & tech enthusiast.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%', gap: '1rem', marginTop: '3rem', animation: 'fadeRise .8s ease-out .4s both' }}>
              <a href="#work" style={{ borderRadius: '999px', padding: '1.25rem 3.5rem', fontSize: '1rem', background: '#000000', color: '#FFFFFF', transition: 'transform .25s ease' }} className="btn">See the work</a>
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" style={{ borderRadius: '999px', padding: '1.25rem 2.5rem', fontSize: '1rem', color: '#000000', border: '1px solid #E4E4E4', transition: 'transform .25s ease' }} className="btn">Resume</a>
            </div>
          </section>
        </div>

        <section style={{ borderTop: '1px solid #EEEEEE', borderBottom: '1px solid #EEEEEE', overflow: 'hidden', padding: '1.25rem 0' }}>
          <div style={{ display: 'flex', gap: '4rem', width: 'max-content', animation: 'marquee 32s linear infinite', color: '#6F6F6F', fontSize: '.8125rem', letterSpacing: '.14em', textTransform: 'uppercase' }}>
            <span>Shopify · SWE Intern</span><span>Meta × MLH · Production Engineering</span><span>Bombardier Aerospace · SWE Intern</span><span>3rd overall · Meta Hackathon</span><span>Winner · McHacks</span><span>Winner · ConUHacks</span>
            <span aria-hidden="true">Shopify · SWE Intern</span><span aria-hidden="true">Meta × MLH · Production Engineering</span><span aria-hidden="true">Bombardier Aerospace · SWE Intern</span><span aria-hidden="true">3rd overall · Meta Hackathon</span><span aria-hidden="true">Winner · McHacks</span><span aria-hidden="true">Winner · ConUHacks</span>
          </div>
        </section>

        <section id="about" style={{ maxWidth: '80rem', margin: '0 auto', padding: 'clamp(4rem,10vw,8rem) 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,26rem),1fr))', gap: 'clamp(2.5rem,5vw,5rem)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <span style={{ fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#6F6F6F' }}>About</span>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: '400', fontSize: 'clamp(2.25rem,4vw,3.5rem)', lineHeight: '1.05', letterSpacing: '-1.4px', color: '#000000' }}>My passions,{' '}<em style={{ fontStyle: 'italic', color: 'rgb(111, 111, 111)' }}>hobbies</em>{' '}and life story.</h2>

            <p style={{ fontSize: '1.0625rem', lineHeight: '1.75', color: '#6F6F6F', maxWidth: '34rem' }}>Outside of work and school I'm usually somewhere with elevation. I am open to many activities, I've completed ultra marathons, long multi-day trekks and challenging winter hikes.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', marginTop: '1rem' }}>
              <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderTop: '1px solid #EEEEEE', transition: 'opacity .2s ease' }}>
                <img src={imgLogo_shopify} alt="Shopify" loading="lazy" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'contain', flexShrink: '0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '.9375rem', fontWeight: '500', color: '#000000' }}>Shopify</span>
                  <span style={{ fontSize: '.8125rem', color: '#6F6F6F' }}>Software Engineer Intern</span>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '.8125rem', color: '#6F6F6F', whiteSpace: 'nowrap' }}>Sept — Dec 2026</span>
              </a>
              <a href="https://fellowship.mlh.io" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderTop: '1px solid #EEEEEE', transition: 'opacity .2s ease' }}>
                <img src={imgLogo_meta} alt="Meta" loading="lazy" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'contain', flexShrink: '0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '.9375rem', fontWeight: '500', color: '#000000' }}>Meta × MLH Fellowship</span>
                  <span style={{ fontSize: '.8125rem', color: '#6F6F6F' }}>Production Engineering Fellow</span>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '.8125rem', color: '#6F6F6F', whiteSpace: 'nowrap' }}>Jun — Sept 2026</span>
              </a>
              <a href="https://www.bombardier.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderTop: '1px solid #EEEEEE', borderBottom: '1px solid #EEEEEE', transition: 'opacity .2s ease' }}>
                <img src={imgLogo_bombardier} alt="Bombardier Aerospace" loading="lazy" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'contain', flexShrink: '0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '.9375rem', fontWeight: '500', color: '#000000' }}>Bombardier Aerospace</span>
                  <span style={{ fontSize: '.8125rem', color: '#6F6F6F' }}>Software Engineer Intern</span>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '.8125rem', color: '#6F6F6F', whiteSpace: 'nowrap' }}>Jan — Aug 2026</span>
              </a>
            </div>
          </div>
          <div style={{ position: 'sticky', top: '2rem', height: 'clamp(24rem,42vw,32rem)', overflow: 'hidden', borderRadius: '2px' }}>
            <img src={imgSalkantay} alt="Salkantay trek, Peru" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </section>

        <section id="work" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.25rem 6rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', paddingBottom: '3rem', borderBottom: '1px solid #EEEEEE' }}>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: '400', fontSize: 'clamp(2.25rem,4vw,3.5rem)', lineHeight: '1', letterSpacing: '-1.4px' }}>Projects</h2>
            <span style={{ fontSize: '.875rem', color: '#6F6F6F', paddingBottom: '.5rem' }}>Seven projects · 2024 — 2026</span>
          </div>



          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,22rem),1fr))', gap: 'clamp(1.5rem,4vw,3rem)', alignItems: 'center', padding: '3.5rem 0', borderBottom: '1px solid #EEEEEE' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
              <div style={{ height: '16rem', overflow: 'hidden', borderRadius: '2px', background: '#F7F7F7' }}><img src={imgOriginal} alt="mtl minted" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
              <div style={{ height: '16rem', overflow: 'hidden', borderRadius: '2px', background: '#F7F7F7' }}><img src={imgOriginal2} alt="mtl minted" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontSize: '.75rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#6F6F6F' }}>Winner · McHacks</span>
              <h3 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: '400', fontSize: '2.25rem', lineHeight: '1.05', letterSpacing: '-1px' }}>mtl minted</h3>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#6F6F6F' }}>A platform for artists to mint and tokenize their identity on Solana, with on-chain ownership handled by custom Anchor programs.</p>
              <span style={{ fontSize: '.8125rem', color: '#6F6F6F' }}>Solana · Rust · Anchor · React</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '.25rem' }}>
                <a href="https://github.com/zaifnatra/solana" target="_blank" rel="noopener noreferrer" style={{ padding: '.45rem 1rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.8125rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">Code on GitHub ↗</a>
                <a href="https://devpost.com/software/black-beauty" target="_blank" rel="noopener noreferrer" style={{ padding: '.45rem 1rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.8125rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">Devpost ↗</a>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,22rem),1fr))', gap: 'clamp(1.5rem,4vw,3rem)', alignItems: 'center', padding: '3.5rem 0', borderBottom: '1px solid #EEEEEE' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontSize: '.75rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#6F6F6F' }}>3rd overall · Meta × MLH</span>
              <h3 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: '400', fontSize: '2.25rem', lineHeight: '1.05', letterSpacing: '-1px' }}>shorten.it</h3>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#6F6F6F' }}>A URL shortener built to survive production, load tests, injected outages, and a live Grafana view of it all holding together.</p>
              <span style={{ fontSize: '.8125rem', color: '#6F6F6F' }}>Flask · Redis · PostgreSQL · Grafana</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '.25rem' }}>
                <a href="https://github.com/zaifnatra/MetaHackathon" target="_blank" rel="noopener noreferrer" style={{ padding: '.45rem 1rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.8125rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">Code on GitHub ↗</a>
                <a href="https://devpost.com/software/shorten-it" target="_blank" rel="noopener noreferrer" style={{ padding: '.45rem 1rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.8125rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">Devpost ↗</a>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
              <div style={{ height: '16rem', overflow: 'hidden', borderRadius: '2px', background: '#F7F7F7' }}><img src={imgScreenShot} alt="shorten.it" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
              <div style={{ height: '16rem', overflow: 'hidden', borderRadius: '2px', background: '#F7F7F7' }}><img src={imgDashboard} alt="shorten.it dashboard" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,22rem),1fr))', gap: 'clamp(1.5rem,4vw,3rem)', alignItems: 'center', padding: '3.5rem 0', borderBottom: '1px solid #EEEEEE' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontSize: '.75rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#6F6F6F' }}>Winner · ConUHacks</span>
              <h3 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: '400', fontSize: '2.25rem', lineHeight: '1.05', letterSpacing: '-1px' }}>retro secrets</h3>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#6F6F6F' }}>Messages hidden in plain sight, steganography with custom encryption, wrapped in a small social platform for passing them around.</p>
              <span style={{ fontSize: '.8125rem', color: '#6F6F6F' }}>Python · TypeScript</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '.25rem' }}>
                <a href="https://github.com/deltag0/ConUHacks" target="_blank" rel="noopener noreferrer" style={{ padding: '.45rem 1rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.8125rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">Code on GitHub ↗</a>
                <a href="https://devpost.com/software/retro-secrets" target="_blank" rel="noopener noreferrer" style={{ padding: '.45rem 1rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.8125rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">Devpost ↗</a>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
              <div style={{ height: '16rem', overflow: 'hidden', borderRadius: '2px', background: '#F7F7F7' }}><img src={imgRetro1} alt="retro secrets" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
              <div style={{ height: '16rem', overflow: 'hidden', borderRadius: '2px', background: '#F7F7F7' }}><img src={imgRetro} alt="retro secrets" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,16rem),1fr))', gap: '2rem', paddingTop: '3.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ height: '13rem', overflow: 'hidden', borderRadius: '2px', background: '#F7F7F7' }}><img src={imgS1} alt="gear pack" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
              <h4 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: '400', fontSize: '1.5rem', letterSpacing: '-.5px' }}>gear pack</h4>
              <p style={{ fontSize: '.9375rem', lineHeight: '1.65', color: '#6F6F6F' }}>Track and share hiking and mountaineering gear across a group of friends.</p>
              <span style={{ fontSize: '.8125rem', color: '#6F6F6F' }}>Next.js · TypeScript · Supabase · Prisma</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: 'auto', paddingTop: '.25rem' }}>
                <a href="https://github.com/zaifnatra/gear-pack" target="_blank" rel="noopener noreferrer" style={{ padding: '.4rem .9rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.78rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">GitHub ↗</a>
                <a href="https://gear-pack.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ padding: '.4rem .9rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.78rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">Live ↗</a>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ height: '13rem', overflow: 'hidden', borderRadius: '2px', background: '#F7F7F7' }}><img src={imgEv} alt="ev prediction model" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
              <h4 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: '400', fontSize: '1.5rem', letterSpacing: '-.5px' }}>ev prediction model</h4>
              <p style={{ fontSize: '.9375rem', lineHeight: '1.65', color: '#6F6F6F' }}>Predicting electric vehicle specs from a trained scikit-learn model, deployed on Streamlit.</p>
              <span style={{ fontSize: '.8125rem', color: '#6F6F6F' }}>Python · scikit-learn · Streamlit</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: 'auto', paddingTop: '.25rem' }}>
                <a href="https://github.com/zaifnatra/ev-ml" target="_blank" rel="noopener noreferrer" style={{ padding: '.4rem .9rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.78rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">GitHub ↗</a>
                <a href="https://ev-prediction-zaifnatra.streamlit.app/" target="_blank" rel="noopener noreferrer" style={{ padding: '.4rem .9rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.78rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">Live ↗</a>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ height: '13rem', overflow: 'hidden', borderRadius: '2px', background: '#F7F7F7' }}><img src={imgHeroes1} alt="heroes journey" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
              <h4 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: '400', fontSize: '1.5rem', letterSpacing: '-.5px' }}>heroes journey</h4>
              <p style={{ fontSize: '.9375rem', lineHeight: '1.65', color: '#6F6F6F' }}>A 2D puzzle adventure through a randomized maze, written from scratch in Java.</p>
              <span style={{ fontSize: '.8125rem', color: '#6F6F6F' }}>Java</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: 'auto', paddingTop: '.25rem' }}>
                <a href="https://github.com/zaifnatra/spaceus" target="_blank" rel="noopener noreferrer" style={{ padding: '.4rem .9rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.78rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">GitHub ↗</a>
                <a href={gameUrl} download style={{ padding: '.4rem .9rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.78rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">Download ↗</a>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ height: '13rem', overflow: 'hidden', borderRadius: '2px', background: '#F7F7F7' }}><img src={imgCampus} alt="campus events" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
              <h4 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: '400', fontSize: '1.5rem', letterSpacing: '-.5px' }}>campus events</h4>
              <p style={{ fontSize: '.9375rem', lineHeight: '1.65', color: '#6F6F6F' }}>Ticketing platform for students to discover, organize and attend events on campus.</p>
              <span style={{ fontSize: '.8125rem', color: '#6F6F6F' }}>JavaScript · MongoDB</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: 'auto', paddingTop: '.25rem' }}>
                <a href="https://github.com/zaifnatra/SOEN341-F25" target="_blank" rel="noopener noreferrer" style={{ padding: '.4rem .9rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.78rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">GitHub ↗</a>
                <a href="https://soen341-f25.onrender.com/" target="_blank" rel="noopener noreferrer" style={{ padding: '.4rem .9rem', border: '1px solid #E4E4E4', borderRadius: '999px', fontSize: '.78rem', whiteSpace: 'nowrap', color: '#000000', transition: 'background .2s ease,color .2s ease' }} className="chip">Live ↗</a>
              </div>
            </div>
          </div>
        </section>

        <section id="outside" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.25rem clamp(4rem,10vw,8rem) 1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' }}>
            <span style={{ fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#6F6F6F' }}>Outside</span>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: '400', fontSize: 'clamp(2.25rem,4vw,3.5rem)', lineHeight: '1.05', letterSpacing: '-1.4px' }}>Away from the{' '}<em style={{ fontStyle: 'italic', color: 'rgb(111, 111, 111)' }}>screen.</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,18rem),1fr))', gap: '1rem' }}>
            <div style={{ height: 'clamp(16rem,26vw,22rem)', overflow: 'hidden', borderRadius: '2px', background: '#F7F7F7' }}><img src={imgUltra} alt="Backyard ultra" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
            <div style={{ height: 'clamp(16rem,26vw,22rem)', overflow: 'hidden', borderRadius: '2px', background: '#F7F7F7' }}><img src={imgCat} alt="Adirondacks" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
            <div style={{ height: 'clamp(16rem,26vw,22rem)', overflow: 'hidden', borderRadius: '2px', background: '#F7F7F7' }}><img src={imgGolf} alt="Golf" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
          </div>
        </section>

        <section id="contact" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.25rem clamp(4rem,10vw,8rem) 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,24rem),1fr))', gap: 'clamp(2.5rem,5vw,5rem)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <span style={{ fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#6F6F6F' }}>Reach me</span>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontWeight: '400', fontSize: 'clamp(2.25rem,4.5vw,3.75rem)', lineHeight: '1.02', letterSpacing: '-1.6px' }}>Let's connect or build something{' '}<em style={{ fontStyle: 'italic', color: 'rgb(111, 111, 111)' }}>together.</em></h2>
            <p style={{ fontSize: '1.0625rem', lineHeight: '1.75', color: '#6F6F6F', maxWidth: '30rem' }}>Open to internships, side projects, and anything outdoors. I answer email quickly.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '.5rem' }}>
              <a href="mailto:huzaifafareed817@gmail.com" style={{ borderRadius: '999px', padding: '1.125rem 2.5rem', fontSize: '1rem', background: '#000000', color: '#FFFFFF', transition: 'transform .25s ease' }} className="btn">Email me</a>
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" style={{ borderRadius: '999px', padding: '1.125rem 2.5rem', fontSize: '1rem', color: '#000000', border: '1px solid #E4E4E4', transition: 'transform .25s ease' }} className="btn">View CV</a>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', padding: '1.5rem 0', borderTop: '1px solid #EEEEEE' }}>
              <span style={{ fontSize: '.75rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#6F6F6F' }}>Email</span>
              <a href="mailto:huzaifafareed817@gmail.com" style={{ fontSize: 'clamp(.9375rem,2.5vw,1.125rem)', color: '#000000', overflowWrap: 'anywhere', textAlign: 'right' }}>huzaifafareed817@gmail.com</a>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', padding: '1.5rem 0', borderTop: '1px solid #EEEEEE' }}>
              <span style={{ fontSize: '.75rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#6F6F6F' }}>LinkedIn</span>
              <a href="https://linkedin.com/in/huzaifa-fareed" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.125rem', color: '#000000' }}>huzaifa-fareed</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', padding: '1.5rem 0', borderTop: '1px solid #EEEEEE', borderBottom: '1px solid #EEEEEE' }}>
              <span style={{ fontSize: '.75rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#6F6F6F' }}>GitHub</span>
              <a href="https://github.com/zaifnatra" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.125rem', color: '#000000' }}>zaifnatra</a>
            </div>
          </div>
        </section>

        <footer style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #EEEEEE' }}>
          <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: '1.25rem' }}>huzaifa<sup style={{ fontSize: '.5em', verticalAlign: 'super' }}>®</sup></span>
          <span style={{ fontSize: '.8125rem', color: '#6F6F6F' }}>Montréal · 2026</span>
        </footer>
      </div>
  );
}
