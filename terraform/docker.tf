resource "docker_network" "app_net" {
  name = "oidc_notes_net"
}

resource "docker_container" "keycloak" {
  name  = "oidc-notes-keycloak"
  image = "quay.io/keycloak/keycloak:24.0.5"

  env = [
    "KC_DB=dev-file",
    "KEYCLOAK_ADMIN=${var.keycloak_admin_user}",
    "KEYCLOAK_ADMIN_PASSWORD=${var.keycloak_admin_password}"
  ]

  command = [
    "start-dev",
    "--http-port=8080"
  ]

  ports {
    internal = 8080
    external = 8081
  }

  networks_advanced {
    name = docker_network.app_net.name
  }
}
