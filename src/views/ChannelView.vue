<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '@/stores/session';
import postMessage from '../components/PosterMessage.vue';
import Message from '../components/Message.vue';
const session = new useSessionStore();
const route = useRoute();
const router = useRouter();

let data = reactive({
    channel: {},
    messages: []
})

onMounted(() => {
    session.isValid();
    api.get(`channels/${route.params.cid}?token=${session.data.token}`).then(r => data.channel = r);
    api.get(`channels/${route.params.cid}/posts?token=${session.data.token}`).then(r => { data.messages = r; });
    api.get(`members?token=${session.data.token}`).then(r => {
        data.messages.forEach(msg => {
            msg.author = r.find(usr => usr.id === msg.member_id);
            delete msg.author.password;
        });
    });
});

function deleteChannel() {
    api.delete(`channels/${route.params.cid}?token=${session.data.token}`);
    router.push('/');
}

</script>
<template>
    <div class="section">
        <h2 class="title is-4">{{ data.channel.label }}</h2>
        <h3 class="subtitle">{{ data.channel.topic }}</h3>
        <button class="button is-danger is-light" @click="deleteChannel">Supprimer la conversation</button>
        <hr>
        <template v-for="message in data.messages">
            <message :message="message"></message>
        </template>
        <hr>
        <postMessage :cid="data.channel.id"></postMessage>
    </div>
</template>