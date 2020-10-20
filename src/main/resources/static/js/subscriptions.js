const subscriptionsApi = Vue.resource('/user/profile/subscriptions');
const unsubscribeApi = Vue.resource('/user/profile/unsubscribe');

isEmptyListUser = (list) => {
  for (let user of list) {
    if (user !== undefined) {
      return false
    }
  }
  return true;
}

Vue.component("user-row", {
  props: ['user'],
  template: `
    <div class="d-flex">
      <span class="my-auto mx-1"><strong>{{ user.firstName }}</strong></span>
      <span class="my-auto mx-1"><strong>{{ user.lastName }}</strong></span>
      <a class="my-auto mx-3 text-secondary" :href="'/users/profile/' + user.id"><i>{{ user.username }}</i></a>
      <button type="button" class="btn btn-secondary ml-auto mt-1" @click.prevent="unsubscribe">Unsubscribe</button>
    </div>
  `,
  methods: {
    unsubscribe() {
      console.log(this.user.id);
    }
  }
});

new Vue({
  el: '#subscriptions',
  data: () => ({
    subscriptionsUser: []
  }),
  template: `
    <div class="col-6 mx-auto mt-4" v-if="isEmpty">
      <h3>You are not currently subscribed to anyone</h3>
    </div>
    <div v-else>
      <div style="background: #f6f6f6; height: 45px;" class="col-6 mx-auto my-2" v-for="user in this.subscriptionsUser">
        <user-row :user="user"></user-row>
      </div>
    </div>
  `,
  created() {
    console.log(this.subscriptionsUser);
    subscriptionsApi.get().then(r =>
      r.json().then(data => data.forEach(user => this.subscriptionsUser.push(user)))
    )
  },
  computed: {
    isEmpty() {
      return isEmptyListUser(this.subscriptionsUser);
    }
  }
})