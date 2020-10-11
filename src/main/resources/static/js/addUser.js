const userApi = Vue.resource('/user');

const isExist = function(list, username) {
  for(let i = 0; i < list.length; i++) {
    if (list[i].username === username) {
      return true;
    }
  }
  return false;
}

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
  data: () => ({
    username: '',
    disable: false,
    validEmail: false,
    messageEmail: 'the email field must not be empty'
  }),
  template: `
    <div style="width: 500px">
      <form id="formUser" class="form-group">
        <div>
          <input type="email" name="username" class="form-control" :class="validEmailClass" placeholder="Email" v-model="username" required />
          <div class="valid-feedback">{{ messageEmail }}</div>
          <div class="invalid-feedback">{{ messageEmail }}</div>
        </div>
        <div>
          <input type="password" name="password" class="form-control" :class="" placeholder="Password" required />
          <div class="valid-feedback"></div>
          <div class="invalid-feedback"></div>
        </div>
        <input type="date" name="birthday" class="form-control" />
        <input v-if="validEmail" type="button" @click.prevent="save" class="btn btn-info" value="add user" />
        <input v-if="!validEmail" type="button" class="btn btn-info" value="add user" disabled />
      </form>
    </div>
  `,
  methods: {
    save() {
      let form = document.getElementById('formUser');
      let data = new FormData(form);
      userApi.save({}, data).then(result => {
        if(result.ok) {
          return window.location.href = '/success';
        }
      })
    },
    setMessageEmail(message) {
      this.messageEmail = message
    }
  },
  watch: {
    username(value) {
      this.disable = isExist(this.$store.state.users, value);
      if (value === '') {
        this.setMessageEmail('The email field must not be empty');
        this.validEmail = false;
      } else if (this.disable) {
        this.setMessageEmail('This email is already registered');
        this.validEmail = false;
      } else {
        this.setMessageEmail('This email is unique');
        this.validEmail = true;
      }
    }
  },
  computed: {
    validEmailClass() {
      return {
        'is-valid': this.validEmail,
        'is-invalid': !this.validEmail
      }
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