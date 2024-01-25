<template>
	<a-space>
		<a-date-picker
			v-model="data.date"
			:disabled="disabled"
		/>
		<a-time-picker
			v-model="data.time"
			:disabled="disabled"
		/>
	</a-space>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { reactive, watch } from 'vue';

const props = withDefaults(
	defineProps<{
		modelValue?: number;
		disabled?: boolean;
	}>(),
	{
		modelValue: Date.now()
	}
);

const emits = defineEmits<{
	(e: 'update:modelValue', value: number): void;
}>();

const data = reactive({
	date: dayjs(props.modelValue).format('YYYY-MM-DD'),
	time: dayjs(props.modelValue).format('hh:mm:ss')
});

watch(data, () => {
	emits('update:modelValue', new Date(`${data.date} ${data.time}`).getTime());
});
</script>
<style scoped lang="less"></style>
