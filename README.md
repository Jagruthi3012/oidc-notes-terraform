# OIDC-Secured Notes Application

A full-stack Notes application secured using **OpenID Connect (OIDC)** and **OAuth 2.0**, demonstrating secure authentication and authorization with **Keycloak**, and infrastructure provisioned using **Terraform**.

---

## 🚀 Overview

This project showcases how modern applications implement secure identity and access control using industry-standard protocols.

- Users authenticate via **Keycloak** using OIDC (Authorization Code Flow with PKCE)
- The frontend receives an **ID Token** (identity) and an **Access Token** (authorization)
- The backend validates access tokens using **JWKS (JSON Web Key Sets)**
- Notes are stored and retrieved **per user**, based on JWT claims
- Keycloak setup (realm, client, redirect URIs) is automated using **Terraform**

---

## 🏗️ Architecture

Frontend (React)
→ OIDC Login (PKCE)
→ Keycloak (Identity Provider)
→ Issues JWT Access Token
→ Backend (Node.js + Express)
→ Validates JWT via JWKS
→ Protected Notes API

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
