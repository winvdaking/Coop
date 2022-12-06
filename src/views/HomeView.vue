<script setup>
import { onMounted } from 'vue';
import { useSessionStore } from '@/stores/session';

const session = new useSessionStore();

let channels = ref([]);

onMounted(() => {
  session.isValid();

  const $externalScript = document.createElement('script')
  $externalScript.setAttribute('src', '//cdn.jsdelivr.net/npm/sweetalert2@11')
  document.body.appendChild($externalScript)


  api.get(`channels?token=${session.data.token}`).then(r => channels.value = r);
});

function modalAddChannel() {
  Swal.fire({
    title: 'Créer une conversation',
    html: `
    <div class="field">
      <label class="label">Titre</label>
      <div class="control">
        <input class="input" id="title" type="text" placeholder="Un exemple de titre..." required>
      </div>
    </div>
    <div class="field">
      <label class="label">Description</label>
      <div class="control">
        <input class="input" id="topic" type="text" placeholder="Un exemple de description...">
      </div>
    </div>`,
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Créer',
    cancelButtonText: 'Annuler',
    showLoaderOnConfirm: true,
    preConfirm: () => {
      let title = document.getElementById('title').value;
      let topic = document.getElementById('topic').value;
      return api.post('channels', {
        body: {
          label: title,
          topic: topic,
          token: session.data.token
        }
      })
        .then(response => {
          if (response.message) {
            throw new Error(response.statusText)
          }
          channels.value.push(response);
        })
        .catch(error => {
          Swal.showValidationMessage(
            `Request failed: ${error}`
          );
        });
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Conversation créée avec succès',
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
  <div class="section">
    <h1 class="title">Liste des conversations</h1>
    <h2 class="subtitle add-conv" @click="modalAddChannel">Créer une conversation</h2>
    <template v-for="channel in channels">
      <div class="box">
        <router-link :to="{ name: 'channel', params: { cid: channel.id } }">
          <h3 class="title is-5">{{ channel.label }}</h3>
          <h4 class="subtitle is-6">{{ channel.topic }}</h4>
        </router-link>
      </div>
    </template>
  </div>
</template>

<style scoped>
.add-conv:hover {
  cursor: pointer;
  color: rgba(0, 0, 0, .5);
}
</style>