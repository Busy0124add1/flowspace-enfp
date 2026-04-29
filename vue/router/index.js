import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import DiscoverView from '@/views/DiscoverView.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/discover',
    name: 'Discover',
    component: DiscoverView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router