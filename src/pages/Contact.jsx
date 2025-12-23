const Contact = () => {
    return (
        <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '3rem', letterSpacing: '-1px' }}>contact</h2>

            <div style={{ maxWidth: '600px' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: '#444' }}>
                    if you'd like to work together or have any questions, feel free to reach out to me.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>email</span>
                        <a href="mailto:huzaifafareed817@gmail.com" style={{ fontSize: '1.5rem', fontWeight: '500' }}>huzaifafareed817@gmail.com</a>
                    </div>

                    <div>
                        <span style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>phone</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: '500' }}>438-408-4502</span>
                    </div>

                    <div>
                        <span style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>socials</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <a href="https://linkedin.com/in/huzaifa-fareed" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.5rem', fontWeight: '500' }}>linkedin</a>
                            <a href="https://github.com/zaifnatra" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.5rem', fontWeight: '500' }}>github</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
