const musicsApi = Vue.resource('/music');

const convertTimeHHMMSS = (val) => {
  let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);

  return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
};

const store = new Vuex.Store({
  state: {
    url: null,
    audio: undefined,
    playing: false,
    name: '',
    author: '',
    idAuthor: '',
    musics: []
  },
  mutations: {
    setUrl(state, url) {
      state.url = url;
    },
    setAudio(state, audio) {
      state.audio = audio;
    },
    setPlayingTrue(state) {
      state.playing = true;
    },
    setPlayingFalse(state) {
      state.playing = false;
    },
    setName(state, name) {
      state.name = name;
    },
    setAuthor(state, author) {
      state.author = author;
    },
    setMusics(state, musics) {
      state.musics = musics;
    },
    setIdAuthor(state, id) {
      state.idAuthor = id;
    }
  }
});

Vue.component('music-player', {
  template: `
    <div v-if="this.$store.state.url !== null" class="d-flex" style="min-width: 500px; padding-top: 8px">
      <div id="line" class="bg-secondary w-100" style="height: 8px; position: absolute; top: 0" @click.prevent="rewind">
        <div class="bg-info h-100" :style="{ width: this.percentComplete + '%' }"></div>
      </div>
      <div class="d-flex mx-2 rounded-circle border border-info my-auto" style="width: 51px; height: 51px" @click.prevent="playMusic">
        <svg v-if="!isPlay" viewBox="0 0 15 16" height="85%" class="bi bi-play-fill text-info m-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
        </svg>
        <svg v-else height="85%" viewBox="0 0 16 16" class="bi bi-pause-fill text-info m-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
        </svg>
      </div>
      <div class="d-flex mx-4 h-100" @click.prevent="stop">
        <svg height="70%" viewBox="0 0 16 16" class="bi bi-stop-fill text-info my-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
        </svg>
      </div>
      <div class="h-100 d-flex mx-2">
        <span class="mx-auto my-auto">{{ currentTime }} / {{ durationTime }}</span>
      </div>
      <div class="h-100 d-flex mx-2">
        <span class="my-auto mr-3"><strong>{{ this.$store.state.name }}</strong></span>
        <span class="my-auto"><i><a class="text-secondary" :href="'/users/profile/' + this.$store.state.idAuthor">{{ this.$store.state.author }}</a></i></span>
      </div>
      <audio :src="'/music/' + this.$store.state.url" style="display: none" @durationchange="newAudio"></audio>
    </div>
  `,
  data: () => ({
    audio: undefined,
    currentSeconds: 0,
    durationSeconds:0
  }),
  methods: {
    update() {
      this.currentSeconds = parseInt(this.audio.currentTime);
    },
    load() {
      this.durationSeconds = parseInt(this.audio.duration);
    },
    playMusic() {
      if(this.$store.state.playing) {
        this.$store.state.audio.pause();
      } else {
        this.$store.state.audio.play();
      }
    },
    stop() {
      this.$store.state.audio.pause();
      this.$store.state.audio.currentTime = 0;
    },
    newAudio() {
      this.audio = this.$el.querySelector('audio');
      this.audio.addEventListener('timeupdate', this.update);
      this.audio.addEventListener('loadeddata', this.load);
      this.audio.addEventListener('play', () => {this.$store.commit('setPlayingTrue');});
      this.audio.addEventListener('pause', () => {this.$store.commit('setPlayingFalse');});
      this.audio.addEventListener('ended', () => {this.$store.state.audio.currentTime = 0});
      this.$store.commit('setAudio', this.$el.querySelector('audio'));
      this.$store.state.audio.play();
    },
    rewind(e) {
      let line = this.$el.querySelector('#line');
      this.audio.currentTime = parseInt((e.pageX - line.getBoundingClientRect().left) / line.offsetWidth * this.durationSeconds + '');
    }
  },
  computed: {
    currentTime() {
      return convertTimeHHMMSS(this.currentSeconds);
    },
    durationTime() {
      return convertTimeHHMMSS(this.durationSeconds);
    },
    percentComplete() {
      return this.currentSeconds / this.durationSeconds * 100;
    },
    isPlay() {
      return this.$store.state.playing;
    }
  },
});

Vue.component('music-row', {
  props: ['name', 'url', 'author', 'idAuthor'],
  template: `
    <div style="background: #f6f6f6; height: 45px; width: 500px" class="d-flex mx-auto my-2">
      <div class="d-flex mx-2 rounded-circle border border-info my-auto" style="width: 35px; height: 35px" @click.prevent="thisPlay">
        <svg v-if="!isPlay" viewBox="0 0 15 16" height="85%" class="bi bi-play-fill text-info m-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
        </svg>
        <svg v-else height="85%" viewBox="0 0 16 16" class="bi bi-pause-fill text-info m-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
        </svg>
      </div>
      <div class="h-100 d-flex">
        <span class="my-auto mr-3"><strong>{{ this.name }}</strong></span>
        <span class="my-auto"><i><a class="text-secondary" :href="'/users/profile/' + this.idAuthor">{{ this.author }}</a></i></span>
      </div>
    </div>
  `,
  methods: {
    thisPlay() {
      if (this.url !== this.$store.state.url) {
        this.$store.commit('setName', this.name);
        this.$store.commit('setUrl', this.url);
        this.$store.commit('setAuthor', this.author);
        this.$store.commit('setIdAuthor', this.idAuthor);
      } else {
        if (this.$store.state.playing) {
          this.$store.state.audio.pause();
        } else {
          this.$store.state.audio.play();
        }
      }
    }
  },
  computed: {
    isPlay() {
      return this.$store.state.playing && this.url === this.$store.state.url;
    }
  }

});


new Vue({
  el: '#musics',
  store,
  data: () => ({
    musics: []
  }),
  template: `
    <div>
      <h3 class="mx-auto" style="width: 500px">Music List</h3>
      <div style="margin-bottom: 88px">
        <music-row v-for="music in this.$store.state.musics" 
            :key="music.id" 
            :name="music.name" 
            :url="music.url" 
            :author="music.userAuthor.username" 
            :idAuthor="music.userAuthor.id"
        ></music-row>
      </div>
      <music-player url="" class="fixed-bottom w-100 bg-dark text-light d-flex" style="height: 80px"></music-player>
    </div>
  `,
  created() {
    musicsApi.get().then(r =>
      r.json().then(data => data.forEach(music => this.musics.push(music)))
    );
    this.$store.commit('setMusics', this.musics);
  }
});