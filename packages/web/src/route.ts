import { RouteComponent } from 'vue-router';
import { RouteRecordAndTableRaw } from './interface';
import type { ApiController } from 'core';

/**
 * 通过 schema 信息生成 route 路由信息列表
 * @param schemas  实体类列表
 * @returns
 */
export function createSchemaRoutes(schemaDataList: Omit<RouteRecordAndTableRaw, 'component'>[], component: RouteComponent): RouteRecordAndTableRaw[] {
	const set = (data: Omit<RouteRecordAndTableRaw, 'component'>) => {
		data.meta.table = data.meta.table || Object.create({});
		if (data.meta.table) {
			const key = (data.meta.schema?.name.toString() || '').toLowerCase();
			data.meta.table.onCreate = (apis: Record<string, ApiController>, data) => apis[key].insert(data);
			data.meta.table.onUpdate = (apis: Record<string, ApiController>, data) => apis[key].updateById(data);
			data.meta.table.onRemove = (apis: Record<string, ApiController>, { uid }) => apis[key].removeById(uid);
			data.meta.table.onList = (apis: Record<string, ApiController>, query, condition, pagination) => apis[key].list(query, condition, pagination);
		}

		Reflect.set(data, 'component', component);
	};

	for (const data of schemaDataList) {
		set(data);
		for (const child of data.children || []) {
			set(child);
		}
	}

	return schemaDataList as RouteRecordAndTableRaw[];
}
