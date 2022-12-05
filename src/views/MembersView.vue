<script setup>
import { useSessionStore } from '@/stores/session';

const session = useSessionStore();

let members = ref([]);
api.get(`members?token=${session.data.token}`).then(r => members.value = r);
console.log(members);
</script>

<template>
    <h1 class="title">Liste des membres</h1>
    <div class="columns">
        <template v-for="member in members">
            <div class="column is-3">
                <article class="box">
                    <div class="media-content">
                        <div class="content">
                            <p>
                                <strong>
                                    <span class="icon is-small">
                                        <i class="fas fa-user" aria-hidden="true"></i>
                                    </span>
                                    {{ member.fullname }}
                                </strong>
                                <br>
                                <small>
                                    <span class="icon is-small">
                                        <i class="fas fa-envelope" aria-hidden="true"></i>
                                    </span>
                                    {{ member.email }}
                                </small>
                            </p>
                        </div>
                        <nav class="level is-mobile">
                            <div class="level-left">
                                <a class="level-item" aria-label="reply">
                                    <span class="icon is-small">
                                        <i class="fas fa-trash" aria-hidden="true"></i>
                                    </span>
                                </a>
                            </div>
                        </nav>
                    </div>
                </article>
            </div>
        </template>
    </div>
</template>