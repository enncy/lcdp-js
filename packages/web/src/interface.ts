import type { RouteRecordRaw } from 'vue-router';
import type {
	RouteMetadata,
	TableMetadata,
	TableItemMetadata,
	TableItemRefMetadata,
	TableItemProviderMetadata,
	BaseSchema,
	BaseControllerConstructor,
	CommonResponse
} from '@lcdp-js/core';
import type { Document } from 'mongoose';
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

/**
 * 导出通过类型检查的 Controllers
 * 规则是：Controllers 中的每个 Controller 都必须继承 BaseApiController
 * 并且 Controller 中的每个方法的参数必须是 string 或者 object 或者 undefined
 * 前端通过这个类型检查，可以保证传入的参数类型是正确的
 */
export type WebApis<T extends Record<string, BaseControllerConstructor>> = {
	[K in keyof T]: T[K] extends { new (...opts: any): infer ControllerType }
		? {
				// 解构属性类型判断该属性是否为方法
				[CK in keyof Omit<ControllerType, 'req' | 'res' | 'model'>]: ControllerType[CK] extends (...args: infer Args) => infer R
					? Args extends (string | object | number | boolean | undefined)[]
						? (...args: Args) => Promise<
								Awaited<
									/**
									 * 判断接口返回是否带有 Mongoose Document 的文档字段对象，如果有自动转换成普通对象
									 */
									R extends Promise<CommonResponse<infer RES>>
										? RES extends undefined
											? CommonResponse<undefined>
											: RES extends Document<unknown, any, infer DOC> & infer _
											? CommonResponse<DOC>
											: RES extends (Document<unknown, any, infer DOC> & infer _)[]
											? CommonResponse<DOC[]>
											: CommonResponse<RES>
										: R
								>
						  >
						: unknown
					: unknown;
		  }
		: unknown;
};
