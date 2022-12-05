import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', () => {
  const data = reactive({
    member: {},
    token: false
  })

  function setSession(member, token) {
    data.member = member;
    data.token = token;
  }

  return { setSession, data }
}, {
  persist: true,
})
