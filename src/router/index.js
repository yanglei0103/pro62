import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/User'
import Role from '@/components/role'
import Right from '@/components/Right'
import Good from '@/components/Good'
import Param from '@/components/Param'
import Categories from '@/components/Categories'
import Orders from '@/components/Orders'
import Reports from '@/components/Reports'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/roles', component: Role },
        { path: '/rights', component: Right },
        { path: '/goods', component: Good },
        { path: '/params', component: Param },
        { path: '/categories', component: Categories },
        { path: '/orders', component: Orders },
        { path: '/reports', component: Reports }
      ]
    },
    { path: '/login', component: Login }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  var token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
