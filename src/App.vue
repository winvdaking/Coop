<script setup>
  import { useSessionStore } from './stores/session';
  const session = new useSessionStore();
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <RouterLink to="/" class="navbar-item">CO'OP</RouterLink>

      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <div class="navbar-item">
          <RouterLink v-if="session.data.token" to="/members" class="navbar-item">Membres</RouterLink>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <RouterLink v-if="session.data.token" to="/logout" class="button is-danger">Se déconnecter</RouterLink>
            <RouterLink v-else="session.data.token" to="/login" class="button is-primary">Se connecter</RouterLink>
            <RouterLink v-if="!session.data.token" to="/register" class="button is-light">S'inscrire</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <div class="container">
    <RouterView />
  </div>
</template>