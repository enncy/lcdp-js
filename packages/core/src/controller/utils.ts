import { NextFunction, Request, Response } from 'express/index';
import { MetadataGetter } from '../decorators';
import { BaseControllerConstructor, CommonResponse, ControllerPropertiesMetadata, ControllerData } from './interface';
import { ApiController } from './api.controller';
import { BaseController } from './index';
import { CustomDecorator } from 'custom-decorator';

/**
 * 创建后端控制器中间件
 * @param controllerConstructors 控制器的构造器（类）列表
 */
export function createServerControllerMiddleware<T extends Record<string, BaseControllerConstructor> = Record<string, BaseControllerConstructor>>(
	controllerConstructors: T,
	opts?: {
		middleware?: (
			req: Request,
			res: Response,
			controller_property_metadata: ControllerPropertiesMetadata<any> & { instance: BaseController; key: string }
		) => { pass: boolean; statusCode?: number };
		// 当所有路由未匹配时
		onNotFound?: (req: Request, res: Response, next: NextFunction) => void;
		onError?: (err: any, req: Request, res: Response, next: NextFunction) => void;
	}
): (req: Request, res: Response, next: NextFunction) => void {
	const controllerDataList = createControllerDataList(controllerConstructors);

	return async (req, res, next) => {
		const metadatas: (ControllerPropertiesMetadata<any> & { instance: BaseController; key: string })[] = [];

		for (const controller_data of controllerDataList) {
			if (controller_data.properties) {
				for (const key in controller_data.properties) {
					if (Object.prototype.hasOwnProperty.call(controller_data.properties, key)) {
						const metadata: ControllerPropertiesMetadata<any> = Reflect.get(controller_data.properties, key);
						if (metadata.api && typeof metadata.target === 'function') {
							// 如果路径匹配并且请求方法一直，则命中接口
							const allPath = mergePath(
								typeof controller_data.controllerMetadata === 'string' ? controller_data.controllerMetadata : controller_data.controllerMetadata?.path || '',
								metadata.api.url
							);
							if (allPath.trim() === req.path && metadata.api.method.toLowerCase() === req.method.toLowerCase()) {
								// 更改请求上下文：req,res
								controller_data.controllerInstance.req = req;
								controller_data.controllerInstance.res = res;
								metadatas.push({ ...metadata, instance: controller_data.controllerInstance, key });
							}
						}
					}
				}
			}
		}

		if (metadatas.length > 1) {
			// 同一路径只能对应一个 api
			throw new Error(`there is many api handler of path : ${req.path}`);
		} else if (metadatas.length === 1) {
			// 执行中间件回调
			if (metadatas[0] && opts?.middleware) {
				const middleware_res = opts.middleware(req, res, metadatas[0]);
				if (middleware_res.pass === false) {
					if (res.headersSent === false) {
						res.sendStatus(middleware_res.statusCode || 403);
						return;
					}
				}
			}

			// 如果中间件并未拦截，则开始调用接口方法
			if (res.headersSent === false) {
				const args = createFunctionArguments(req, metadatas[0].instance, metadatas[0].key);
				// 执行接口方法
				try {
					// eslint-disable-next-line @typescript-eslint/ban-types
					const result = await (metadatas[0].target as Function).apply(metadatas[0].instance, args);
					// 如果接口已经处理了响应，则不再处理
					if (res.headersSent === false) {
						res.send(result);
					}
				} catch (err) {
					opts?.onError?.(err, req, res, next);
				}
			}
		}
		// 未找到接口
		else {
			opts?.onNotFound?.(req, res, next) || next();
		}
	};
}

/**
 *
 * 新建控制器，并获取控制器所有反射数据
 *
 */
export function createControllerDataList<T extends Record<string, BaseControllerConstructor> = Record<string, BaseControllerConstructor>>(
	controllerConstructors: T
): (ControllerData & { key: string })[] {
	/** 接口列表 */
	const controllerDataList: (ControllerData & { key: string })[] = [];

	for (const key in controllerConstructors) {
		if (Object.prototype.hasOwnProperty.call(controllerConstructors, key)) {
			const constructor = controllerConstructors[key];
			// 获取 controller 元数据
			const controllerMetadata = MetadataGetter.Controller(constructor);

			if (controllerMetadata) {
				// 实例化 controller
				const controller = new constructor();
				if (controller instanceof ApiController && typeof controllerMetadata !== 'string' && controllerMetadata.model) {
					controller.model = controllerMetadata.model;
				}
				const properties: ControllerData['properties'] = Object.create({});

				// 遍历属性
				for (const propertyKey of getAllPropertyNames(controller)) {
					const target = Reflect.get(controller, propertyKey);
					const api = MetadataGetter.Api(controller, propertyKey);
					if (api) {
						const metadata: ControllerPropertiesMetadata<any> = {
							//  获取属性上的 @Api 装饰器数据
							api: api,
							// 属性
							target: Reflect.get(controller, propertyKey),
							// 形参
							params: typeof target === 'function' ? getFunctionParamNames(controller, propertyKey) : []
						};
						Reflect.set(properties, propertyKey, metadata);
					}
				}

				controllerDataList.push({
					key,
					controllerInstance: controller,
					controllerMetadata: controllerMetadata,
					controllerConstructor: constructor,
					properties
				});
			}
		}
	}

	return controllerDataList;
}

