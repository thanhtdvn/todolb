<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h1>Hello {{ fullName }}</h1>
    <h1>ID: {{ id }}</h1>
    <h1>Email: {{ email }}</h1>

    <h3 :v-show="error!=''">Error: {{ error }}</h3>

    <p><a href="" v-on:click="logout">Logout</a></p>
  </div> 
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
      msg: 'This is profile page!',
      fullName: '',
      email: '',
      id: '',
      error: ''
    }
  },

  mounted: function () {
    this.getProfile()
  },
  methods: {
    getProfile () {
      console.log('-----------------', localStorage.token)
      this.$http.get('/accounts/' + localStorage.userId)
        .then(request => this.showProfile(request))
        .catch((error) => this.getProfileFailed(error))
    },
    showProfile (req) {
      console.log(req)
      this.fullName = req.data.username
      this.email = req.data.email
      this.id = req.data.id
    },
    getProfileFailed (error) {
      console.log(error.response)
      if (error.response.status === 401) {
        if (!localStorage.reloadTimeFixLocalStorage || localStorage.reloadTimeFixLocalStorage === 0) {
          localStorage.reloadTimeFixLocalStorage = 1
          this.$router.go()
        } else {
          localStorage.reloadTimeFixLocalStorage = 0
          this.logout()
        }
      }
      this.error = 'Failed!'
    },
    logout () {
      localStorage.clear()
      this.$router.replace('/')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
