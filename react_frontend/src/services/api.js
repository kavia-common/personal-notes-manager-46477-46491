const getBaseUrl = () => {
  const a = process.env.REACT_APP_API_BASE;
  const b = process.env.REACT_APP_BACKEND_URL;
  const base = (a && a.trim()) || (b && b.trim()) || '';
  return base || null;
};

/**
 * PUBLIC_INTERFACE
 * Returns API client if env is configured; otherwise returns null and caller should use localStorage fallback.
 */
export function getApiClient() {
  const base = getBaseUrl();
  if (!base) return null;

  const baseUrl = base.replace(/\/+$/, '');

  const headers = {
    'Content-Type': 'application/json'
  };

  const handle = async (res) => {
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`API error ${res.status}: ${text || res.statusText}`);
    }
    if (res.status === 204) return null;
    return res.json();
  };

  return {
    async listNotes() {
      const res = await fetch(`${baseUrl}/notes`, { headers });
      return handle(res);
    },
    async getNote(id) {
      const res = await fetch(`${baseUrl}/notes/${encodeURIComponent(id)}`, { headers });
      return handle(res);
    },
    async createNote({ title, content }) {
      const res = await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ title, content })
      });
      return handle(res);
    },
    async updateNote(id, { title, content }) {
      const res = await fetch(`${baseUrl}/notes/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ title, content })
      });
      return handle(res);
    },
    async deleteNote(id) {
      const res = await fetch(`${baseUrl}/notes/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers
      });
      return handle(res);
    }
  };
}
