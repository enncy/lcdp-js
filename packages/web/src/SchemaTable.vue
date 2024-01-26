<template>
	<div
		id="schema-table"
		class="col-12 pb-5"
		v-if="schemaRoute"
	>
		<div class="m-1 m-lg-3">
			<slot name="top"></slot>

			<a-collapse
				:default-active-key="['1']"
				:bordered="false"
				class="mb-3"
			>
				<a-collapse-item
					header="数据搜索"
					key="1"
					:bordered="false"
				>
					<a-card :bordered="false">
						<a-row>
							<a-col :flex="1">
								<a-row :gutter="responsive.gutter">
									<!-- 可搜索的字段列表 -->
									<a-col :xs="24">
										<a-row :gutter="responsive.gutter">
											<template
												v-for="property of schemaRoute.meta.properties
													?.filter((p) => p.item.searchable)
													.sort((a, b) => (b.item.attributes?.level || 0) - (a.item.attributes?.level || 0)) || []"
											>
												<a-col
													:xs="24"
													:md="8"
												>
													<a-form-item
														:label="property.item.label"
														class="mb-0 mb-md-3"
													>
														<component
															allow-clear
															:placeholder="`请输入${property.item.label}`"
															:modelValue="state.search.query[property.item.key]"
															:is="componentSearchMapping.find((c) => c.type === property.item.type)?.component || Input"
															:metadata="schemaRoute.meta"
															:property="schemaRoute.meta.properties?.find((p) => p.item.label === property.item.label)"
															@update:modelValue="(value:any)=> onUpdateSearchValue(property.item.key,value)"
														></component>
													</a-form-item>
												</a-col>
											</template>
										</a-row>
									</a-col>

									<TransitionGroup name="list">
										<template v-if="state.search.showMore">
											<!-- 可排序的字段列表 -->
											<a-col :xs="24">
												<a-row :gutter="responsive.gutter">
													<template
														v-for="property of schemaRoute.meta.properties
															?.filter((p) => p.item.sort !== undefined)
															.sort((a, b) => (b.item.attributes?.level || 0) - (a.item.attributes?.level || 0)) || []"
													>
														<a-col
															:xs="24"
															:md="12"
														>
															<a-form-item
																:label="`${property.item.label}`"
																class="mb-0 mb-md-3"
															>
																<a-select
																	v-model="state.search.condition.sorter[property.item.key]"
																	@change="onSorterChange(property.item.key)"
																>
																	<a-option :value="0">默认排序</a-option>
																	<a-option :value="1">按照从小到大排序</a-option>
																	<a-option :value="-1">按照从大到小排序</a-option>
																</a-select>
															</a-form-item>
														</a-col>
													</template>
												</a-row>
											</a-col>

											<a-col
												:xs="24"
												:md="12"
											>
												<a-form-item
													label="创建于"
													class="mb-0 mb-md-3 flex-wrap flex-lg-nowrap"
												>
													<a-date-picker
														v-model="state.search.condition['create_time_range'][0]"
														placeholder="日期"
													/>
													<a-time-picker placeholder="时间" />
													<a-divider direction="vertical" />
													<a-date-picker
														v-model="state.search.condition['create_time_range'][1]"
														placeholder="日期"
													/>
													<a-time-picker placeholder="时间" />
												</a-form-item>
											</a-col>

											<a-col
												:xs="24"
												:md="12"
											>
												<a-form-item
													label="更新于"
													class="mb-0 mb-md-3 flex-wrap flex-lg-nowrap"
												>
													<a-date-picker
														v-model="state.search.condition['update_time_range'][0]"
														placeholder="时间"
													/>
													<a-time-picker placeholder="时间" />
													<a-divider direction="vertical" />
													<a-date-picker
														v-model="state.search.condition['update_time_range'][1]"
														placeholder="日期"
													/>
													<a-time-picker placeholder="时间" />
												</a-form-item>
											</a-col>
										</template>
									</TransitionGroup>

									<slot name="search"> </slot>
								</a-row>
							</a-col>
						</a-row>

						<a-divider class="mt-0 mb-2" />

						<a-space
							class="d-flex justify-content-end"
							:size="18"
						>
							<a-switch
								v-model="state.search.showMore"
								type="round"
							>
								<template #checked> 显示更多选项 </template>
								<template #unchecked> 显示更多选项 </template>
							</a-switch>

							<a-button
								class="w-100"
								@click="reset"
							>
								<template #icon>
									<icon-refresh />
								</template>
								重置
							</a-button>

							<a-button
								class="w-100"
								type="primary"
								@click="renderData"
							>
								<template #icon>
									<icon-search />
								</template>
								搜索
							</a-button>
						</a-space>
					</a-card>
				</a-collapse-item>
			</a-collapse>

			<a-card :bordered="false">
				<a-row
					class="align-items-baseline"
					v-if="mode === 'list'"
					:gutter="[responsive.gutter, responsive.gutter]"
				>
					<a-col
						:xs="24"
						:md="12"
					>
						<a-space>
							<template v-if="state.selectedKeys.length">
								<a-space>
									<span>
										<a-button
											@click="
												() => {
													selectedData = [];
													state.selectedKeys = [];
												}
											"
											>取消
										</a-button>
									</span>
									<span>
										<a-button @click="showSelectedData">
											{{ state.onlyShowSelectedData ? '显示源数据' : '查看所选' }}
										</a-button>
									</span>
									<span> 共选中{{ state.selectedKeys.length }}个数据 </span>
									<!-- 选择操作 -->
									<FunctionsDropdown
										:metadata="schemaRoute.meta"
										:columns="columns || []"
										:selected-data="selectedData"
									></FunctionsDropdown>
								</a-space>
							</template>

							<template v-else>
								<div class="text-secondary">勾选数据后，可进行批量操作</div>
							</template>
						</a-space>
					</a-col>
					<a-col
						class="mb-3 w-100 d-flex justify-content-end"
						:xs="24"
						:md="12"
					>
						<a-space>
							<slot name="functions"></slot>

							<a-button @click="state.visible.setColumnVisibleModal = true">
								<template #icon>
									<icon-settings />
								</template>
								设置显示列
							</a-button>

							<a-button @click="renderData">
								<template #icon>
									<icon-sync />
								</template>
								刷新数据
							</a-button>

							<a-button
								v-if="hasRole('create')"
								type="primary"
								@click="state.visible.createModal = true"
							>
								<template #icon>
									<icon-plus />
								</template>
								新建
							</a-button>
						</a-space>
					</a-col>
				</a-row>

				<Loading :visible="state.loading">
					<a-table
						class="schema-table"
						column-resizable
						:columns="
							(visibleColumns.filter((c) => !c.hide).length ? visibleColumns.filter((c) => !c.hide) : columns) as TableColumnData[]
						"
						:data="state.onlyShowSelectedData ? selectedData.map((s) => s.list).flat() : source.map((i) => ({ key: i.uid, ...i }))"
						:selected-keys="state.selectedKeys"
						@update:selected-keys="onUpdateSelectedKeys"
						:row-selection="
							mode === 'provider'
								? {
										type: type,
										checkStrictly: true,
										onlyCurrent: true
								  }
								: {
										type: 'checkbox',
										showCheckedAll: true
								  }
						"
						v-model:pagination="state.pagination"
						@page-change="(page: number) => (state.pagination.current = page)"
						@page-size-change="(size: number) => (state.pagination.pageSize = size)"
					>
						<template #actions="{ record }: { record: S }">
							<a-space size="medium">
								<slot
									name="actions"
									:record="record"
									:currentSchemaRoute="schemaRoute"
									:columns="columns"
								></slot>

								<a-button
									v-if="hasRole('details')"
									type="outline"
									@click="onDetail(record)"
								>
									详情
								</a-button>

								<a-button
									v-if="hasRole('modify')"
									type="primary"
									@click="onUpdate(record)"
									>修改</a-button
								>
								<a-popconfirm
									v-if="hasRole('remove')"
									content="是否删除该数据？"
									@ok="onRemove(record)"
								>
									<a-button
										type="primary"
										status="danger"
										>删除</a-button
									>
								</a-popconfirm>

								<slot
									name="actions-suffix"
									:record="record"
									:currentSchemaRoute="schemaRoute"
									:columns="columns"
								></slot>
							</a-space>
						</template>
					</a-table>
				</Loading>
			</a-card>

			<EntityModal
				v-if="state.visible.createModal"
				type="create"
				v-model:visible="state.visible.createModal"
				:metadata="schemaRoute.meta"
				:on-action="onAction"
			></EntityModal>

			<EntityModal
				v-if="currentRecord && state.visible.updateModal"
				type="update"
				v-model:visible="state.visible.updateModal"
				:metadata="schemaRoute.meta"
				:on-action="onAction"
				:record="currentRecord"
			></EntityModal>

			<EntityModal
				v-if="state.visible.detailModal"
				type="detail"
				v-model:visible="state.visible.detailModal"
				:metadata="schemaRoute.meta"
				:on-action="onAction"
				:record="currentRecord"
			></EntityModal>

			<a-modal
				v-model:visible="state.visible.setColumnVisibleModal"
				title="列表显示设置"
				width="auto"
				:footer="false"
			>
				<a-table
					v-if="schemaRoute"
					:pagination="false"
					:data="visibleColumns.filter((c) => c.slotName !== 'actions')"
					:columns="[
						{
							title: '字段名',
							dataIndex: 'title'
						},
						{
							title: 'index',
							dataIndex: 'dataIndex'
						},

						{
							title: '操作',
							slotName: 'actions'
						}
					]"
				>
					<template #actions="{ rowIndex }">
						<a-button
							@click="visibleColumns[rowIndex].hide = !visibleColumns[rowIndex].hide"
							:type="visibleColumns[rowIndex].hide ? 'outline' : undefined"
						>
							{{ visibleColumns[rowIndex].hide ? '显示' : '隐藏' }}
						</a-button>
					</template>
				</a-table>
			</a-modal>

			<slot></slot>
		</div>
	</div>
