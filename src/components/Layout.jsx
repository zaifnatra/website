import Navigation from './Navigation';

const Layout = ({ children }) => {

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navigation />
            <main style={{
                flex: 1,
                padding: '8rem 2rem 4rem 2rem', // More top padding for nav
                maxWidth: '900px',
                margin: '0 auto',
                width: '100%'
            }} className="fade-in">
                {children}
            </main>
        </div>
    );
};

export default Layout;
