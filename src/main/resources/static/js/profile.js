const getUserApi = Vue.resource('/user{/id}');
const editProfileApi = Vue.resource('/user/profile{/id}');
const subscribersApi = Vue.resource('/user/profile/subscribers');
const subscriptionsApi = Vue.resource('/user/profile/subscriptions');
const unsubscribeApi = Vue.resource('/user/profile/unsubscribe');
const musicsApi = Vue.resource('/music/my-music');
const musicsDeleteApi = Vue.resource('/music{/id}');
const purchasedMusicsApi = Vue.resource('/music/purchased-music');
const authApi = Vue.resource('/user/auth');
const removeBuyingMusicApi = Vue.resource('/user/buying-music{/id}');

let containsUser = (user, userList) => {
  for (let u of userList) {
    if (u.id === user.id) {
      return true;
    }
  }
  return false;
}

const convertTimeHHMMSS = (val) => {
  let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);

  return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
};

let containsMusic = (musicId, musicList) => {
  for (let m of musicList) {
    if (m.id === musicId) {
      return true;
    }
  }
  return false;
};

let getIndex = (list, id) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return i;
    }
  }
  return -1;
}

const store = new Vuex.Store({
  state: {
    music: undefined,
    musicId: '',
    url: null,
    audio: undefined,
    playing: false,
    name: '',
    auth: '',
    myMusics: [],
    buyMusics: []
  },
  mutations: {
    setMusic(state, music) {
      state.music = music
    },
    setAuth(state, auth) {
      state.auth = auth
    },
    setUrl(state, url) {
      state.url = url;
    },
    setMusicId(state, id) {
      state.musicId = id
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
    setPrice(state, price) {
      state.price = price
    },
    setMyMusics(state, musics) {
      state.myMusics = musics
    },
    setBuyMusics(state, musics) {
      state.buyMusics = musics
    },
    deleteMyMusic(state, id) {
      let index = getIndex(state.myMusics, id);
      state.myMusics.splice(index, 1);
    },
    deleteBuyMusic(state, id) {
      let index = getIndex(state.buyMusics, id);
      state.buyMusics.splice(index, 1);
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
      </div>
      <audio :src="'/musics/' + this.$store.state.url" style="display: none" @durationchange="newAudio"></audio>
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
  props: ['music'],
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
        <span class="my-auto mr-3"><strong>{{ this.music.name }}</strong></span>
        <span v-if="this.music.userAuthor !== null" class="my-auto">
          <i><a class="text-secondary" :href="'/users/profile/' + this.music.userAuthor.id">{{ this.music.userAuthor.username }}</a></i>
        </span>
      </div>
      <div v-if="this.music.userAuthor !== null" class="my-auto ml-auto mr-2">
        <div v-if="this.$store.state.auth === this.music.userAuthor.username">
          <button class="btn btn-info" @click.prevent="deleteMusic">Delete</button>
        </div>
        <div v-else>
          <button class="btn btn-info" @click.prevent="deleteBuyMusic">Delete</button>
        </div>
      </div>
      <div v-else class="my-auto ml-auto mr-2">
          <button class="btn btn-info" @click.prevent="deleteBuyMusic">Delete</button>
      </div>
    </div>
  `,
  methods: {
    thisPlay() {
      if (this.music.url !== this.$store.state.url) {
        this.$store.commit('setName', this.music.name);
        this.$store.commit('setMusic', this.music);
        this.$store.commit('setUrl', this.music.url);
        this.$store.commit('setMusicId', this.music.id);
        this.$store.commit('setPrice', this.music.price);
      } else {
        if (this.$store.state.playing) {
          this.$store.state.audio.pause();
        } else {
          this.$store.state.audio.play();
        }
      }
    },
    deleteMusic() {
      musicsDeleteApi.remove({id: this.music.id}, {}).then(r => {
        if (r.ok) {
          this.$store.commit('deleteMyMusic', this.music.id);
        }
      });
    },
    deleteBuyMusic() {
      removeBuyingMusicApi.remove({id: this.music.id}, {}).then(r => {
        if (r.ok) {
          this.$store.commit('deleteBuyMusic', this.music.id);
        }
      })
    }
  },
  computed: {
    isPlay() {
      return this.$store.state.playing && this.music.url === this.$store.state.url;
    }
  }

});

Vue.component('user-info', {
  props: ['id', 'auth'],
  data: () => ({
    user: null,
    headModal: '',
    inputModalEmail: false,
    inputModalProfile: false,
    subscribeUsers: [],
    subscriptionUsers: [],
    isSub: false
  }),
  template: `
    <div v-if="this.user != null" class="col-7 mx-auto">
      <div class="my-2">
        <h4><span style="width: 170px; display: inline-block">Email:</span><strong>{{ user.username }}</strong></h4>
      </div>
      <div v-if="this.user.username == this.auth">
        <button @click.prevent="editEmail" class="btn btn-info" data-toggle="modal" data-target="#myModal">Edit email</button>
        <hr>
      </div>
      <div class="my-2">
        <h4><span style="width: 170px; display: inline-block">First name:</span><strong>{{ user.firstName }}</strong></h4>
      </div>
      <div class="my-2">
        <h4><span style="width: 170px; display: inline-block">Last name:</span><strong>{{ user.lastName }}</strong></h4>
      </div>
      <div class="my-2">
        <h4><span style="width: 170px; display: inline-block">Birthday:</span><strong>{{ user.birthday }}</strong></h4>
      </div>
      <div v-if="this.user.username == this.auth">
        <button @click.prevent="editProfile" class="btn btn-info" data-toggle="modal" data-target="#myModal">Edit profile</button>
        <hr>
      </div>
      <div>
        <div v-if="this.user.username == this.auth">
          <a href="/users/profile/subscribers" class="btn btn-outline-info">Subscribers <strong>{{ subscribeUsers.length }}</strong></a>
          <a href="/users/profile/subscriptions" class="btn btn-outline-secondary">Subscriptions <strong>{{ subscriptionUsers.length }}</strong></a>
        </div>
        <div v-else>
          <button v-if="!isSub" type="button" class="btn btn-info" @click.prevent="subscribe">Subscribers</button>
          <button v-else type="button" class="btn btn-secondary" @click.prevent="unsubscribe">Unsubscribe</button>
        </div>
      </div>
      <div class="modal fade" id="myModal">
        <div class="modal-dialog">
          <div class="modal-content">
      
            <!-- Modal Header -->
            <div class="modal-header">
              <h4 class="modal-title">{{ headModal }}</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
      
            <!-- Modal body -->
            <div class="modal-body">
              <form v-if="inputModalEmail" class="form-group" id="emailForm">
                <input type="text" name="username" class="form-control" placeholder="New email" />
                <input type="password" name="password" class="form-control" placeholder="Your password" />
              </form>
              <form v-if="inputModalProfile" class="form-group" id="profileForm">
                <input type="text" name="firstName" class="form-control" :value="user.firstName" />
                <input type="text" name="lastName" class="form-control" :value="user.lastName" />
                <input type="date" name="birthday" class="form-control" :value="user.birthday" />
              </form>
            </div>
      
            <!-- Modal footer -->
            <div class="modal-footer">
              <button type="button" class="btn btn-info" data-dismiss="modal" @click.prevent="saveEdit">Save</button>
              <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
            </div>
      
          </div>
        </div>
      </div>
    </div>
  `,
  created() {
    this.subscribeUsers = [];
    this.subscriptionUsers = [];
    subscribersApi.get().then(r =>
      r.json().then(data => data.forEach(user => this.subscribeUsers.push(user)))
    );
    subscriptionsApi.get().then(r =>
      r.json().then(data => {
        data.forEach(user => this.subscriptionUsers.push(user));
      })
    );
    getUserApi.get({id: this.id}).then(r => {
      if (r.ok) {
        r.json().then(data => {
          this.user = data;
          this.isSub = containsUser(data, this.subscriptionUsers);
        })
      }
    });
  },
  methods: {
    editEmail() {
      this.headModal = 'Edit Email';
      this.inputModalEmail = true;
      this.inputModalProfile = false;
    },
    editProfile() {
      this.headModal = 'Edit Profile';
      this.inputModalEmail = false;
      this.inputModalProfile = true;
    },
    saveEdit() {
      let form;
      if (this.inputModalEmail) {
        form = document.getElementById('emailForm');
      } else if (this.inputModalProfile) {
        form = document.getElementById('profileForm');
      }
      let data = new FormData(form);
      editProfileApi.update({id: this.id}, data).then(r =>
        r.json().then(data => {
          this.user = data
          if (this.inputModalEmail) {
            window.location.href = '/logout';
          }
        })
      )
    },
    subscribe() {
      let data = new FormData();
      data.set("username", this.user.username);
      subscribersApi.update({}, data).then(r => {
        if (r.ok) {
          this.isSub = true;
        }
      });
    },
    unsubscribe() {
      let data = new FormData();
      data.set("username", this.user.username);
      unsubscribeApi.update({}, data).then(r => {
        if (r.ok) {
          this.isSub = false;
        }
      });
    }
  }
});

Vue.component('musics', {
  props: ['musics'],
  template: `
    <div>
      <div style="margin-bottom: 88px">
        <music-row v-for="music in musics" 
            :music="music"
            :key="music.id"
        ></music-row>
      </div>
      <music-player url="" class="fixed-bottom w-100 bg-dark text-light d-flex" style="height: 80px"></music-player>
    </div>
  `
});

new Vue({
  el: '#profile',
  data: () => ({
    myMusics: [],
    buyMusics: []
  }),
  store,
  created() {
    musicsApi.get().then(r =>
      r.json().then(data => {
        this.myMusics = data;
        this.$store.commit('setMyMusics', data);
      })
    );
    purchasedMusicsApi.get().then(r =>
      r.json().then(data => {
        this.buyMusics = data;
        this.$store.commit('setBuyMusics', data);
      })
    );
    authApi.get().then(r => {
      if (r.ok) {
        r.json().then(data => {
          this.$store.commit('setAuth', data.username);
        });
      }
    });
  }
})