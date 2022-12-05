import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isConnected = ref(false);

  function setConnected() {
    isConnected.value = true;
  }  
  function disconnect() {
    isConnected.value = false;
  }
  return { isConnected, setConnected, disconnect }
}, {
  persist: true,
})
