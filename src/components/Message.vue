<script setup>
import { defineProps } from 'vue';

const props = defineProps(['message']);
const message = props.message;
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
                    <small><a>Supprimer</a> · <a>Modifier</a> · 2 hrs</small>
                </p>
            </div>
        </div>
    </article>
</template>