</template>
<script setup lang="ts" generic="S extends BaseSchema">
import type { WebApis, BaseSchema, ListApiCondition } from '@lcdp-js/core';
import { Input, Message, type TableColumnData } from '@arco-design/web-vue';
import { IconSearch, IconRefresh, IconPlus } from '@arco-design/web-vue/es/icon';
import { reactive, computed, onMounted, ref } from 'vue';
import EntityModal from './table/EntityModal.vue';
import FunctionsDropdown from './table/FunctionsDropdown.vue';
import { componentSearchMapping } from './table/mapping';
import { UpdateForm } from './table/interface';
import Loading from './components/Loading.vue';
import { RouteRecordAndTableRaw } from './interface';

const props = withDefaults(
	defineProps<{
		apis: WebApis<any>;
		schemaRoute: RouteRecordAndTableRaw;
		size?: 'small' | 'default';
		selected?: string[];
		type?: 'radio' | 'checkbox';
		/**
		 * 表格模式
		 * provider: 作为数据提供者，提供数据给其他组件
		 * list: 作为数据列表，对数据进行增删改查
		 */
		mode?: 'provider' | 'list';
		/** 表格名 */
		schemaName?: string;
		schema?: Function;
		/** 数据源 */
		data?: S[];
		defaultActiveCollapseKeys?: string[];
		/** 表格权限 */
		roles?: ('details' | 'modify' | 'remove' | 'create')[];
		onCreate?: (schema: any) => void;
		onUpdate?: (schema: any, previousSchema: any) => void;
		onRemove?: (schema: any) => void;
		onList?: (query: Partial<any>) => void;
	}>(),
	{
		size: 'default',
		selected: () => [],
		type: 'radio',
		mode: 'list',
		schemaName: '',
		schema: undefined,
		data: () => [],
		roles: () => ['details', 'modify', 'remove', 'create']
	}
);

