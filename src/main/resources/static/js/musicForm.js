const musicApi = Vue.resource('/music');

Vue.component('music-form', {
  data: () => ({
    message: '',
    alertMessage: null
  }),
  template: `
    <div>
      <form class="form-group" enctype="multipart/form-data" id="music">
        <input type="text" name="name" placeholder="Name music" class="form-control" />
        <input type="file" name="file" class="form-control-file" />
        <input type="button" class="btn btn-info" value="Add music" @click.prevent="addMusic" />
      </form>
      <div>
        <span :class="alertMessage">{{ message }}</span>
      </div>
    </div>
  `,
  methods: {
    addMusic() {
      let form = document.getElementById('music');
      let data = new FormData(form);
      musicApi.save({}, data).then(r => {
        if (r.ok) {
          this.alertMessage = {
            "alert": true,
            "alert-success": true
          }
          this.message = 'Download completed successfully';
          form.reset();
        } else {
          this.alertMessage = {
            "alert": true,
            "alert-danger": true
          }
          this.message = 'An error occurred while uploading';
          form.reset();
        }
      })
    }
  }
});

new Vue({
  el: '#music-form',
  template: `
    <music-form></music-form>
  `
});