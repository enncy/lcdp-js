import Index from '@/views/Index.vue'
import { createSchemaRoutes } from 'core-components'
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import SchemaTablePage from '../components/SchemaTablePage.vue'
import { schema_data } from '..'

export const schema_routes = createSchemaRoutes(schema_data.route, SchemaTablePage)

export const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'admin',
    redirect: schema_routes[0]?.path || '/',
    component: Index,
    children: [...schema_routes]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
