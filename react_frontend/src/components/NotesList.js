import React, { useMemo, useState } from 'react';
import SearchBar from './SearchBar';
import NoteItem from './NoteItem';

/**
 * PUBLIC_INTERFACE
 * NotesList renders searchable list of notes.
 */
export default function NotesList({ notes, loading, error, selectedId, onSelect }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.content || '').toLowerCase().includes(q)
    );
  }, [notes, query]);

  return (
    <div>
      <div className="list-header">
        <SearchBar query={query} onChange={setQuery} />
      </div>
      {loading && <div className="status">Loading notes…</div>}
      {error && <div className="status" style={{ color: 'var(--color-error)' }}>{String(error)}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="status">No notes found. Create a new one!</div>
      )}
      <ul className="notes-list">
        {filtered.map(n => (
          <NoteItem
            key={n.id}
            note={n}
            isActive={selectedId === n.id}
            onClick={onSelect}
          />
        ))}
      </ul>
    </div>
  );
}
