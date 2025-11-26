import React, { useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Editor for viewing/editing a note. If no note selected, shows empty state and create button.
 */
export default function Editor({ note, onSave, onDelete, onCreate }) {
  const isNew = useMemo(() => !note, [note]);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setTouched(false);
  }, [note?.id]);

  const invalid = touched && !title.trim();

  const handleSave = async () => {
    setTouched(true);
    if (!title.trim()) return;
    if (!note) return; // nothing to save if no note selected
    setSaving(true);
    try {
      await onSave({ ...note, title: title.trim(), content });
    } finally {
      setSaving(false);
    }
  };

  if (!note) {
    return (
      <div className="status" style={{ padding: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Welcome</div>
        <div style={{ marginBottom: 16, color: '#6b7280' }}>
          Select a note from the list or create a new note to get started.
        </div>
        <button className="btn" onClick={onCreate}>Create Note</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="editor-header">
        <input
          className={`input-title ${invalid ? 'error' : ''}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          onBlur={() => setTouched(true)}
          aria-invalid={invalid}
          aria-describedby="title-help"
        />
        <div className="row">
          <button className="btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button className="btn danger" onClick={() => onDelete(note.id)}>
            Delete
          </button>
        </div>
      </div>
      <div className="editor-content">
        <textarea
          className="textarea"
          placeholder="Start writing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div id="title-help" className="helper">
          {invalid ? 'Title is required.' : 'Your changes are saved when you click Save.'}
        </div>
      </div>
    </div>
  );
}
