const userApi = Vue.resource('/user');

const store = new Vuex.Store({
  state: {
    users: []
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    }
  }
});

Vue.component('user-form', {
  props: ['email'],
  template: `
    <div>
      <form id="formUser" class="form-group">
        <input type="email" name="username" class="form-control" placeholder="Email" :value="email" />
        <input type="password" name="password" class="form-control" placeholder="Password" />
        <input type="date" name="birthday" class="form-control" />
        <input type="button" @click.prevent="save" class="btn bg-info" value="add user" />
      </form>
      <div>
        With Google: <a href="/oauth2/authorization/google">click here</a>
      </div>
      <div>
        With Facebook: <a href="/oauth2/authorization/facebook">click here</a>
      </div>
    </div>
  `,
  methods: {
    save() {
      let form = document.getElementById('formUser');
      let data = new FormData(form);
      userApi.save({}, data).then(result => {
        if(result.ok) {
          return window.location.href = '/musics';
        }
      })
    }
  }
});

new Vue({
  data: () => ({
    users: []
  }),
  el: '#add',
  store,
  created() {
    userApi.get().then(result =>
      result.json().then(data =>
        data.forEach(user => this.users.push(user))
      )
    )
    this.$store.commit('setUsers', this.users);
    console.log(this.users);
  }
});