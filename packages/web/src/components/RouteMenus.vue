<template>
	<!-- 如果存在子路由 -->
	<template v-if="route.children">
		<a-sub-menu :key="route.path">
			<template #title> {{ route.meta?.route?.group }} </template>
			<template #icon>
				<template v-if="route.meta?.route.icon?.startsWith('icon')">
					<component :is="route.meta?.route.icon.toString()" />
				</template>
				<template v-else-if="route.meta?.route.icon">
					{{ route.meta?.route.icon }}
				</template>
			</template>

			<template v-for="children of route.children">
				<!-- 递归 -->
				<RouteMenus
					v-if="children.meta.showInSider !== false"
					:route="children"
					:go="go"
				/>
			</template>
		</a-sub-menu>
	</template>
	<template v-else>
		<a-menu-item
			v-if="route.meta?.showInSider !== false"
			:key="route.meta?.route.label"
			@click="go(route)"
		>
			<template #icon>
				<!-- 存在 icon ，并且是独立的菜单节点的时候才会显示图标 -->
				<template v-if="route.meta?.route.icon?.startsWith('icon')">
					<component
						v-if="route.meta?.route.group === undefined"
						:is="route.meta?.route.icon.toString()"
					/>
				</template>
				<template v-else-if="route.meta?.route.icon">
					{{ route.meta?.route.icon }}
				</template>
			</template>
			<span v-if="route.meta">
				{{ route.meta.route.label || '未命名' }}
			</span>
		</a-menu-item>
	</template>
</template>

<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router';
import { RouteRecordAndTableRaw } from '../interface';
import RouteMenus from './RouteMenus.vue';

defineProps<{
	go: (route: RouteRecordRaw) => void;
	route: RouteRecordAndTableRaw;
}>();
</script>

<style scope lang="less"></style>
