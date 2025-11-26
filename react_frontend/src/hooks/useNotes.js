import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { getApiClient } from '../services/api';

/**
 * Note type:
 * { id: string; title: string; content: string; updatedAt: string }
 */

const NotesContext = createContext(null);

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  const api = useMemo(() => getApiClient(), []);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load notes either from API or localStorage
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (api) {
          data = await api.listNotes();
        } else {
          const raw = localStorage.getItem('notes');
          data = raw ? JSON.parse(raw) : [];
        }
        if (!cancelled) setNotes(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load notes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [api]);

  const persistLocal = (next) => {
    localStorage.setItem('notes', JSON.stringify(next));
  };

  // PUBLIC_INTERFACE
  const createNote = useCallback(async ({ title = 'Untitled', content = '' }) => {
    const now = new Date().toISOString();
    const newNote = { id: nanoid(), title, content, updatedAt: now };
    if (api) {
      const created = await api.createNote({ title, content });
      setNotes(prev => {
        const next = [created, ...prev];
        return next;
      });
      return created;
    } else {
      setNotes(prev => {
        const next = [newNote, ...prev];
        persistLocal(next);
        return next;
      });
      return newNote;
    }
  }, [api]);

  // PUBLIC_INTERFACE
  const updateNote = useCallback(async (note) => {
    const updated = { ...note, updatedAt: new Date().toISOString() };
    if (api) {
      const saved = await api.updateNote(updated.id, { title: updated.title, content: updated.content });
      setNotes(prev => prev.map(n => (n.id === saved.id ? saved : n)));
      return saved;
    } else {
      setNotes(prev => {
        const next = prev.map(n => (n.id === updated.id ? updated : n));
        persistLocal(next);
        return next;
      });
      return updated;
    }
  }, [api]);

  // PUBLIC_INTERFACE
  const deleteNote = useCallback(async (id) => {
    if (api) {
      await api.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } else {
      setNotes(prev => {
        const next = prev.filter(n => n.id !== id);
        persistLocal(next);
        return next;
      });
    }
  }, [api]);

  const value = useMemo(() => ({
    notes, loading, error, createNote, updateNote, deleteNote
  }), [notes, loading, error, createNote, updateNote, deleteNote]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useNotes() {
  /**
   * Hook to access notes context.
   */
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
