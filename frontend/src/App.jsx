import { useEffect, useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";

const API_BASE = "http://localhost:8080";

export default function App() {
  const auth = useAuth();

  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notesError, setNotesError] = useState(null);

  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);

  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [calling, setCalling] = useState(false);

  const username =
    auth.user?.profile?.preferred_username ||
    auth.user?.profile?.email ||
    "user";

  const initials = useMemo(() => {
    const parts = String(username).split(/[.@\s_-]+/).filter(Boolean);
    const a = parts[0]?.[0] || "U";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  }, [username]);

  const token = auth.user?.access_token;

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #fafafa 0%, #f3f4f6 100%)",
      padding: "38px 16px",
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      color: "#111827",
    },
    container: { maxWidth: 980, margin: "0 auto" },
    headerRow: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 18,
    },
    title: { fontSize: 34, fontWeight: 900, letterSpacing: "-0.02em" },
    subtitle: { marginTop: 6, color: "#6b7280", lineHeight: 1.5 },
    pill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: 12,
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #e5e7eb",
      background: "#f9fafb",
      color: "#374151",
      width: "fit-content",
      whiteSpace: "nowrap",
    },
    dot: (color) => ({
      width: 8,
      height: 8,
      borderRadius: 999,
      background: color,
      display: "inline-block",
    }),
    card: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 18,
      boxShadow: "0 6px 18px rgba(17,24,39,0.06)",
      padding: 18,
    },
    hero: {
      display: "grid",
      gridTemplateColumns: "1.25fr 0.75fr",
      gap: 16,
      alignItems: "stretch",
    },
    heroLeft: {
      padding: 18,
      borderRadius: 14,
      border: "1px solid #e5e7eb",
      background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
    },
    heroRight: {
      padding: 18,
      borderRadius: 14,
      border: "1px solid #e5e7eb",
      background: "#fff",
    },
    row: { display: "flex", alignItems: "center", gap: 12 },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 999,
      display: "grid",
      placeItems: "center",
      background: "#111827",
      color: "#fff",
      fontWeight: 900,
      letterSpacing: "0.02em",
      flex: "0 0 auto",
    },
    small: { fontSize: 12, color: "#6b7280", lineHeight: 1.5 },
    sectionTitle: { fontSize: 14, fontWeight: 900, marginBottom: 8 },
    divider: { height: 1, background: "#e5e7eb", margin: "14px 0" },
    btn: (variant = "primary") => {
      const base = {
        borderRadius: 12,
        padding: "10px 14px",
        fontWeight: 800,
        border: "1px solid transparent",
        cursor: "pointer",
        transition: "transform 0.04s ease, box-shadow 0.12s ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        userSelect: "none",
      };
      const variants = {
        primary: {
          background: "#111827",
          color: "#fff",
          boxShadow: "0 8px 18px rgba(17,24,39,0.18)",
        },
        secondary: {
          background: "#fff",
          color: "#111827",
          border: "1px solid #e5e7eb",
        },
        danger: {
          background: "#fff",
          color: "#b91c1c",
          border: "1px solid #fecaca",
        },
      };
      return { ...base, ...variants[variant] };
    },
    btnRow: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 },

    // Notes UI
    appGrid: {
      display: "grid",
      gridTemplateColumns: "1.2fr 0.8fr",
      gap: 16,
      marginTop: 16,
    },
    notesCard: {
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      padding: 16,
      background: "#fff",
    },
    input: {
      width: "100%",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      padding: "12px 12px",
      outline: "none",
      fontSize: 14,
    },
    textarea: {
      width: "100%",
      minHeight: 92,
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      padding: "12px 12px",
      outline: "none",
      fontSize: 14,
      resize: "vertical",
      lineHeight: 1.4,
    },
    noteList: {
      marginTop: 12,
      display: "grid",
      gap: 10,
    },
    noteItem: {
      border: "1px solid #e5e7eb",
      borderRadius: 14,
      padding: 12,
      background: "#fafafa",
    },
    noteText: { whiteSpace: "pre-wrap", wordBreak: "break-word", marginTop: 6 },
    noteMeta: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      color: "#6b7280",
      fontSize: 12,
    },
    tag: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 8px",
      borderRadius: 999,
      border: "1px solid #e5e7eb",
      background: "#fff",
      color: "#374151",
      fontSize: 12,
      fontWeight: 700,
    },

    codeBox: {
      background: "#0b1020",
      color: "#e5e7eb",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14,
      padding: 14,
      overflowX: "auto",
      fontSize: 12,
      lineHeight: 1.5,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    },
    statusCard: (ok) => ({
      borderRadius: 14,
      padding: 12,
      border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`,
      background: ok ? "#f0fdf4" : "#fef2f2",
      color: ok ? "#166534" : "#991b1b",
      fontWeight: 800,
      fontSize: 13,
      marginTop: 12,
    }),
  };

  function copy(text) {
    if (!text) return;
    navigator.clipboard.writeText(text);
  }

  async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || `Request failed (${res.status})`);
    }
    return data;
  }

  async function loadNotes() {
    if (!token) return;
    setLoadingNotes(true);
    setNotesError(null);
    try {
      const data = await apiFetch("/api/notes", { method: "GET" });
      setNotes(data.notes || []);
    } catch (e) {
      setNotesError(e.message);
    } finally {
      setLoadingNotes(false);
    }
  }

  async function addNote() {
    const text = newNote.trim();
    if (!text) return;

    setSaving(true);
    setNotesError(null);
    try {
      const data = await apiFetch("/api/notes", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      // Optimistic update: add new note on top
      setNotes((prev) => [data.created, ...prev]);
      setNewNote("");
    } catch (e) {
      setNotesError(e.message);
    } finally {
      setSaving(false);
    }
  }

  function deleteNoteLocal(id) {
    // optional (local delete). Real delete would need backend endpoint.
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  async function callProtectedApi() {
    setCalling(true);
    setApiError(null);
    setApiResult(null);
    try {
      const data = await apiFetch("/api/ping", { method: "GET" });
      setApiResult(data);
    } catch (e) {
      setApiError(e.message);
    } finally {
      setCalling(false);
    }
  }

  // Load notes after login (token becomes available)
  useEffect(() => {
    if (auth.isAuthenticated && token) {
      loadNotes();
    } else {
      setNotes([]);
      setNewNote("");
      setApiResult(null);
      setApiError(null);
      setNotesError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated, token]);

  if (auth.isLoading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.pill}>
              <span style={styles.dot("#f59e0b")} /> Loading authentication…
            </div>
            <div style={{ marginTop: 10, fontWeight: 900, fontSize: 18 }}>
              Checking your session
            </div>
            <div style={styles.small}>
              If this takes too long, clear site data for localhost and try again.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.pill}>
              <span style={styles.dot("#ef4444")} /> Auth error
            </div>
            <div style={{ marginTop: 10, fontWeight: 900, fontSize: 18 }}>
              {auth.error.message}
            </div>
            <div style={styles.btnRow}>
              <button style={styles.btn("secondary")} onClick={() => window.location.reload()}>
                Reload
              </button>
              <button style={styles.btn("primary")} onClick={() => auth.signinRedirect()}>
                Try Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <div style={styles.title}>OIDC Notes</div>
            <div style={styles.subtitle}>
              Keycloak OIDC login + OAuth2 protected Notes API + Terraform-managed setup.
            </div>
          </div>

          <div style={styles.pill}>
            <span style={styles.dot(auth.isAuthenticated ? "#22c55e" : "#9ca3af")} />
            {auth.isAuthenticated ? "Authenticated" : "Signed out"}
          </div>
        </div>

        <div style={styles.card}>
          {!auth.isAuthenticated ? (
            <div style={styles.hero}>
              <div style={styles.heroLeft}>
                <div style={{ fontSize: 18, fontWeight: 900 }}>
                  A real Notes app demo (OIDC + JWT)
                </div>
                <div style={{ marginTop: 8, ...styles.small }}>
                  Login via Keycloak using Authorization Code Flow with PKCE.
                  Your backend APIs require an OAuth2 access token.
                </div>

                <div style={styles.btnRow}>
                  <button style={styles.btn("primary")} onClick={() => auth.signinRedirect()}>
                    🔐 Login with Keycloak
                  </button>
                </div>
              </div>

              <div style={styles.heroRight}>
                <div style={styles.sectionTitle}>Quick links</div>
                <div style={styles.small}>
                  <div>Keycloak Admin: <b>http://localhost:8081</b></div>
                  <div>Backend Health: <b>http://localhost:8080/health</b></div>
                </div>
                <div style={styles.divider} />
                <div style={styles.sectionTitle}>What you can show</div>
                <div style={styles.small}>
                  ✅ OIDC login <br />
                  ✅ JWT access token <br />
                  ✅ Notes API protected by JWT verification (JWKS) <br />
                  ✅ Terraform-managed Keycloak configuration
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Top authenticated header */}
              <div style={styles.row}>
                <div style={styles.avatar}>{initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>{username}</div>
                  <div style={styles.small}>
                    issuer: <b>{auth.user?.profile?.iss}</b>
                  </div>
                </div>

                <button style={styles.btn("danger")} onClick={() => auth.signoutRedirect()}>
                  Logout
                </button>
              </div>

              {/* Main app grid */}
              <div style={styles.appGrid}>
                {/* Notes */}
                <div style={styles.notesCard}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 16, fontWeight: 900 }}>My Notes</div>
                    <div style={styles.tag}>🔒 Protected</div>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <textarea
                      style={styles.textarea}
                      placeholder="Write a note… (press Cmd+Enter to save)"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") addNote();
                      }}
                    />
                    <div style={styles.btnRow}>
                      <button style={styles.btn("primary")} onClick={addNote} disabled={saving}>
                        {saving ? "Saving…" : "➕ Add Note"}
                      </button>
                      <button style={styles.btn("secondary")} onClick={loadNotes} disabled={loadingNotes}>
                        {loadingNotes ? "Refreshing…" : "↻ Refresh"}
                      </button>
                    </div>
                    {notesError && <div style={styles.statusCard(false)}>Notes error: {notesError}</div>}
                  </div>

                  <div style={styles.divider} />

                  {loadingNotes ? (
                    <div style={styles.small}>Loading notes…</div>
                  ) : notes.length === 0 ? (
                    <div style={styles.small}>
                      No notes yet. Add your first note above. 👆
                    </div>
                  ) : (
                    <div style={styles.noteList}>
                      {notes
                        .slice()
                        .reverse() // newest on top if backend appends
                        .map((n) => (
                          <div key={n.id} style={styles.noteItem}>
                            <div style={styles.noteMeta}>
                              <span>id: <b>{n.id}</b></span>
                              <button
                                style={styles.btn("secondary")}
                                onClick={() => deleteNoteLocal(n.id)}
                                title="Local delete (optional)"
                              >
                                🗑️ Remove
                              </button>
                            </div>
                            <div style={styles.noteText}>{n.text}</div>
                          </div>
                        ))}
                    </div>
                  )}
                  <div style={{ marginTop: 10, ...styles.small }}>
                    Notes are stored per-user using your token’s <b>sub</b> claim.
                  </div>
                </div>

                {/* Developer panel */}
                <div style={styles.notesCard}>
                  <div style={{ fontSize: 16, fontWeight: 900 }}>Developer Panel</div>
                  <div style={{ marginTop: 8, ...styles.small }}>
                    Useful for demoing OAuth2 + JWT validation.
                  </div>

                  <div style={styles.btnRow}>
                    <button style={styles.btn("primary")} onClick={callProtectedApi} disabled={calling}>
                      {calling ? "Calling…" : "✅ Call /api/ping"}
                    </button>
                    <button style={styles.btn("secondary")} onClick={() => copy(token)}>
                      📋 Copy Access Token
                    </button>
                  </div>

                  {apiResult && <div style={styles.statusCard(true)}>API success: {JSON.stringify(apiResult)}</div>}
                  {apiError && <div style={styles.statusCard(false)}>API error: {apiError}</div>}

                  <div style={styles.divider} />

                  <details open>
                    <summary style={{ cursor: "pointer", fontWeight: 900, marginBottom: 8 }}>
                      ID Token Claims
                    </summary>
                    <div style={styles.codeBox}>
                      {JSON.stringify(auth.user?.profile, null, 2)}
                    </div>
                  </details>

                  <details style={{ marginTop: 10 }}>
                    <summary style={{ cursor: "pointer", fontWeight: 900, marginBottom: 8 }}>
                      Access Token (JWT)
                    </summary>
                    <div style={styles.codeBox}>{token}</div>
                  </details>

                  <div style={{ marginTop: 12, ...styles.small }}>
                    Backend validates this JWT via Keycloak JWKS:
                    <div>
                      <b>{auth.user?.profile?.iss}/protocol/openid-connect/certs</b>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
