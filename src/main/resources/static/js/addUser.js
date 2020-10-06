let userApi = Vue.resource('/user');

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
  template: `
    <form id="formUser" class="form-group">
      <input type="text" name="username" class="form-control" placeholder="Username" />
      <input type="password" name="password" class="form-control" placeholder="Password" />
      <input type="email" name="email" class="form-control" placeholder="Email" />
      <input type="date" name="birthday" class="form-control" />
      <input type="button" @click.prevent="save" class="btn bg-info" value="add user" />
    </form>
  `,
  methods: {
    save() {
      let form = document.getElementById('formUser');
      let data = new FormData(form);
      userApi.save({}, data).then(result => {
        if(result.ok) {
          return window.location.href = '/users';
        }
      })
    }
  }
});

new Vue({
  data: () => ({
    users: []
  }),
  el: '#add-user',
  store,
  template: `
    <user-form></user-form>
  `,
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