const loginApi = Vue.resource('/login');
const logoutApi = Vue.resource('/logout');

Vue.component('info', {
  props: ['email', 'password'],
  template: `
    <div>
      <div v-if="email != null" class="jumbotron">
        <h3>You have successfully registered!</h3>
        <h5>(you will be taken to the main page in 5 seconds, if this did not happen, click <a href="/">here</a>)</h5>
      </div>
      <div v-else class="jumbotron">
        <h3>Email is not entered or hidden, please try again</h3>
        <h5>(you will be taken to the main page in 5 seconds, if this did not happen, click <a href="/">here</a>)</h5>
      </div>
    </div>
  `,
  created() {
    if (this.email != null) {
      let data = new FormData();
      data.set('username', this.email);
      data.set('password', this.password);
      loginApi.save({}, data).then(r => console.log(r));
    } else {
      logoutApi.save({}, new FormData);
    }
    setTimeout(function(){
      window.location.href = '/';
    }, 5 * 1000);
  },
});

new Vue({
  el: '#oauth'
});