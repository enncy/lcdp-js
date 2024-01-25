/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Document, SortOrder } from 'mongoose';
import type { BaseControllerConstructor, CommonResponse } from './controller/interface';

/** 查询条件 */
export interface ListApiCondition {
	/** 创建时间范围查询 */
	create_time_range?: [string, string];
	/** 更新时间范围查询 */
	update_time_range?: [string, string];
	/** 排序器 */
	sorter?: Record<string, SortOrder | 0>;
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