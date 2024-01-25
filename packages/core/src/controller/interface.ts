/* eslint-disable @typescript-eslint/no-unused-vars */
import { SortOrder } from 'mongoose';
import { BaseController } from './index';
import { ApiMetadata, ControllerMetadata } from '../decorators';
import { BaseSchema } from '../schema';

/** 分页对象 */
export interface Pagination {
	current: number;
	size: number;
}

export interface Page<S extends BaseSchema> {
	data: S[];
	current: number;
	size: number;
	total: number;
}

export interface CommonResponse<T> {
	data: T;
	status?: number;
	success: boolean;
	message?: string;
}

/** 控制器构造类型 */
export type BaseControllerConstructor = {
	new (): BaseController;
};

/** 控制器反射获取后的数据 */
export type ControllerData<
	Constructor extends BaseControllerConstructor = BaseControllerConstructor,
	ControllerType = BaseControllerConstructor extends { new (opts: any): infer ControllerInfer }
		? ControllerInfer
		: BaseController
> = {
	/** 控制器实例 */
	controllerInstance: ControllerType;
	/** 控制器构造方法 */
	controllerConstructor: Constructor;
	/** 控制器元数据 */
	controllerMetadata?: ControllerMetadata;

	/** 控制器属性，并且带有元数据 */
	properties: {
		[K in keyof ControllerType]: ControllerPropertiesMetadata<ControllerType[K]>;
	};
};

export interface ControllerPropertiesMetadata<T> {
	/** 接口元数据 */
	api?: ApiMetadata;
	/** 原属性值 */
	target: T;
	/** 如果是方法类型，则为方法形参名 */
	params?: string[];
}
