<script setup>
import { useSessionStore } from '@/stores/session';

const session = new useSessionStore();

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
        else
            session.setSession(response.member, response.token);
    }).catch(console.error);
}
</script>

<template>
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
                <p class="control">
                    <button class="button is-success" type="submit">
                        Se connecter
                    </button>
                </p>
            </div>
        </form>
    </div>
</template>
