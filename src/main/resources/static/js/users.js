const usersApi = Vue.resource('/user')

new Vue({
  el: '#users',
  data: () => ({
    users: [],
  }),
  template:`
    <table>
      <tr>
        <th>Username</th>
        <th>Email</th>
        <th>Birthday</th>
      </tr>
      <tr v-for="user in users">
        <th>{{ user.username }}</th>
        <th>{{ user.email }}</th>
        <th>{{ user.birthday }}</th>
      </tr>
    </table>
  `,
  created() {

  }
})