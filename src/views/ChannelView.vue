<script setup>
import { useRoute } from 'vue-router';
import { useSessionStore } from '@/stores/session';
import postMessage from '../components/PosterMessage.vue';
import Message from '../components/Message.vue';

const bus = inject('bus');

const session = new useSessionStore();
const route = useRoute();

let data = reactive({
    channel: {},
    messages: [],
})

let members = [];
let finish = reactive({
    fini: false
});

bus.on('loadMessages', loadMessages);

onMounted(async () => {
    session.isValid();
    api.get(`channels/${route.params.cid}?token=${session.data.token}`).then(r => data.channel = r);
    await loadMessages();
    finish.fini = true;
    const externalScript = document.createElement('script');
    externalScript.setAttribute('src', '//cdn.jsdelivr.net/npm/sweetalert2@11');
    document.body.appendChild(externalScript);
});

async function loadMessages() {
    await loadMembers();
    const response = await api.get(`channels/${route.params.cid}/posts?token=${session.data.token}`);
    data.messages = response.reverse();
    data.messages.forEach(msg => {
        msg.author = members.find(usr => usr.id === msg.member_id);
        if (!msg.author)
            msg.author = { id: null, fullname: 'Utilisateur supprimé', email: null };

        if (msg.author)
            delete msg.author.password;
    });
}

async function loadMembers() {
    const response = await api.get(`members?token=${session.data.token}`);
    members = response.reverse();
}
</script>

<template>
    <div class="section">
        <h2 class="title is-4">{{ data.channel.label }}</h2>
        <h3 class="subtitle">{{ data.channel.topic }}</h3>
        <template v-if="!finish.fini">
            Chargement des messages...
        </template>
        <template v-else="finish.fini">
            <template v-for="message in data.messages">
                <message :message="message"></message>
            </template>
        </template>
        <hr>
        <postMessage :cid="data.channel.id"></postMessage>
    </div>
</template>