<template>
	<a-dropdown>
		<a-button>
			<a-space> 选择操作 <IconDown /> </a-space>
		</a-button>
		<template #content>
			<template v-for="item of functions">
				<a-doption @click="item.function(columns, JSON.parse(JSON.stringify(selectedData.map((d) => d.list).flat())))">
					{{ item.name }}
				</a-doption>
			</template>
		</template>
	</a-dropdown>
</template>
<script setup lang="ts">
import { TableColumnData, Modal, Select } from '@arco-design/web-vue';
import { IconDown } from '@arco-design/web-vue/es/icon';
import * as xlsx from 'xlsx';
import dayjs from 'dayjs';
import type { RouteMeta } from 'vue-router';
import { h, ref } from 'vue';
import type { BaseSchema } from 'core';
import { SchemaMetadata } from '../interface';

const props = defineProps<{
	metadata: RouteMeta & SchemaMetadata;
	columns: TableColumnData[];
	selectedData: {
		page: number;
		list: BaseSchema[];
	}[];
}>();

const functions = [
	{
		name: '导出选中数据',
		function: (columns, list) => {
			const type = ref<'render' | 'json-and-render' | 'raw' | undefined>(undefined);
			Modal.info({
				title: '导出数据',
				simple: false,
				content: () =>
					h('div', [
						h(Select, {
							placeholder: '选择导出类型',
							options: [
								{ label: 'JSON+渲染后数据', value: 'json-and-render' },
								{ label: '渲染后数据', value: 'render' },
								{ label: '原始数据', value: 'raw' }
							],
							modelValue: type.value,
							onChange: (value) => {
								// @ts-ignore
								type.value = value.toString();
							}
						})
					]),
				onOk: () => {
					// 新建工作簿
					const workBook = xlsx.utils.book_new();

					// 添加表格
					xlsx.utils.book_append_sheet(
						workBook,
						xlsx.utils.json_to_sheet(
							list.map((item: any, index) => {
								const obj = Object.create({});
								for (const col of columns) {
									if (col.title && col.dataIndex && item[col.dataIndex] !== undefined) {
										if (type.value === 'render') {
											obj[col.title.toString()] = col.render?.({ record: item, column: col, rowIndex: index }) || item[col.dataIndex];
										} else if (type.value === 'json-and-render') {
											const renderType = props.metadata.properties?.find((p) => p.item.key === col.dataIndex)?.item.type;
											if (renderType === 'json-editor') {
												obj[col.title.toString()] = JSON.stringify(item[col.dataIndex]);
											} else {
												obj[col.title.toString()] = col.render?.({ record: item, column: col, rowIndex: index }) || item[col.dataIndex];
											}
										} else {
											if (typeof item[col.dataIndex] === 'object') {
												obj[col.title.toString()] = JSON.stringify(item[col.dataIndex]);
											} else {
												obj[col.title.toString()] = String(item[col.dataIndex]);
											}
										}
									}
								}
								return obj;
							})
						),
						'Sheet'
					);
					const filename = dayjs(Date.now()).format(`YYYYMMDD_HHmmss`) + `_${props.metadata.table?.name || '未知'}数据导出.xlsx`;

					// 输出文件
					xlsx.writeFile(workBook, filename, {
						bookType: 'xlsx',
						type: 'array'
					});
					console.log(filename);
					console.log(columns, list.length);
				}
			});
		}
	},
	{
		name: '删除选中数据',
		function: (columns, list) => {
			console.log(columns, list);
			alert('功能开发中');
		}
	}
] as { name: string; function: (columns: TableColumnData[], list: BaseSchema[]) => void }[];
</script>
<style scoped lang="less"></style>
