<template>
	<a-select
		:disabled="props.disabled"
		v-model="value"
		:options="opts.map((i) => ({ value: i[0], label: i[2] }))"
		@change="onChange"
	></a-select>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
	defineProps<{
		modelValue?: boolean | undefined;
		disabled?: boolean;
		/** 不接收默认数据 */
		options?: any[];
	}>(),
	{
		modelValue: undefined,
		options: () => []
	}
);

const emits = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();

const opts = [
	['0', undefined, '请选择'],
	['1', false, '否'],
	['2', true, '是']
] as [string, any, string][];

const value = ref(props.modelValue === undefined ? '0' : opts.find((o) => o[1] === props.modelValue)?.[0] || '0');

function onChange(val: any) {
	const item = opts.find((o) => o[0] === val);
	if (item) {
		emits('update:modelValue', item[1]);
	}
}
</script>
<style scoped lang="less"></style>
