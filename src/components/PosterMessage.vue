<script setup>
import { ref } from 'vue';
import { useSessionStore } from '@/stores/session';
import md5 from 'md5';

const bus = inject('bus');
const props = defineProps(['cid'])
const session = new useSessionStore();

let message = ref('');

function postMessage() {
    api.post(`channels/${props.cid}/posts?token=${session.data.token}`, {
        body: {
            channel_id: props.cid,
            member_id: session.data.member.id,
            message: message.value
        }
    }).then(response => {
        message.value = '';
        bus.emit('loadMessages');
    });
}
</script>

<template>
    <div>
        <form @submit.prevent="postMessage">
            <article class="media">
                <figure class="media-left">
                    <p class="image is-64x64">
                        <img :src="`https://www.gravatar.com/avatar/${md5(session.data.member.email)}?d = identicon`"
                            :alt="`Avatar de ${session.data.member.fullname}`">
                    </p>
                </figure>
                <div class="media-content">
                    <div class="field">
                        <p class="control">
                            <textarea class="textarea" v-model="message"
                                placeholder="Poster un commentaire..."></textarea>
                        </p>
                    </div>
                    <div class="field">
                        <p class="control">
                            <button class="button">Commenter 📨</button>
                        </p>
                    </div>
                </div>
            </article>
        </form>
    </div>
</template>