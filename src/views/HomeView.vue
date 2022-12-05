<script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useSessionStore } from '@/stores/session';

const router = new useRouter();
const session = new useSessionStore();

onMounted(async () => {
  let isConnected = true;

  const token = session.data.token;
  if (!token)
    loginMember();
  else {
    const mid = session.data.member.id;
    const response = await api.get(`members/${mid}/signedin?token=${token}`);
    const data = await response;
    if (!data.token)
      loginMember();
  }
})

function loginMember() {
  router.push('/login');
}
</script>

<template>
  <main>
    <h1 class="title">Liste des conversations</h1>
  </main>
</template>