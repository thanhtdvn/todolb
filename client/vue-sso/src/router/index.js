import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Hello from '@/components/Hello'
import Profile from '@/components/Profile'
import AuthCallback from '@/components/AuthCallback'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/authcallback',
      name: 'AuthCallback',
      component: AuthCallback
    }
  ]
})
