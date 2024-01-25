<template>
	<pre class="overflow-auto">
    {{ JSON.stringify(JSON.parse(modelValue), null, 4) }}
  </pre>
</template>
<script setup lang="ts">
withDefaults(
	defineProps<{
		modelValue?: string;
		disabled?: boolean;
	}>(),
	{
		modelValue: '{}'
	}
);
</script>
<style scoped lang="less"></style>
