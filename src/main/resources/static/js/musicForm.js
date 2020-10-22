const musicApi = Vue.resource('/music');

let isMusicDat = (name) => {
  let index = name.lastIndexOf('.');
  let lastStr = name.substring(index + 1);
  return lastStr === 'mp3' || lastStr === 'wav' || lastStr === 'ogg';
}

let splitText = (str) => {
  return str.split('\\').pop().split('/').pop();
}

Vue.component('music-form', {
  data: () => ({
    message: 'All fields are required',
    alertMessage: {
      "alert": true,
      "alert-warning": true
    },
    nameMusic: '',
    isName: false,
    isFile: false,
    file: undefined,
    fileLabel: 'Choose file'
  }),
  template: `
    <div class="col-5 mx-auto mt-4">
      <form class="form-group" enctype="multipart/form-data" id="music">
        <input type="text" name="name" placeholder="Name music" class="form-control my-2" v-model="nameMusic" />
        <div class="input-group">
          <div class="custom-file">
            <input type="file" name="file" class="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" />
            <label class="custom-file-label" style="overflow: hidden" for="inputGroupFile01">{{ fileLabel }}</label>
          </div>
        </div>
        <input v-if="isName && isFile" type="button" class="btn btn-info my-2 form-control" value="Add music" @click.prevent="addMusic" />
        <input v-if="!isName || !isFile" type="button" class="btn btn-info my-2 form-control" value="Add music" disabled />
      </form>
      <div class="w-100 my-2 text-center" :class="alertMessage">
        <span>{{ message }}</span>
      </div>
    </div>
  `,
  watch: {
    nameMusic(value) {
      if (value !== '') {
        this.isName = true;
        if (this.isFile) {
          this.message = 'All fields are filled in!'
          this.alertMessage = {
            "alert": true,
            "alert-info": true
          }
        } else {
          this.message = 'The "file" field is empty'
          this.alertMessage = {
            "alert": true,
            "alert-danger": true
          }
        }
      } else {
        this.isName = false;
        if (this.isFile) {
          this.message = 'The "name" field is empty'
          this.alertMessage = {
            "alert": true,
            "alert-danger": true
          }
        } else {
          this.message = 'All fields are required'
          this.alertMessage = {
            "alert": true,
            "alert-warning": true
          }
        }
      }
    }
  },
  methods: {
    addMusic() {
      let form = document.getElementById('music');
      let data = new FormData(form);
      musicApi.save({}, data).then(r => {
        if (r.ok) {
          form.reset();
          this.message = 'Download completed successfully';
          this.alertMessage = {
            "alert": true,
            "alert-success": true
          }
          setTimeout(() => {
            window.location.href = '/musics/add'
          }, 2 * 1000);
        }
      })
    },
    fileMusic() {
      this.fileLabel = splitText(this.file.value);
      let value = this.file.value;
      if (value !== '') {
        if (isMusicDat(value)) {
          this.isFile = true;
          if (this.isName) {
            this.message = 'All fields are filled in!'
            this.alertMessage = {
              "alert": true,
              "alert-info": true
            }
          } else {
            this.message = 'The "name" field is empty'
            this.alertMessage = {
              "alert": true,
              "alert-danger": true
            }
          }
        } else {
          this.isFile = false;
          this.message = 'Incorrect file format';
          this.alertMessage = {
            "alert": true,
            "alert-danger": true
          }
        }
      } else {
        if (this.isName) {
          this.message = 'The "name" field is empty'
          this.alertMessage = {
            "alert": true,
            "alert-danger": true
          }
        } else {
          this.message = 'All fields are required'
          this.alertMessage = {
            "alert": true,
            "alert-warning": true
          }
        }
      }
    }
  },
  mounted() {
    this.file = this.$el.querySelector('#inputGroupFile01');
    this.file.addEventListener('change', this.fileMusic);
  }
});

new Vue({
  el: '#music-form',
  template: `
    <music-form></music-form>
  `
});