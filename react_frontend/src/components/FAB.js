import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Floating Action Button to trigger primary actions.
 */
export default function FAB({ onClick, label = 'New' }) {
  return (
    <button className="fab" onClick={onClick} aria-label="Create new note">
      + {label}
    </button>
  );
}
