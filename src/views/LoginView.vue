<script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useSessionStore } from '@/stores/session';

const router = new useRouter();
const session = new useSessionStore();

onMounted(async () => {
  const mid = session.data.member.id;
  const response = await api.get(`members/${mid}/signedin?token=${session.data.token}`);
  const resp = await response;
  if (!resp.message)
    router.push('/');
  else
    session.data.token = false;
})

let member = reactive({
  email: '',
  password: ''
});

function loginValidation() {
  api.post('members/signin', {
    body: member
  }).then(response => {
    console.log(response);
    if (response.message)
      alert(response.message);
    else {
      session.setSession(response.member, response.token);
      router.push('/');
    }
  }).catch(console.error);
}
</script>

<template>
  <section class="hero is-fullheight-with-navbar">
    <div class="hero-body is-justify-content-center">
      <div class="box">
        <h2 class="title">Se connecter</h2>
        <form @submit.prevent="loginValidation">
          <div class="field">
            <label class="label">Email</label>
            <div class="control has-icons-left">
              <input class="input" v-model="member.email" type="email" placeholder="nom@domaine.com">
              <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label for="password" class="label">Mot de passe</label>
            <p class="control has-icons-left">
              <input class="input" v-model="member.password" type="password" placeholder="Password">
              <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <div class="field">
            <p class="buttons control is-grouped">
              <button class="button is-success" type="submit">
                Se connecter
              </button>
              <router-link class="button is-primary is-light" to="/">Annuler</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>