const emits = defineEmits<{
	(e: 'selected', data: S[]): void;
	(e: 'update:data', data: S[]): void;
}>();

/**
 * 数据列
 */
const columns = computed(() =>
	props.schemaRoute.meta.properties
		?.filter((property) => !property.item.hide)
		.map(
			(property) =>
				({
					title: property.item.label,
					dataIndex: property.item.key,
					level: property.item.attributes?.level || 0,
					render: ({ column, record, rowIndex }) => columnRender(property.item.key, record[property.item.key], record),
					...property.item.columnProps
				} as TableColumnData & { level: number })
		)
		.sort((a, b) => b.level - a.level)
		.concat(
			props.mode === 'list'
				? [
						{
							level: -99,
							title: '操作',
							slotName: 'actions',
							fixed: props.size === 'small' ? undefined : 'right'
						}
				  ]
				: []
		)
);

const visibleColumns = ref(columns.value?.map((c) => ({ ...c, hide: false })) || []);

/** 单元格渲染器 */
const columnRender = (key: string, value: any, record: any) => {
	const property = props.schemaRoute.meta.properties?.find((p) => p.item.key === key);
	if (property) {
		return property.item.render ? property.item.render(value, record) : value;
	}
	return value;
};
/** 当前选择的对象 */
const currentRecord = ref<S>();
/** 整体样式的大小 */
const responsive = computed(() => ({
	gutter: props.size === 'small' ? 12 : 64
}));
/** 表格数据 */
const source = ref<S[]>([]);
/** 选中的数据 */
const selectedData = ref<{ page: number; list: S[] }[]>([]);
/** 状态管理 */
const state = reactive({
	visible: {
		createModal: false,
		updateModal: false,
		detailModal: false,
		setColumnVisibleModal: false
	},
	/** 是否正在加载数据 */
	loading: true,
	/** 当前选择的值 */
	selectedKeys: [] as string[],

	/** 分页 */
	pagination: {
		current: 1,
		total: 0,
		pageSize: 10,
		pageSizeOptions: [10, 20, 50, 100, 200, 500, 1000],
		showPageSize: true,
		hideOnSinglePage: false,
		showTotal: props.size !== 'small',
		showJumper: true,
		simple: props.size === 'small',
		// @ts-ignore
		autoAdjust: true
	},
	/** 搜索管理 */
	search: {
		/** 显示跟多的搜索条件 */
		showMore: false,
		/** 查询对象的字段 */
		query: {} as any,
		/** 查询条件 */
		condition: {
			sorter: {
				create_time: -1
			},
			create_time_range: ['', ''],
			update_time_range: ['', '']
		} as Required<ListApiCondition>
	},
	onlyShowSelectedData: false
});

