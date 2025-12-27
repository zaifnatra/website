

const Navigation = () => {
  const links = [
    { path: '#home', label: 'home' },
    { path: '#about', label: 'about' },
    { path: '#projects', label: 'projects' },
    { path: '#contact', label: 'contact' },
  ];

  const handleScroll = (e, path) => {
    e.preventDefault();
    const element = document.querySelector(path);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      padding: '2rem',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '2rem',
      zIndex: 100,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(5px)'
    }}>
      {links.map((link) => (
        <a
          key={link.path}
          href={link.path}
          onClick={(e) => handleScroll(e, link.path)}
          style={{
            fontSize: '1rem',
            fontWeight: '400',
            textDecoration: 'none',
            color: '#000',
            cursor: 'pointer'
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};

export default Navigation;
