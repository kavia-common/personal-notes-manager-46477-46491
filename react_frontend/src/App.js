import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import './styles/theme.css';
import Header from './components/Header';
import NotesList from './components/NotesList';
import Editor from './components/Editor';
import FAB from './components/FAB';
import { NotesProvider, useNotes } from './hooks/useNotes';

/**
 * Layout with sidebar and editor area
 */
function NotesLayout() {
  const { notes, createNote, deleteNote, updateNote, loading, error } = useNotes();
  const navigate = useNavigate();
  const { id } = useParams();

  const onCreate = async () => {
    const newNote = await createNote({ title: 'Untitled', content: '' });
    navigate(`/notes/${newNote.id}`);
  };

  const onSelect = (noteId) => navigate(`/notes/${noteId}`);

  const selected = notes.find(n => n.id === id) || null;

  return (
    <div className="app-root">
      <Header />
      <div className="app-body">
        <aside className="sidebar" aria-label="Notes list">
          <NotesList
            notes={notes}
            loading={loading}
            error={error}
            selectedId={id || ''}
            onSelect={onSelect}
          />
        </aside>
        <main className="editor-area" aria-label="Editor">
          <Editor
            note={selected}
            onSave={updateNote}
            onDelete={async (noteId) => {
              await deleteNote(noteId);
              navigate('/notes');
            }}
            onCreate={onCreate}
          />
        </main>
      </div>
      <FAB label="New" onClick={onCreate} />
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root of Notes app with provider and router */
  return (
    <NotesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/notes" element={<NotesLayout />}>
            <Route path=":id" element={<NotesLayout />} />
          </Route>
          <Route path="/notes/:id" element={<NotesLayout />} />
          <Route path="*" element={<Navigate to="/notes" replace />} />
        </Routes>
      </Router>
    </NotesProvider>
  );
}

export default App;
