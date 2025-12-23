const Home = () => {
    return (
        <div style={{
            height: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-3px', lineHeight: '1.1' }}>
                huzaifa fareed
            </h1>
            <p style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#666', fontWeight: '300' }}>
                software engineering student
            </p>
        </div>
    );
};

export default Home;
