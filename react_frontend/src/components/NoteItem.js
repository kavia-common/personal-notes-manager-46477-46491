import React from 'react';

/**
 * PUBLIC_INTERFACE
 * NoteItem shows a single note row.
 */
export default function NoteItem({ note, isActive, onClick }) {
  return (
    <li
      className={`note-item ${isActive ? 'active' : ''}`}
      onClick={() => onClick(note.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(note.id)}
      aria-current={isActive ? 'true' : 'false'}
      aria-label={`Open note ${note.title || 'Untitled'}`}
    >
      <div className="note-title">{note.title || 'Untitled'}</div>
      <div className="note-meta">{new Date(note.updatedAt).toLocaleString()}</div>
    </li>
  );
}
