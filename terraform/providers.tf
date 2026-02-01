terraform {
  required_version = ">= 1.5.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
    keycloak = {
      source  = "keycloak/keycloak"
      version = "~> 5.0"
    }
  }
}

provider "docker" {}

provider "keycloak" {
  client_id = "admin-cli"
  username  = var.keycloak_admin_user
  password  = var.keycloak_admin_password
  url       = "http://localhost:8081"
  realm     = "master"
}