/**
 * 通过请求数据创建出所需接口的参数
 * @param req
 * @param func
 * @returns
 */
function createFunctionArguments(req: Request, target: object, functionKey: string) {
	const names = getFunctionParamNames(target, functionKey);
	const args: any[] = [];
	const contentType = req.get('content-type') || 'x-www-form-urlencoded';

	// 获取方法参数类型列表
	const { paramTypes } = CustomDecorator.getDesign(target, functionKey);

	for (let index = 0; index < names.length; index++) {
		// 参数名
		const name = names[index];
		// 参数类型
		const paramType = paramTypes[index];

		let arg = undefined;

		if (contentType.startsWith('multipart/form-data')) {
			if (paramType === String) {
				arg = Reflect.get(req.body, name);
			} else if (paramType === Object) {
				arg = Reflect.get(req.body, name);

				// 判断是否为 json 字符串
				if (typeof arg === 'string') {
					try {
						arg = JSON.parse(arg);
					} catch {}
				}

				// 判断是否在 files 中
				if (arg === undefined) {
					arg = Reflect.get((req as any).files || {}, name) || undefined;
				}
			} else if (paramType === Number) {
				arg = Reflect.get(req.body || {}, name);
				if (typeof arg === 'string') {
					arg = Number(arg);
				}
			} else if (paramType === Boolean) {
				arg = Reflect.get(req.body || {}, name);
				if (typeof arg === 'string') {
					arg = arg === 'true' ? true : false;
				}
			}
		} else if (contentType.startsWith('application/json')) {
			arg = Reflect.get(req.body || {}, name);
		} else if (contentType.startsWith('x-www-form-urlencoded')) {
			arg = Reflect.get(req.query || {}, name);
		}
		args.push(arg);
	}

	return args;
}

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;
/**
 * 获取方法中的参数名。
 * - 不要使用 bind 或者代理等方式改变此方法，否则会丢失参数名，除非每个参数都带上 @Param 进行标注
 * - 如果使用了 @Param 进行标注，则会优先使用 @Param 中的参数名
 */
function getFunctionParamNames(target: object, functionKey: string): string[] {
	const func = Reflect.get(target, functionKey);
	let count = 1;
	const fnStr = String(func)
		// 将解构参数转换成普通参数名
		.replace(/\{.+?\}/g, () => 'arg' + count++)
		// 删除注释
		.replace(STRIP_COMMENTS, '');

	// 形参名
	const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	const rawParams = result || [];

	const params: string[] = [];
	for (let index = 0; index < rawParams.length; index++) {
		// 通过 @Param 自定义的形参名
		const metadata = MetadataGetter.Param(target, functionKey, index);

		// 如果存在自定义形参
		if (metadata) {
			params.push(typeof metadata === 'string' ? metadata : metadata.name);
		} else {
			params.push(rawParams[index]);
		}
	}

	return params;
}

/**
 * 合并路径
 * @param rootPath
 * @param path
 * @returns
 */
function mergePath(...paths: string[]) {
	return (
		'/' +
		paths
			.map((p) => p.split('/'))
			.flat()
			.filter((p) => p !== '')
			.join('/')
	);
}

export function json<T>(data: T): CommonResponse<T>;
export function json<T>(data: T, message?: string): CommonResponse<T>;
export function json<T>(data: T, message?: string, status?: number): CommonResponse<T>;
export function json<T>(data: T, message?: string, status?: number): CommonResponse<T> {
	return {
		data,
		message,
		status: status || 200,
		success: data !== undefined
	};
}

function getAllPropertyNames(object: object) {
	const names = Object.getOwnPropertyNames(object);

	if (object.constructor !== Object) {
		names.push(...getAllPropertyNames(Object.getPrototypeOf(object)));
	}
	return Array.from(new Set(names));
}
