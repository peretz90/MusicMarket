const subscriptionsApi = Vue.resource('/user/profile/subscriptions');
const unsubscribeApi = Vue.resource('/user/profile/unsubscribe');

let isEmptyListUser = (list) => {
  for (let user of list) {
    if (user !== undefined) {
      return false
    }
  }
  return true;
}

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
    subscriptionsUser: [],
    countSub: 0
  },
  mutations: {
    setSubscriptionsUser(state, list) {
      state.subscriptionsUser = list;
    },
    setCountSub(state, counts) {
      state.countSub = counts;
    },
    decrementCount(state) {
      state.countSub--;
    },
    deleteUser(state, id) {
      let index = getIndex(state.subscriptionsUser, id);
      state.subscriptionsUser.splice(index, 1);
    }
  }
});

Vue.component("user-row", {
  props: ['user'],
  template: `
    <div class="d-flex">
      <span class="my-auto mr-1 ml-3"><strong>{{ user.firstName }}</strong></span>
      <span class="my-auto mx-1"><strong>{{ user.lastName }}</strong></span>
      <a class="my-auto mx-3 text-secondary" :href="'/users/profile/' + user.id"><i>{{ user.username }}</i></a>
      <button type="button" class="btn btn-secondary ml-auto mt-1" @click.prevent="unsubscribe">Unsubscribe</button>
    </div>
  `,
  methods: {
    unsubscribe() {
      let data = new FormData();
      data.append("username", this.user.username);
      unsubscribeApi.update({}, data).then(r => {
        if (r.ok) {
          this.$store.commit('decrementCount');
          this.$store.commit('deleteUser', this.user.id);
        }
      });
    }
  }
});

new Vue({
  el: '#subscriptions',
  store,
  template: `
    <div class="col-6 mx-auto mt-4" v-if="isEmpty">
      <h3>You are not currently subscribed to anyone</h3>
    </div>
    <div v-else class="col-6 mx-auto">
      <h4 class="text-center my-5">{{ this.$store.state.countSub }} subscriptions</h4>
      <div style="background: #f6f6f6; height: 45px;" class="my-2" v-for="user in this.$store.state.subscriptionsUser">
        <user-row :user="user"></user-row>
      </div>
    </div>
  `,
  created() {
    subscriptionsApi.get().then(r =>
      r.json().then(data => {
        this.$store.commit('setSubscriptionsUser', data);
        this.$store.commit('setCountSub', data.length);
      })
    )
  },
  computed: {
    isEmpty() {
      return isEmptyListUser(this.$store.state.subscriptionsUser);
    }
  }
})