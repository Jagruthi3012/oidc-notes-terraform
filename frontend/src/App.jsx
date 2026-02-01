import { useAuth } from "react-oidc-context";

export default function App() {
  const auth = useAuth();

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h2>OIDC Notes App</h2>

      {!auth.isAuthenticated ? (
        <button onClick={() => auth.signinRedirect()}>Login</button>
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            <b>Logged in as:</b>{" "}
            {auth.user?.profile?.preferred_username || auth.user?.profile?.email}
          </div>

          <button onClick={() => auth.signoutRedirect()}>Logout</button>

          <h3 style={{ marginTop: 18 }}>Token Claims (for demo)</h3>
          <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
            {JSON.stringify(auth.user?.profile, null, 2)}
          </pre>

          <h3>Access Token</h3>
          <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
            {auth.user?.access_token}
          </pre>
          <button
  style={{ marginTop: 12 }}
  onClick={async () => {
    const res = await fetch("http://localhost:8080/api/ping", {
      headers: {
        Authorization: `Bearer ${auth.user?.access_token}`,
      },
    });
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  }}
>
  Call Protected API
</button>
        </>
      )}
    </div>
  );
}
