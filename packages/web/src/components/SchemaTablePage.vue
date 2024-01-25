<template>
  <div v-if="currentSchemaRoute" class="bg-white">
    <SchemaTable class="schema" :apis="apis" :schema-route="currentSchemaRoute"></SchemaTable>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { SchemaTable } from 'core-components'
import { computed } from 'vue'
import { schema_routes } from '@/router'
import { apis } from '../apis/index'

const router = useRouter()

/**
 * 当前路由所带的对象参数
 */
const currentSchemaRoute = computed(() =>
  getAllSchemaRoutes().find((sr) => sr.path === router.currentRoute.value.path)
)

console.log(currentSchemaRoute.value)

function getAllSchemaRoutes() {
  return schema_routes.map((sr) => sr.children || []).flat()
}
</script>

<style scoped lang="less">
.schema {
  background-color: #f4f4f4;
}
</style>
