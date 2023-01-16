<script setup>
import { defineProps } from 'vue';
import { useSessionStore } from '@/stores/session';
import moment from 'moment';
import { useRoute } from 'vue-router';

const bus = inject('bus');
const route = useRoute();

moment.updateLocale('fr', {
    relativeTime: {
        future: 'dans %s',
        past: 'il y a %s',
        s: 'quelques secondes',
        m: 'une minute',
        mm: '%d minutes',
        h: 'une heure',
        hh: '%d heures',
        d: 'un jour',
        dd: '%d jours',
        M: 'un mois',
        MM: '%d mois',
        y: 'un an',
        yy: '%d ans'
    }
});

const session = new useSessionStore();

const props = defineProps(['message']);
const message = ref(props.message);

async function editMessage(mid, msg) {
    const { value: text } = await Swal.fire({
        input: 'textarea',
        inputLabel: 'Modification',
        inputValue: msg,
        showCancelButton: true,
        confirmButtonText: 'Modifier',
        cancelButtonText: 'Annuler',
        customClass: {
            confirmButton: 'button is-success',
            cancelButton: 'button is-light'
        },
        buttonsStyling: false,
        reverseButtons: true,
        allowOutsideClick: () => !Swal.isLoading()
    });
    if (text) {
        await api.put(`channels/${route.params.cid}/posts/${mid}?token=${session.data.token}`, {
            body: {
                message: text
            }
        }).catch(error => {
            Swal.showValidationMessage(
                `Request failed: ${error}`
            );
        });
        bus.emit('loadMessages');
        props.message.message = text;

        Swal.fire({
            title: 'Message modifié avec succès',
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
        });
    }
}

function deleteMessage(mid) {
    Swal.fire({
        text: 'Êtes-vous sûr de vouloir supprimer votre message ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        customClass: {
            confirmButton: 'button is-danger',
            cancelButton: 'button is-light'
        },
        buttonsStyling: false,
        reverseButtons: true,
        preConfirm: async () => {
            await api.delete(`channels/${route.params.cid}/posts/${mid}?token=${session.data.token}`)
                .catch(error => {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    );
                });
            bus.emit('loadMessages');
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Message supprimé avec succès',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
            });
        }
    });
}
</script>

<template>
    <article class="media">
        <figure class="media-left">
            <p class="image is-48x48">
                <img src="https://bulma.io/images/placeholders/96x96.png">
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <p>
                    <strong>{{ message.author.fullname }}</strong> <small>{{ message.author.email }}</small>
                    <br>{{ message.message }}<br>
                    <small>
                        <template v-if="message.member_id === session.data.member.id">
                            <a @click="editMessage(message.id, message.message)">Modifier</a> · <a
                                @click="deleteMessage(message.id)">Supprimer</a> ·
                        </template>
                        il y a {{ moment(message.created_at).fromNow(true) }}</small>
                </p>
            </div>
        </div>
    </article>
</template>