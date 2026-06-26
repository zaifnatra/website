const experiences = [
    {
        company: 'Shopify',
        role: 'Software Engineer Intern',
        dates: 'Sept 2026 – Jan 2027',
        logo: 'https://logo.clearbit.com/shopify.com',
        url: 'https://www.shopify.com',
    },
    {
        company: 'Meta × MLH Fellowship',
        role: 'Production Engineering Fellow',
        dates: 'June 2026 – Sept 2026',
        logo: 'https://logo.clearbit.com/meta.com',
        url: 'https://fellowship.mlh.io',
    },
    {
        company: 'Bombardier Aerospace',
        role: 'Software Engineer Intern',
        dates: 'Jan 2026 – Aug 2026',
        logo: 'https://logo.clearbit.com/bombardier.com',
        url: 'https://www.bombardier.com',
    },
];

const Home = ({ id }) => {
    return (
        <div id={id} style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            scrollMarginTop: '100px'
        }}>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-3px', lineHeight: '1.1' }}>
                huzaifa fareed
            </h1>
            <p style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#666', fontWeight: '300' }}>
                software engineering student
            </p>

            <div style={{
                marginTop: '3rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                alignItems: 'flex-start',
            }}>
                {experiences.map((exp, i) => (
                    <a
                        key={i}
                        href={exp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.85rem',
                            textDecoration: 'none',
                            color: 'inherit',
                            padding: '0.6rem 0.85rem',
                            borderRadius: '8px',
                            transition: 'background 0.15s ease',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <img
                            src={exp.logo}
                            alt={exp.company}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '6px',
                                objectFit: 'contain',
                                border: '1px solid #e8e8e8',
                                background: '#fff',
                                flexShrink: 0,
                            }}
                            onError={e => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: '600', lineHeight: '1.2' }}>{exp.company}</div>
                            <div style={{ fontSize: '0.82rem', color: '#666', marginTop: '1px' }}>
                                {exp.role} · {exp.dates}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Home;
