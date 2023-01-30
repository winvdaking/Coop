<script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useSessionStore } from '@/stores/session';

const router = new useRouter();
const session = new useSessionStore();

onMounted(() => {
    let isConnected = true;

    if (!session.data.token)
        isConnected = false;

    if (!isConnected)
        router.push('/login');

    api.delete('members/signout', {
        body: {
            token: session.data.token
        }
    })

    session.data = {
        member: {},
        token: false
    };
    isConnected = false;

    router.push('/login');
});
</script>

<template>
</template>