<script setup>
import { onMounted } from 'vue';
import { useSessionStore } from '@/stores/session';

const session = new useSessionStore();
const bus = inject('bus');
let channels = ref([]);

bus.on('loadChannels', loadChannels);

onMounted(async () => {
  await session.isValid();

  const $externalScript = document.createElement('script')
  $externalScript.setAttribute('src', '//cdn.jsdelivr.net/npm/sweetalert2@11')
  document.body.appendChild($externalScript)
  loadChannels();
});

function loadChannels() {
  api.get(`channels?token=${session.data.token}`).then(r => channels.value = r);
}

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

function editChannel(cid, topic, label) {
  Swal.fire({
    title: 'Modifier une conversation',
    html: `
    <div class="field">
      <label class="label">Titre</label>
      <div class="control">
        <input class="input" id="title" type="text" value="${label}" required>
      </div>
    </div>
    <div class="field">
      <label class="label">Description</label>
      <div class="control">
        <input class="input" id="topic" type="text" value="${topic}" required>
      </div>
    </div>`,
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Modifier',
    cancelButtonText: 'Annuler',
    showLoaderOnConfirm: true,
    preConfirm: () => {
      let title = document.getElementById('title').value;
      let topic = document.getElementById('topic').value;
      return api.put(`channels/${cid}`, {
        body: {
          id: cid,
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
      bus.emit('loadChannels');
      Swal.fire({
        title: 'Conversation modifiée avec succès',
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

async function deleteChannel(cid) {
  Swal.fire({
    text: 'Êtes-vous sûr de vouloir supprimer ce channel ?',
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
      await api.delete(`channels/${cid}?token=${session.data.token}`)
        .catch(error => {
          Swal.showValidationMessage(
            `Request failed: ${error}`
          );
        });
      bus.emit('loadChannels');
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Conversation supprimée avec succès',
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
    <h2 class="subtitle add-conv has-text-link" @click="modalAddChannel">Créer une conversation</h2>
    <template v-for="channel in channels">
      <router-link class="box" :to="{ name: 'channel', params: { cid: channel.id } }">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div>
                <h3 class="title is-5">{{ channel.label }}</h3>
                <h4 class="heading">{{ channel.topic }}</h4>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="buttons">
              <button @click.prevent="editChannel(channel.id, channel.topic, channel.label)"
                class="button is-light level-item" aria-label="reply">
                <span class="icon is-small">
                  <i class="fas fa-pen" aria-hidden="true"></i>
                </span>
              </button>
              <button @click.prevent="deleteChannel(channel.id)" class="button is-danger is-light level-item"
                aria-label="reply">
                <span class="icon is-small">
                  <i class="fas fa-trash" aria-hidden="true"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </router-link>
    </template>
  </div>
</template>

<style scoped>
.add-conv:hover {
  cursor: pointer;
  color: rgba(0, 0, 0, .5);
}
</style>