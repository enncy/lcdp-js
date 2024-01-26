<template>
	<!-- 多级嵌套路由 -->
	<a-menu v-model:selected-keys="selectedKeys">
		<!-- 遍历菜单路由 -->
		<template v-for="route of routes">
			<RouteMenus
				:route="route"
				:go="go"
			/>
		</template>
	</a-menu>
</template>

<script setup lang="ts">
import RouteMenus from './RouteMenus.vue';
import { ref } from 'vue';
import { RouteRecordAndTableRaw } from '../interface';
import { RouteRecordRaw } from 'vue-router';

defineProps<{
	routes: RouteRecordAndTableRaw[];
}>();

function go(route: RouteRecordRaw) {
	if (route.redirect?.toString().startsWith?.('http')) {
		window.open(route.redirect.toString(), '_blank');
	} else {
		window.location.href = route.path;
	}
}

const selectedKeys = ref<string[]>([]);
</script>

<style scope lang="less"></style>
