<script setup>
  import { useSessionStore } from '@/stores/session';
  import { useRoute, useRouter } from 'vue-router';

  import md5 from 'md5';
  import moment from 'moment';

  import fr from 'moment/locale/fr';

  moment.locale('fr', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        L : 'DD/MM/YYYY'
    },
    relativeTime : {
        future : 'dans %s',
        past : 'il y a %s',
        s : 'quelques secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse : /PD|MD/,
    isPM : function (input) {
        return input.charAt(0) === 'M';
    },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1,
        doy : 4
    }
});

  const route = new useRoute();
  const router = new useRouter();
  const session = useSessionStore();

  session.isValid();

  const { userId } = route.params;

  let member = ref([]);
  let isMessagesLoaded = ref(false);
  let messages = ref([]);

  api.get(`members?token=${session.data.token}`).then(r => {
    const user = r.find(e => e.id === userId);
    if (!user) {
      return router.push('/members');
    }
    member.value = user;
    member.value.hash = md5(member.value.email);
    delete member.value.password;
  });

  api.get(`channels?token=${session.data.token}`).then(async r => {
    const listMessages = await Promise.all(r.map(e => api.get(`channels/${e.id}/posts?token=${session.data.token}`)));

    listMessages.forEach(channel => {
      channel.forEach(message => {
        if (message.member_id === userId) {
          message.author = member.value;
          message.channel_name = r.find(c => c.id === message.channel_id).label;
          messages.value.push(message);
        }
      });
    });

    if (messages.value.length !== 0) {
      isMessagesLoaded.value = true;
      // On trie les messages pour afficher les messages les plus récents en premier
      messages.value.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  });
</script>

<template>
  <div class="section">
    <div class="content">
      <div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img :src="`https://www.gravatar.com/avatar/${member.hash}?d=identicon`" :alt="`Avatar de ${member.fullname}`">
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">{{ member.fullname }}</p>
              <p class="subtitle is-6">{{ member.email }}</p>
            </div>
          </div>

          <div class="content">
            Membre inscrit depuis <time :datetime="member.created_at">{{ moment(member.created_at).fromNow(true) }}</time> <span class="is-italic">(<time :datetime="member.created_at">{{ moment(member.created_at).format('L') }}</time>)</span>
          </div>
        </div>
      </div>
      <h1 class="title">Messages :</h1>
      <h3 class="subtitle" v-if="!isMessagesLoaded"><p>Chargement des messages...</p></h3>
      <div class="box" v-if="isMessagesLoaded">
        <article v-for="message in messages" class="media">
          <figure class="media-left">
            <p class="image is-48x48">
              <img :src="`https://www.gravatar.com/avatar/${message.author.hash}?d=identicon`">
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{ message.author.fullname }}</strong>
                <br>{{ message.message }}<br>
                <small :title="moment(message.created_at).format('dddd DD MMMM YYYY HH:ss')">Il y a <time :datetime="message.created_at">{{ moment(message.created_at).fromNow(true) }}</time></small>
              </p>
            </div>
          </div>
          <div class="media-right">
            <div class="content">
              <p>
                Message posté dans <RouterLink :to="{ name: 'channel', params: { cid: message.channel_id }}">{{ message.channel_name }}</RouterLink>
              </p>
            </div>
          </div>
        </article>    
      </div>      
    </div>
  </div>
</template>