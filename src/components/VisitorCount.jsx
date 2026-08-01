import { useEffect, useRef, useState } from 'react';

// counterapi.dev is a free keyed counter with no signup, which is the only way
// to keep a running total on GitHub Pages (no server, no build-time state).
const ENDPOINT = 'https://api.counterapi.dev/v1/huzaifa-fareed-portfolio/visits';
const SESSION_KEY = 'visit-counted';

// sessionStorage throws in some privacy modes, so never let it break the render
function readSession(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* counting twice is better than crashing */
  }
}

export default function VisitorCount() {
  const [count, setCount] = useState(null);
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return; // StrictMode runs effects twice in dev
    requested.current = true;

    // one increment per browser session - a refresh only reads the total back
    const alreadyCounted = readSession(SESSION_KEY) === '1';
    const controller = new AbortController();

    fetch(alreadyCounted ? `${ENDPOINT}/` : `${ENDPOINT}/up`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.status))))
      .then((data) => {
        writeSession(SESSION_KEY, '1');
        if (typeof data.count === 'number') setCount(data.count);
      })
      .catch(() => {
        /* show nothing rather than a broken counter */
      });

    return () => controller.abort();
  }, []);

  if (count === null) return null;

  return (
    <span className="visitor-count" title="Total visits to this site">
      <span className="visitor-dot" aria-hidden="true"></span>
      <b>{count.toLocaleString()}</b> {count === 1 ? 'visit' : 'visits'}
    </span>
  );
}
