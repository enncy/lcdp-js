<template>
	<div>
		<Transition
			name="fade"
			mode="out-in"
		>
			<a-card
				v-if="visible"
				:style="bodyStyle"
				:class="bodyClass"
				:bordered="false"
				class="rounded"
			>
				<a-skeleton
					v-if="render === 'skeleton'"
					:animation="true"
				>
					<a-space
						direction="vertical"
						:style="{ width: '100%' }"
						size="large"
					>
						<a-skeleton-line :rows="3" />
					</a-space>
				</a-skeleton>

				<IconLoading v-else-if="render === 'icon'" />
			</a-card>
			<slot v-else></slot>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { IconLoading } from '@arco-design/web-vue/es/icon';
import { CSSProperties } from 'vue';

withDefaults(
	defineProps<{
		render?: 'skeleton' | 'icon';
		visible?: boolean;
		bodyStyle?: CSSProperties;
		bodyClass?: string;
	}>(),
	{
		render: 'skeleton',
		visible: true
	}
);
</script>
<style scoped lang="less">
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
