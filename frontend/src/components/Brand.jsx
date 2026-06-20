import { Link } from 'react-router-dom';

export default function Brand({ light = false, compact = false }) {
  return (
    <Link to="/" className={`brand ${light ? 'brand--light' : ''}`} aria-label="PitchPerfect home">
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><path d="M6 17V7.8C6 6.8 6.8 6 7.8 6H13a4 4 0 0 1 0 8H9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><path d="m14.5 17 2 2 3.5-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      {!compact && <span>PitchPerfect</span>}
    </Link>
  );
}