/** 初始化排序器 */
function initSorter() {
	for (const property of props.schemaRoute.meta.properties || []) {
		if (property.item.sort !== undefined) {
			Reflect.set(state.search.condition.sorter, property.item.key, property.item.sort);
		}
	}
}

onMounted(() => {
	initSorter();
	renderData();
});

/** 当排序器更新时，清空其他字段的排序 */
function onSorterChange(changeKey: string) {
	for (const key in state.search.condition.sorter) {
		if (Object.prototype.hasOwnProperty.call(state.search.condition.sorter, key)) {
			if (key !== changeKey) {
				state.search.condition.sorter[key] = 0;
			}
		}
	}
}

function onUpdateSelectedKeys(_keys: (string | number)[]) {
	console.log('onUpdateSelectedKeys', _keys);

	const list = selectedData.value.find((s) => s.page === state.pagination.current);
	if (!list) {
		selectedData.value.push({
			page: state.pagination.current,
			list: source.value.filter((d) => _keys.includes(d.uid))
		});
	} else {
		list.list = source.value.filter((d) => _keys.includes(d.uid));
	}

	state.selectedKeys = _keys.map((k) => k.toString());

	emits('selected', selectedData.value as S[]);
}

async function renderData() {
	state.loading = true;
	try {
		console.log('数据加载', {
			schemaRoute: props.schemaRoute,
			props
		});

		// 列表钩子
		props.onList?.(state.search.query);

		const result = await props.schemaRoute.meta.table?.onList?.(props.apis, state.search.query, state.search.condition, {
			current: state.pagination.current,
			size: state.pagination.pageSize
		});

		if (result) {
			if (result.success) {
				const { data: resData, ...pagination } = result.data || {};

				emits('update:data', resData);
				source.value = resData || [];

				state.pagination.total = pagination.total;
				state.pagination.current = pagination.current;
				state.pagination.pageSize = pagination.size;
			} else {
				Message.error(result.message || '数据加载失败');
			}
		} else {
			Message.error('数据加载失败');
		}
	} catch (err) {
		Message.error((err as any).message || String(err));
		console.error(err);
	}

	state.loading = false;
}

