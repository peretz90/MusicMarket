const subscribersApi = Vue.resource('/user/profile/subscribers');
const unsubscribeApi = Vue.resource('/user/profile/unsubscribe');
const subscriptionsApi = Vue.resource('/user/profile/subscriptions');

let containsUser = (user, userList) => {
  for (let u of userList) {
    if (u.id === user.id) {
      return true;
    }
  }
  return false;
}

let getIndex = (list, id) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return i;
    }
  }
  return -1;
}

let store = new Vuex.Store({
  state: {
    subscribersUser: [],
    subscriptionsUser: [],
    countSub: 0,
    auth: undefined
  },
  mutations: {
    setSubscribersUser(state, list) {
      state.subscribersUser = list;
    },
    setCountSub(state, count) {
      state.countSub = count;
    },
    setAuth(state, auth) {
      state.auth = auth;
    },
    setSubscriptionsUser(state, list) {
      state.subscriptionsUser = list;
    },
    addSub(state, user) {
      state.subscriptionsUser.push(user);
    },
    removeSub(state, id) {
      let index = getIndex(state.subscriptionsUser, id);
      state.subscriptionsUser.splice(index, 1);
    }
  }
});

Vue.component('user-row', {
  props: ['user'],
  template: `
    <div class="d-flex">
      <span class="my-auto mr-1 ml-3"><strong>{{ user.firstName }}</strong></span>
      <span class="my-auto mx-1"><strong>{{ user.lastName }}</strong></span>
      <a class="my-auto mx-3 text-secondary" :href="'/users/profile/' + user.id"><i>{{ user.username }}</i></a>
      <div class="ml-auto">
        <button v-if="isSub" type="button" class="btn btn-secondary mt-1" @click.prevent="unsubscribe">Unsubscribe</button>
        <button v-else type="button" class="btn btn-info mt-1" @click.prevent="subscribe">Subscribe</button>
      </div>
    </div>
  `,
  methods: {
    unsubscribe() {
      let data = new FormData();
      data.append("username", this.user.username);
      unsubscribeApi.update({}, data).then(r => {
        if (r.ok) {
          this.$store.commit('removeSub', this.user.id);
        }
      });
    },
    subscribe() {
      let data = new FormData();
      data.set("username", this.user.username);
      subscribersApi.update({}, data).then(r => {
        if (r.ok) {
          this.$store.commit('addSub', this.user);
        }
      });
    }
  },
  computed: {
    isSub() {
      return containsUser(this.user, this.$store.state.subscriptionsUser);
    }
  }
});

Vue.component('title-row', {
  props: ['auth'],
  template: `
    <div class="mx-auto mt-4" v-if="isEmpty" style="width: 650px">
      <h3>You don't subscribe to anyone</h3>
    </div>
    <div v-else class="mx-auto" style="width: 650px">
      <h4 class="text-center my-5">{{ this.$store.state.countSub }} subscribers</h4>
      <div style="background: #f6f6f6; height: 45px;" class="my-2" v-for="user in this.$store.state.subscribersUser">
        <user-row :user="user"></user-row>
      </div>
    </div>
  `,
  computed: {
    isEmpty() {
      return this.$store.state.countSub === 0;
    }
  },
  created() {
    this.$store.commit('setAuth', this.auth);
  }
});

new Vue({
  el: '#subscribers',
  store,
  created() {
    subscribersApi.get().then(r =>
      r.json().then(data => {
        this.$store.commit('setSubscribersUser', data);
        this.$store.commit('setCountSub', data.length);
      })
    );
    subscriptionsApi.get().then(r =>
      r.json().then(data => {
        this.$store.commit('setSubscriptionsUser', data);
      })
    );
  }
})