import React from 'react';

// PUBLIC_INTERFACE
export default function Header() {
  /** App header with brand and simple action placeholder */
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand" role="banner" aria-label="Personal Notes Manager">
          <div className="brand-badge" aria-hidden>✦</div>
          <div className="brand-title">Personal Notes Manager</div>
        </div>
        <div className="header-actions" />
      </div>
    </header>
  );
}
