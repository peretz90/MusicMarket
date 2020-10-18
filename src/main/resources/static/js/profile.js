const getUserApi = Vue.resource('/user{/id}');
const editProfileApi = Vue.resource('/user/profile{/id}');
const subscribersApi = Vue.resource('/user/profile/subscribers');
const subscriptionsApi = Vue.resource('/user/profile/subscriptions');
const unsubscribeApi = Vue.resource('/user/profile/unsubscribe');

let getIndex = (list, id) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return i;
    }
  }
  return -1;
}

Vue.component('user-info', {
  props: ['id', 'auth'],
  data: () => ({
    user: null,
    headModal: '',
    inputModalEmail: false,
    inputModalProfile: false,
    subscribeUsers: [],
    subscriptionUsers: []
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
    getUserApi.get({id: this.id}).then(r =>
      r.json().then(data => this.user = data)
    );
    subscribersApi.get().then(r =>
      r.json().then(data => data.forEach(user => this.subscribeUsers.push(user)))
    );
    subscriptionsApi.get().then(r =>
      r.json().then(data => data.forEach(user => this.subscriptionUsers.push(user)))
    );
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
      data.append("username", this.user.username);
      subscribersApi.save({}, data).then(r =>
        r.json().then(data => this.subscriptionUsers.push(data))
      );
    },
    unsubscribe() {
      let data = new FormData();
      data.append("username", this.user.username);
      let index = getIndex(this.subscriptionUsers, this.id);
      unsubscribeApi.save({}, data).then(r => {
        if (r.ok) {
          this.subscriptionUsers.splice(index, 1);
        }
      });
    }
  },
  computed: {
    isSub() {
      for (let user of this.subscriptionUsers) {
        if (user.id === this.user.id) {
          return true;
        }
      }
      return false;
    }
  }
});

new Vue({
  el: '#profile',

})