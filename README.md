# 🔐 OIDC Notes Application

A full-stack Notes application demonstrating **secure authentication and authorization** using **OpenID Connect (OIDC)** and **OAuth 2.0**, powered by **Keycloak** and provisioned with **Terraform**.

---

## ✨ Features

- 🔐 OIDC Authentication (Authorization Code Flow + PKCE)
- 🪪 JWT-based API Authorization (Access Tokens)
- 🧠 Per-user data isolation using token claims (`sub`)
- ⚙️ Infrastructure as Code with Terraform
- 🐳 Dockerized Keycloak setup
- 📦 Full-stack app (React + Node.js)

---

## 🏗️ Architecture

```text
Frontend (React)
   |
   v
OIDC Login (PKCE)
   |
   v
Keycloak (Identity Provider)
   |
   v
Issues JWT Access Token
   |
   v
Backend (Node.js + Express)
   |
   v
Validates JWT via JWKS
   |
   v
Protected Notes API
```

---

## 🔐 Key Features

- OpenID Connect authentication (Authorization Code Flow with PKCE)
- OAuth 2.0 secured REST APIs
- JWT validation using Keycloak JWKS endpoint
- Per-user data isolation using token claims (`sub`)
- Infrastructure as Code using Terraform
- Dockerized Keycloak setup

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), react-oidc-context  
- **Backend:** Node.js, Express, express-jwt, jwks-rsa  
- **Auth:** Keycloak (OIDC + OAuth2)  
- **Infrastructure:** Terraform, Docker  

---

## ⚙️ Prerequisites

Make sure you have installed:

- Node.js (v18+)
- npm
- Docker Desktop
- Terraform (v1.5+)

---

## ▶️ How to Run the Project

### 1. Start Keycloak using Terraform

```bash
cd terraform
terraform init
terraform apply -auto-approve
```
Keycloak runs at: http://localhost:8081

### 2. Start Backend

```bash
cd backend
npm install
node index.js
```
Backend runs at: http://localhost:8080
Test health endpoint: http://localhost:8080/health

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:3000

---

## 🔑 Test User

If created via Terraform or manually:

```bash
Username: testuser
Password: Password@123
```

Or enable self-registration in Keycloak to create a new user.

---

## 🔄 Application Flow

1. User clicks **Login** in the frontend  
2. Redirected to Keycloak login page  
3. After authentication, redirected back with an authorization code  
4. Frontend exchanges code for:
   - ID Token (identity)
   - Access Token (authorization)
5. Frontend sends access token to backend APIs  
6. Backend:
   - Verifies token signature using JWKS  
   - Validates issuer and expiry  
   - Extracts user identity (`sub`)  
7. Notes are stored and returned per authenticated user  

---

## 🔍 Example API Call

```http
GET /api/notes
Authorization: Bearer <access_token>
```

---

## Future Improvements

1. Role-Based Access Control (RBAC)
2. Persistent database (PostgreSQL / MongoDB)
3. Refresh token handling
4. Admin panel for user management
5. Cloud deployment (AWS / GCP)

