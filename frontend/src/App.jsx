import { useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";

export default function App() {
  const auth = useAuth();
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

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #fafafa 0%, #f3f4f6 100%)",
      padding: "40px 16px",
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      color: "#111827",
    },
    container: {
      maxWidth: 920,
      margin: "0 auto",
    },
    headerRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 18,
    },
    title: { fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" },
    subtitle: { marginTop: 6, color: "#6b7280", lineHeight: 1.5 },
    card: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 16,
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
      fontWeight: 800,
      letterSpacing: "0.02em",
      flex: "0 0 auto",
    },
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
    },
    dot: (color) => ({
      width: 8,
      height: 8,
      borderRadius: 999,
      background: color,
      display: "inline-block",
    }),
    btn: (variant = "primary") => {
      const base = {
        borderRadius: 12,
        padding: "10px 14px",
        fontWeight: 700,
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
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 },
    sectionTitle: { fontSize: 14, fontWeight: 800, marginBottom: 8, color: "#111827" },
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
    small: { fontSize: 12, color: "#6b7280", lineHeight: 1.5 },
    divider: { height: 1, background: "#e5e7eb", margin: "14px 0" },
    statusCard: (ok) => ({
      borderRadius: 14,
      padding: 14,
      border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`,
      background: ok ? "#f0fdf4" : "#fef2f2",
      color: ok ? "#166534" : "#991b1b",
      fontWeight: 700,
      fontSize: 13,
    }),
  };

  async function callProtectedApi() {
    setCalling(true);
    setApiError(null);
    setApiResult(null);

    try {
      const res = await fetch("http://localhost:8080/api/ping", {
        headers: { Authorization: `Bearer ${auth.user?.access_token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setApiError(data?.error || `Request failed (${res.status})`);
      } else {
        setApiResult(data);
      }
    } catch (e) {
      setApiError(e?.message || "Network error");
    } finally {
      setCalling(false);
    }
  }

  function copy(text) {
    if (!text) return;
    navigator.clipboard.writeText(text);
  }

  if (auth.isLoading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.pill}>
              <span style={styles.dot("#f59e0b")} /> Loading authentication…
            </div>
            <div style={{ marginTop: 10, fontWeight: 800, fontSize: 18 }}>
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
            <div style={styles.title}>OIDC Notes App</div>
            <div style={styles.subtitle}>
              OpenID Connect login + OAuth2 protected APIs (Keycloak) + Terraform IaC.
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
                  Secure login with OIDC (Auth Code + PKCE)
                </div>
                <div style={{ marginTop: 8, ...styles.small }}>
                  Click login to authenticate via Keycloak. The app will receive an ID token
                  (identity) and an access token (API authorization).
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
                <div style={styles.sectionTitle}>What you’ll demo</div>
                <div style={styles.small}>
                  ✅ OIDC login <br />
                  ✅ JWT access token <br />
                  ✅ Protected API call <br />
                  ✅ (Next) Notes CRUD
                </div>
              </div>
            </div>
          ) : (
            <>
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

              <div style={styles.btnRow}>
                <button style={styles.btn("primary")} onClick={callProtectedApi} disabled={calling}>
                  {calling ? "Calling API…" : "✅ Call Protected API"}
                </button>
                <button
                  style={styles.btn("secondary")}
                  onClick={() => copy(auth.user?.access_token)}
                >
                  📋 Copy Access Token
                </button>
              </div>

              <div style={{ marginTop: 12 }}>
                {apiResult && (
                  <div style={styles.statusCard(true)}>
                    API success: {JSON.stringify(apiResult)}
                  </div>
                )}
                {apiError && (
                  <div style={styles.statusCard(false)}>
                    API error: {apiError}
                  </div>
                )}
              </div>

              <div style={styles.grid2}>
                <details open>
                  <summary style={{ cursor: "pointer", fontWeight: 900, marginBottom: 8 }}>
                    Token Claims (ID Token)
                  </summary>
                  <div style={styles.codeBox}>
                    {JSON.stringify(auth.user?.profile, null, 2)}
                  </div>
                </details>

                <details>
                  <summary style={{ cursor: "pointer", fontWeight: 900, marginBottom: 8 }}>
                    Access Token (JWT)
                  </summary>
                  <div style={styles.codeBox}>{auth.user?.access_token}</div>
                </details>
              </div>

              <div style={{ marginTop: 14, ...styles.small }}>
                Tip: For your resume demo, show the access token being sent to <b>/api/ping</b> and
                validated via Keycloak’s JWKS.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
