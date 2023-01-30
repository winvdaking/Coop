<script setup>
  import { useSessionStore } from './stores/session';
  import mitt from 'mitt';
  const session = new useSessionStore();
  const bus = mitt();
  provide('bus', bus);

  function openNavbar(ev, el) {
    const $target = document.getElementById(el);
    ev.target.closest('a').classList.toggle('is-active');
    $target.classList.toggle('is-active');
  }
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <RouterLink to="/" class="navbar-item">CO'OP</RouterLink>

      <a role="button" class="navbar-burger" @click="openNavbar($event, 'navbarBasicExample')" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div id="navbarBasicExample" class="navbar-menu">
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