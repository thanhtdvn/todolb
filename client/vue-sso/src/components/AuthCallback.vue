<template>
  <div>

  </div>
</template>

<script>
export default {
  name: 'AuthCallback',
  data () {
    return {
      msg: ''
    }
  },
  mounted: function () {
    console.log('abc')
    localStorage.token = this.$route.query.accessToken
    localStorage.userId = this.$route.query.uId
    console.log(localStorage.token)
    this.$router.replace('/profile')
  }
}
</script>
