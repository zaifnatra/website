import heroes1 from '../assets/heroes1.jpg';
import heroes2 from '../assets/heroes2.jpg';
import campus from '../assets/campus.jpg';
import ev from '../assets/ev.png';
import s1 from '../assets/S1.jpg';
import s2 from '../assets/S2jpg';
const Project = ({ title, desc, stack, images, githubLink, downloadLink, liveLink }) => (
    <div style={{
        padding: '2rem',
        border: '1px solid #eee',
        marginBottom: '2rem',
        transition: 'all 0.3s ease',
        backgroundColor: '#fff'
    }}
        className="project-card"
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{title}</h3>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {githubLink && (
                    <a href={githubLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', textDecoration: 'underline', cursor: 'pointer' }}>
                        view code
                    </a>
                )}
                {downloadLink && (
                    <a href={downloadLink} download style={{
                        fontSize: '0.9rem',
                        padding: '4px 12px',
                        background: '#000',
                        color: '#fff',
                        borderRadius: '4px',
                        textDecoration: 'none'
                    }}>
                        download game
                    </a>
                )}
                {liveLink && (
                    <a href={liveLink} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: '0.9rem',
                        padding: '4px 12px',
                        background: '#000',
                        color: '#fff',
                        borderRadius: '4px',
                        textDecoration: 'none'
                    }}>
                        visit site
                    </a>
                )}
            </div>
        </div>

        <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.6' }}>{desc}</p>

        {
            images && images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: images.length > 1 ? '1fr 1fr' : '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    {images.map((img, index) => (
                        <div key={index} style={{ overflow: 'hidden', borderRadius: '4px', border: '1px solid #eee' }}>
                            <img src={img} alt={`${title} screenshot ${index + 1}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>
                    ))}
                </div>
            )
        }

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {stack.map((tech) => (
                <span key={tech} style={{
                    background: '#f5f5f5',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    color: '#333'
                }}>
                    {tech}
                </span>
            ))}
        </div>
    </div >
);

const Projects = ({ id }) => {
    const projects = [
        {
            title: 'gear pack',
            desc: 'a web app where friends can track&store their hiking/mountaineering gear among friends',
            stack: ['react, next.js, typescript, tailwind css, supabase, prisma '],
            images: [s1, s2],
            githubLink: 'https://github.com/zaifnatra/gear-pack',
            liveLink: 'https://gear-pack.vercel.app/'

        },
        {
            title: 'ev prediction model',
            desc: 'machine learning model to predict electric vehicle details. built with python and scikit-learn, deployed on streamlit.',
            stack: ['python', 'streamlit', 'scikit-learn'],
            images: [ev],
            githubLink: 'https://github.com/zaifnatra/ev-ml',
            liveLink: 'https://ev-prediction-zaifnatra.streamlit.app/'
        },
        {
            title: 'heroes journey',
            desc: '2d puzzle adventure game where you navigate through a randomized maze with obstacles. built from scratch in java.',
            stack: ['java'],
            images: [heroes1, heroes2],
            githubLink: 'https://github.com/zaifnatra/spaceus',
            downloadLink: '/game.jar'
        },
        {
            title: 'campus events ticketing platform',
            desc: 'an application allows students to discover, organize, and attend events on campus. features user profiles, event creation, and ticket management.',
            stack: ['html', 'css', 'javascript', 'mongodb'],
            images: [campus],
            githubLink: 'https://github.com/zaifnatra/SOEN341-F25',
            liveLink: 'https://soen341-f25.onrender.com/'
        },

    ];

    return (
        <div id={id} style={{ scrollMarginTop: '100px', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '3rem', letterSpacing: '-1px' }}>projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0' }}>
                {projects.map((p) => (
                    <Project key={p.title} {...p} />
                ))}
            </div>
        </div>
    );
};

export default Projects;
