import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', () => {
  const data = reactive({
    member: {},
    token: false
  })

  function setSession(member, token) {
    data.member = member;
    data.token = token;
    setConnected();
  }

  const isConnected = ref(false);

  function setConnected() {
    isConnected.value = true;
  }
  function disconnect() {
    isConnected.value = false;
  }
  return { isConnected, setConnected, disconnect, setSession, data }
}, {
  persist: true,
})
