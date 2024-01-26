<template>
	<a-modal
		@ok="handleOk"
		:ok-text="props.type === 'create' ? '创建' : props.type === 'detail' ? '详情' : '更新'"
		:footer="props.type === 'detail' ? false : true"
		:title="props.type === 'create' ? '创建对象' : props.type === 'detail' ? '对象详情' : '更新对象'"
		:width="props.metadata.properties?.map((property) => property.item.attributes?.width).reduce((pre, curr) => Math.max(pre || 0, curr || 0), 0) || 'auto'"
	>
		<template v-for="property of props.metadata.properties?.sort((a, b) => (b.item.attributes?.level || 0) - (a.item.attributes?.level || 0)) || []">
			<template v-if="(!property.item.hide && !property.item.attributes?.disabled) || props.type === 'detail'">
				<a-row class="d-flex mb-3 text-nowrap">
					<a-col flex="120px">
						<div>{{ property.item.label }} :</div>
					</a-col>
					<a-col flex="auto">
						<div>
							<!-- 如果当前为创建模式，则无值的时候可以显示 -->
							<component
								:placeholder="`请输入${property.item.label}`"
								:disabled="type === 'detail' || property.item.attributes?.disabled"
								:modelValue="form[property.item.key]"
								:is="
									componentModalInputMapping
										.concat(componentPreviewMapping)
										.find((c) => c.type === (typeof property.item.type === 'string' ? property.item.type : property.item.type?.(props.record)))?.component || 'div'
								"
								:metadata="metadata"
								:property="metadata.properties?.find((p) => p.item.label === property.item.label)"
								@update:modelValue="(value:any)=> onUpdateValue(property.item.key,value)"
							></component>
						</div>
					</a-col>
				</a-row>
			</template>
		</template>
	</a-modal>
</template>
<script setup lang="ts">
import { watch, reactive } from 'vue';
import type { RouteMeta } from 'vue-router';
import { componentModalInputMapping, componentPreviewMapping } from './mapping';
import { UpdateForm } from './interface';
import type { BaseSchema } from '@lcdp-js/core';
import { SchemaMetadata } from '../interface';

const props = defineProps<{
	metadata: RouteMeta & SchemaMetadata;
	record?: BaseSchema;
	/**
	 * update: 更新模式
	 * create: 创建模式
	 * detail: 只读（详情）模式
	 */
	type: 'update' | 'create' | 'detail';
	onAction?: (type: 'update' | 'create' | 'detail', updateForm: UpdateForm, previousSchema: BaseSchema | undefined) => void;
}>();

// 原有的数据
const form = reactive<any>(props.type !== 'create' ? JSON.parse(JSON.stringify(props.record || {})) : {});
// 存在更新的数据
const updateForm = reactive<any>(props.type !== 'create' ? { uid: props.record?.uid } : {});

console.log('metadata', props.metadata);

watch(
	() => props.record,
	(re) => {
		Object.assign(form, re);
	}
);

function onUpdateValue(key: string, value: any) {
	// console.log(value);
	form[key] = value;
	updateForm[key] = value;
}

function handleOk() {
	props.onAction?.(props.type, updateForm, props.record);
}
</script>
<style scoped lang="less"></style>