function reset() {
	state.search.query = {};

	state.search.condition = {
		sorter: {
			create_time: -1
		},
		create_time_range: ['', ''],
		update_time_range: ['', '']
	};
	renderData();
}

function onUpdate(record: S) {
	currentRecord.value = record;
	state.visible.updateModal = true;
}

async function onAction(type: 'update' | 'create' | 'detail', updateSchema: UpdateForm, previousSchema: BaseSchema | undefined) {
	console.log({ type, updateSchema });

	if (type === 'create') {
		// 创建钩子
		props.onCreate?.(updateSchema);

		props.schemaRoute.meta.table
			?.onCreate?.(props.apis, updateSchema)
			.then((result) => {
				if (result.success) {
					Message.success('创建成功');
					source.value.push(result.data);
				} else {
					Message.error('创建失败: ' + result.message);
				}
			})
			.catch((err) => {
				Message.error('更新失败:' + err.message);
			});
	} else if (type === 'update') {
		// 更新钩子
		props.onUpdate?.(updateSchema, previousSchema);

		props.schemaRoute.meta.table
			?.onUpdate?.(props.apis, updateSchema)
			.then((result) => {
				Message.success('更新成功');
				const index = source.value.findIndex((d) => d.uid === updateSchema.uid);
				if (index !== -1) {
					updateSchema.update_time = Date.now();
					Object.assign(source.value[index], updateSchema);
				}
				Object.assign(currentRecord.value as any, updateSchema);
			})
			.catch((err) => {
				Message.error('更新失败:' + err.message);
			});
	} else if (type === 'detail') {
	}
}

function onRemove(record: S) {
	// 删除钩子
	props.onRemove?.(record);

	props.schemaRoute.meta.table?.onRemove?.(props.apis, record);
	const index = source.value.findIndex((d) => d.uid === record.uid);
	if (index !== -1) {
		source.value.splice(index, 1);
	}
}

function onDetail(record: S) {
	state.visible.detailModal = true;
	currentRecord.value = record;
}

function onUpdateSearchValue(key: string, value: any) {
	state.search.query[key] = value;
}

function hasRole(role: 'details' | 'modify' | 'remove' | 'create') {
	return props.roles?.includes(role) || false;
}

function showSelectedData() {
	state.onlyShowSelectedData = !state.onlyShowSelectedData;
}
</script>
<style scoped lang="less">
.schema-table {
	white-space: nowrap;
}

.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

#schema-table {
	min-width: 300px;
	height: fit-content;

	& :deep(.arco-collapse-item-content) {
		padding: 0px;
		margin: 0px;
	}
	& :deep(.arco-collapse-item-content > .arco-collapse-item-content-box) {
		padding: 0px;
		margin: 0px;
	}
}
</style>
