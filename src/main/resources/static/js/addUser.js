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
    password: '',
    passwordConf: '',
    disable: false,
    validEmail: false,
    messageEmail: 'The email field must not be empty',
    validPassword: false,
    messagePassword: 'The password field must not be empty',
    validPasswordConf: false,
    messagePasswordConf: 'Passwords doesn\'t match'
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
          <input type="password" name="password" class="form-control" :class="validPasswordClass" placeholder="Password" v-model="password" required />
          <div class="valid-feedback">{{ messagePassword }}</div>
          <div class="invalid-feedback">{{ messagePassword }}</div>
        </div>
        <div>
          <input type="password" name="confirmPassword" class="form-control" :class="validPasswordConfClass" placeholder="Password confirm" v-model="passwordConf" required />
          <div class="valid-feedback">{{ messagePasswordConf }}</div>
          <div class="invalid-feedback">{{ messagePasswordConf }}</div>
        </div>
        <input type="date" name="birthday" class="form-control" />
        <div style="width: 100%" class="d-flex mt-3">
          <input v-if="validEmail && validPassword && validPasswordConf" type="button" @click.prevent="save" class="btn btn-info ml-auto" value="Registration" />
          <input v-else type="button" class="btn btn-info ml-auto" value="Registration" disabled />
        </div>
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
    },
    setMessagePassword(message) {
      this.messagePassword = message
    },
    setMessagePasswordConf(message) {
      this.messagePasswordConf = message
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
      } else if (!/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(value)) {
        this.setMessageEmail('Email doesn\'t match the format');
        this.validEmail = false;
      } else {
        this.setMessageEmail('This email is unique');
        this.validEmail = true;
      }
    },
    password(value) {
      if (value.length < 6) {
        this.validPassword = false;
        this.setMessagePassword('The password cannot be less than 6 characters long');
      } else {
        this.validPassword = true;
        this.setMessagePassword('The password matches the template');
      }
    },
    passwordConf(value) {
      if (value === this.password) {
        this.validPasswordConf = true;
        this.setMessagePasswordConf('Passwords match');
      } else {
        this.validPasswordConf = false;
        this.setMessagePasswordConf('Passwords doesn\'t match');
      }
    }
  },
  computed: {
    validEmailClass() {
      return {
        'is-valid': this.validEmail,
        'is-invalid': !this.validEmail
      }
    },
    validPasswordClass() {
      return {
        'is-valid': this.validPassword,
        'is-invalid': !this.validPassword
      }
    },
    validPasswordConfClass() {
      return {
        'is-valid': this.validPasswordConf,
        'is-invalid': !this.validPasswordConf
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
  }
});