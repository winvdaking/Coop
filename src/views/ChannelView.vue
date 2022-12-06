<script setup>
import { useRoute } from 'vue-router';
import { useSessionStore } from '@/stores/session';
import postMessage from '../components/PosterMessage.vue';
import Message from '../components/Message.vue';
const session = new useSessionStore();
const route = useRoute();

let data = reactive({
    channel: {},
    messages: []
})

let members = [];

onMounted(() => {
    session.isValid();
    api.get(`channels/${route.params.cid}?token=${session.data.token}`).then(r => data.channel = r);
    api.get(`channels/${route.params.cid}/posts?token=${session.data.token}`).then(r => data.messages = r);
    api.get(`members?token=${session.data.token}`).then(r => {
        members = r;
        data.messages.forEach(msg => {
            msg.author = members.find(usr => usr.id === msg.member_id)
            delete msg.author.password;
        });
    });
});
</script>
<template>
    <div class="section">
        <h2 class="title is-4"></h2>
        <h3 class="subtitle"></h3>
        <template v-for="message in data.messages">
            <message :message="message"></message>
        </template>
        <hr>
        <postMessage :cid="data.channel.id"></postMessage>
    </div>
</template>