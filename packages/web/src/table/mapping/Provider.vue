<template>
	<div>
		<a-row class="w-100">
			<a-col :span="20">
				<a-input
					disabled
					:placeholder="renderPlaceholder(modelValue) || '点击右侧选择对象id'"
				></a-input>
			</a-col>
			<a-col :span="4">
				<a-button
					:disabled="disabled"
					class="w-100"
					type="primary"
					@click="visible = true"
				>
					选择
				</a-button>
			</a-col>
		</a-row>
		<a-modal
			v-model:visible="visible"
			:width="1000"
			title="选择对象"
			@ok="onSelectConfirm"
		>
			<SchemaTable
				mode="provider"
				:apis="apis"
				:schema-route="schemaRoute"
				:schema-name="property.provider.target"
				@selected="onSelected"
				:type="property.provider.type"
			></SchemaTable>
		</a-modal>
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import SchemaTable from '../../SchemaTable.vue';
import type { WebApis, BaseSchema } from '@lcdp-js/core';
import { RouteRecordAndTableRaw, TableProperty, SchemaMetadata } from '../../interface';

const props = withDefaults(
	defineProps<{
		apis: WebApis<any>;
		schemaRoute: RouteRecordAndTableRaw;
		modelValue?: any;
		disabled?: boolean;
		property: TableProperty;
		metadata: SchemaMetadata;
	}>(),
	{
		modelValue: 0
	}
);

const emits = defineEmits<{
	(e: 'update:modelValue', value: any): void;
}>();

const visible = ref(false);

const data = ref<BaseSchema[]>([]);

function renderPlaceholder(defaultValue: string) {
	const table = props.schemaRoute.meta.table;
	console.log(table);
	if (table) {
		if (props.property.provider.type === 'radio') {
			if (data.value[0]) {
				return table.renderInSearch ? table?.renderInSearch?.(data.value[0]) : JSON.stringify(data.value[0]);
			} else {
				return defaultValue;
			}
		} else {
			return table.renderInSearch ? table.renderInSearch?.(data.value) : data.value.join(',');
		}
	}
}

function onSelected(d: BaseSchema[]) {
	data.value = d;
}

function onSelectConfirm() {
	emits('update:modelValue', props.property.provider.value(props.property.provider.type === 'radio' ? data.value[0] : data.value));
}
</script>
<style scoped lang="less"></style>
