import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from 'react-oidc-context'
import App from './App.jsx'

const oidcConfig = {
  authority: "http://localhost:8081/realms/notes",
  client_id: "notes-frontend",
  redirect_uri: "http://localhost:3000/",
  response_type: "code",
  scope: "openid profile email",
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
