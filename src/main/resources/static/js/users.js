const usersApi = Vue.resource('/user');
const usersGetOneApi = Vue.resource('/user/edit{/id}');
const rolesApi = Vue.resource('/user/roles');

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
    isEdit: false,
    users: [],
    user: null,
  },
  mutations: {
    setUsers(state, users) {
      state.users = users
    },
    setEdit(state) {
      state.isEdit = !state.isEdit
    },
    setUser(state, user) {
      state.user = user
    },
    spliceUser(state, user) {
      let index = getIndex(state.users, user.id);
      state.users.splice(index, 1, user);
    }
  }
});

Vue.component('user-list', {
  props: ['users'],
  template: `
    <table class="table table-hover mx-auto" style="width: 700px">
      <thead>
        <tr>
          <th>Username</th>
          <th>Birthday</th>
          <th>First name</th>
          <th>Last name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <user-row v-for="user in users" :key="user.id" :user="user"></user-row>       
      </tbody>
    </table>
  `
});

Vue.component('user-row', {
  props: ['user'],
  template: `
    <tr>
      <td>{{ user.username }}</td>
      <td>{{ user.birthday }}</td>
      <td>{{ user.firstName }}</td>
      <td>{{ user.lastName }}</td>
      <td><span @click.prevent="editUser" class="btn btn-info">Edit</span></td>
    </tr>
  `,
  methods: {
    editUser() {
      this.$store.commit('setUser', this.user);
      this.$store.commit('setEdit');
    }
  },
})

Vue.component('user-edit', {
  props: ['user'],
  data: () => ({
    roles: []
  }),
  template: `
    <form style="width: 550px" class="form-group my-3 mx-auto" id="formEdit">
      <input type="text" :value="user.username" disabled class="form-control" />
      <input type="hidden" name="username" value="user@edit.com" />
      <input type="hidden" value="password" name="password">
      <input type="date" :value="user.birthday" name="birthday" class="form-control" />
      <input type="text" :value="user.firstName" name="firstName" class="form-control" placeholder="First name" />
      <input type="text" :value="user.lastName" name="lastName" class="form-control" placeholder="Last name" />
      <div v-for="role in roles">
        <label class="mx-auto">
          <input type="checkbox" class="mr-2" :name="role" :checked="user.roles.indexOf(role) != -1" />{{ role }}
        </label>
      </div>
      <input type="button" class="btn btn-info" @click.prevent="edit" value="Edit">
    </form>
  `,
  created() {
    rolesApi.get().then(r =>
      r.json().then(data =>
        this.roles = data
      )
    );
  },
  methods: {
    edit() {
      let form = document.getElementById('formEdit');
      let data = new FormData(form);
      usersGetOneApi.update({id: this.user.id}, data).then(r =>
        r.json().then(data => {
            this.$store.commit('spliceUser', data);
          }
        )
      );
      this.$store.commit('setEdit');
    }
  }
});

new Vue({
  el: '#users',
  store,
  data: () => ({
    users: [],
  }),
  template:`
    <user-list v-if="!this.$store.state.isEdit" :users="this.$store.state.users"></user-list>
    <user-edit v-else :user="this.$store.state.user"></user-edit>
  `,
  created() {
    usersApi.get().then(result =>
      result.json().then(data =>
        data.forEach(user => this.users.push(user))
      )
    );
    this.$store.commit('setUsers', this.users);
  }
})