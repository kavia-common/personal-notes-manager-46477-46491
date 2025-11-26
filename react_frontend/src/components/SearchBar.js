import React from 'react';

/**
 * PUBLIC_INTERFACE
 * SearchBar input for filtering notes.
 */
export default function SearchBar({ query, onChange, placeholder = 'Search notes...' }) {
  return (
    <input
      className="search-input"
      type="search"
      value={query}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label="Search notes"
    />
  );
}
