import Vue from 'vue'
import Router from 'vue-router'
import Mainboard from '@/components/mainboard'
import control from '@/components/control'
import carousel from '@/components/carousel'

Vue.use(Router)

export default new Router({
    routes: [
        {
          path: '/',
          component: Mainboard,
          children:[
              {
                path: '',
                name: 'carousel',
                component: carousel
              },
              {
                path: '/control',
                name: 'control',
                component: control
              },
          ]
        }
    ]
})
