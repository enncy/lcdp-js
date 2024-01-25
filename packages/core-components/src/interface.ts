import type { RouteRecordRaw } from 'vue-router';
import { RouteMetadata, TableMetadata, TableItemMetadata, TableItemRefMetadata, TableItemProviderMetadata, BaseSchema } from 'core';

/**
 * Schema 的元数据
 */
export interface SchemaMetadata {
	/** 路由数据 */
	route: Partial<RouteMetadata>;
	/** 表单信息数据 */
	table?: TableMetadata<any, any>;
	/** 表单属性数据 */
	properties?: TableProperty[];
	/** Schema 构造器 */
	schema?: { new (): BaseSchema };
}

export type RouteRecordAndTableRaw = RouteRecordRaw & {
	children?: RouteRecordAndTableRaw[];
	meta: SchemaMetadata & {
		showInHeader?: boolean;
		showInSider?: boolean;
	};
};

/** 表单属性数据 */
export interface TableProperty {
	item: TableItemMetadata<any>;
	ref: TableItemRefMetadata<any, any>;
	provider: TableItemProviderMetadata<any, 'radio' | 'checkbox'>;
}
