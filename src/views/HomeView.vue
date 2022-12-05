<script setup>
import { onMounted } from 'vue';
import { useSessionStore } from '@/stores/session';

const session = new useSessionStore();

onMounted(() => {
  session.isValid();
});
</script>

<template>
  <main>
    <h1 class="title">Liste des conversations</h1>
  </main>
</template>