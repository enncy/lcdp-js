<template>
	<div>
		{{ modelValue.join(', ') }}
	</div>
</template>
<script setup lang="ts">
withDefaults(
	defineProps<{
		modelValue?: any[];
		disabled?: boolean;
	}>(),
	{
		modelValue: () => []
	}
);
</script>
<style scoped lang="less"></style>
