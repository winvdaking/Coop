<script setup>

  import { useRouter } from 'vue-router';

  const router = new useRouter();

  let member = reactive({
    fullname: '',
    email: '',
    password: ''
  });

  let formError = ref({
    fullname: false,
    email: false,
    password: false
  })

  let isErrorOnRegister = ref(false);
  let errorMessage = ref('');

  function preventForm() {

    api.post('members', { 
      body: member
    })
    .then(d => {

      console.log(d)
      if ('message' in d) {

        const { fullname, email, password } = d.member;

        formError.value.fullname = fullname === '';
        formError.value.email = email === '';
        formError.value.password = password === '';

        if (fullname && email && password) {
          isErrorOnRegister.value = true;
          errorMessage.value = d.message;
          setTimeout(() => {
            isErrorOnRegister.value = false
          }, 2500);
        }

      } else {

        // All good        
        router.push('/login');

      }

    })
    .catch(e => {

      console.log(e)
      isErrorOnRegister.value = true;
      errorMessage.value = e.toString();
      setTimeout(() => {
        isErrorOnRegister.value = false
      }, 1500);

    });

  }
</script>

<template>
  <form @submit.prevent="preventForm">
    <div class="field">
      <label class="label">Nom/Pseudo</label>
      <div class="control has-icons-left has-icons-right">
        <input class="input" :class="{'is-danger': formError.fullname}" type="text" v-model.trim="member.fullname" name="fullname" placeholder="toto">
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span class="icon is-small is-right" :class="{'is-hidden': !formError.fullname}">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p class="help is-danger" :class="{'is-hidden': !formError.fullname}">Le nom/pseudo est invalide.</p>
    </div>

    <div class="field">
      <label class="label">Email</label>
      <div class="control has-icons-left has-icons-right">
        <input class="input" :class="{'is-danger': formError.email}" type="email" v-model.trim="member.email" name="email" placeholder="toto@gmail.com">
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
        <span class="icon is-small is-right" :class="{'is-hidden': !formError.email}">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p class="help is-danger" :class="{'is-hidden': !formError.email}">L'adresse email est invalide.</p>
    </div>

    <div class="field">
      <label class="label">Mot de passe</label>
      <div class="control has-icons-left has-icons-right">
        <input class="input" :class="{'is-danger': formError.password}" type="password" v-model.trim="member.password" name="password" placeholder="****************">
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
        <span class="icon is-small is-right" :class="{'is-hidden': !formError.password}">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p class="help is-danger" :class="{'is-hidden': !formError.password}">Le mot de passe est invalide.</p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link">S'inscrire</button>
      </div>
      <div class="control">
        <RouterLink class="button is-link is-light" to="/">Annuler</RouterLink>
      </div>
    </div>
  </form>
  <div class="notification is-danger" :class="{'is-hidden': !isErrorOnRegister}">
    <button class="delete"></button>
    {{ errorMessage }}
  </div>
</template>
