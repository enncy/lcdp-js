<template>
	<a-select
		:default-value="modelValue"
		allow-clear
		@change="(val: any)=> emits('update:modelValue',val)"
		:options="options.map((opt) => ({ value: opt[0], label: opt[1] }))"
	></a-select>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { TableProperty } from '../../interface';

const props = defineProps<{
	property: TableProperty;
	modelValue?: string | number | undefined;
}>();

const emits = defineEmits<{
	(e: 'update:modelValue', value: any): void;
}>();

const options = ref(props.property.item.options || []);
</script>
<style scoped lang="less"></style>
