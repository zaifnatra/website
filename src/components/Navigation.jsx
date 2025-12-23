import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const links = [
    { path: '/', label: 'home' },
    { path: '/about', label: 'about' },
    { path: '/projects', label: 'projects' },
    { path: '/contact', label: 'contact' },
  ];

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
      backdropFilter: 'blur(5px)' // Subtle blur
    }}>
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          style={{
            fontSize: '1rem',
            fontWeight: location.pathname === link.path ? '600' : '400',
            textDecoration: location.pathname === link.path ? 'underline' : 'none',
            textUnderlineOffset: '6px',
            color: '#000'
          }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
