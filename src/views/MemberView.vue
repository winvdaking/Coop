<script setup>
  import { useSessionStore } from '@/stores/session';
  import { useRoute } from 'vue-router';

  const route = new useRoute();
  const session = useSessionStore();

  const { userId } = route.params;

  let member = ref([]);
  api.get(`members/${userId}?token=${session.data.token}`).then(r => {
    member.value = r
    console.log(r);
  });

  function deleteUser(e) {
    console.log(e)
  }
</script>

<template>
  <div class="section">
    <h1 class="title">Profil de {{ route.params.userId }} :</h1>
    <div class="columns">
      <div class="column is-3">
        <RouterLink :to="`/members/${member.id}`" class="box">
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
                <a @click.prevent="deleteUser(member)" class="level-item" aria-label="reply">
                  <span class="icon is-small">
                    <i class="fas fa-trash" aria-hidden="true"></i>
                  </span>
                </a>
              </div>
            </nav>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>