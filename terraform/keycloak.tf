resource "keycloak_realm" "notes" {
  realm   = "notes"
  enabled = true
}

resource "keycloak_openid_client" "frontend" {
  realm_id  = keycloak_realm.notes.id
  client_id = "notes-frontend"
  name      = "Notes Frontend"

  enabled                     = true
  access_type                 = "PUBLIC"
  standard_flow_enabled       = true
  direct_access_grants_enabled = true

  valid_redirect_uris = [
    "http://localhost:3000/*"
  ]

  web_origins = [
    "http://localhost:3000"
  ]
}

resource "keycloak_role" "user_role" {
  realm_id = keycloak_realm.notes.id
  name     = "user"
}

resource "keycloak_user" "testuser" {
  realm_id  = keycloak_realm.notes.id
  username  = "testuser"
  enabled   = true
  email     = "testuser@example.com"
  first_name = "Test"
  last_name  = "User"

  initial_password {
    value     = "Password@123"
    temporary = false
  }
}

resource "keycloak_user_roles" "testuser_roles" {
  realm_id = keycloak_realm.notes.id
  user_id  = keycloak_user.testuser.id

  role_ids = [
    keycloak_role.user_role.id
  ]
}
