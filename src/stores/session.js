import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useSessionStore = defineStore('session', () => {
  const router = useRouter();

  const data = reactive({
    member: {},
    token: false
  })

  function setSession(member, token) {
    data.member = member;
    data.token = token;
  }

  async function isValid() {
    if (!data.token)
      router.push('/login');
    else {
      const mid = data.member.id;
      const response = await api.get(`members/${mid}/signedin?token=${data.token}`);
      const resp = await response;
      if (!resp.token)
        router.push('/login');
    }
  }

  return { setSession, data, isValid }
}, {
  persist: true,
})
