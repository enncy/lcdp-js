import { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { BaseControllerConstructor, ControllerData, ControllerPropertiesMetadata, WebApis } from '@lcdp-js/core';

/**
 * 创建前端控制器接口请求，并带有类型提示
 */
export function createWebApis<T extends Record<string, BaseControllerConstructor> = Record<string, BaseControllerConstructor>>(
	controllerDataList: (ControllerData & {
		key: string;
	})[],
	axios: AxiosInstance,
	opts?: {
		/**
		 * 请求预处理
		 * 如果返回 AxiosRequestConfig，则代表修改请求参数
		 * 如果返回 boolean 则代表此请求是否继续
		 */
		onrequest?: (config: AxiosRequestConfig<any>) => AxiosRequestConfig | boolean | void;
		onresponse?: (config: AxiosRequestConfig<any>, result: any) => void;
		onerror?: (config: AxiosRequestConfig<any>, err: any) => void;
	}
): WebApis<T> {
	const apis: WebApis<T> = Object.create({});

	for (const controller_data of controllerDataList) {
		const api = Object.create({});

		for (const key in controller_data.properties) {
			if (Object.prototype.hasOwnProperty.call(controller_data.properties, key)) {
				const metadata: ControllerPropertiesMetadata<any> = Reflect.get(controller_data.properties, key);
				const apiMetadata = metadata.api;
				const controllerMetadata = controller_data.controllerMetadata;
				if (apiMetadata && controllerMetadata) {
					Reflect.set(api, key, async (...args: any[]) => {
						const names = metadata.params || [];
						/**
						 * 判断是否有文件数据
						 */
						const use_form = args.some((arg) => arg instanceof File);
						/**
						 * 请求数据
						 */
						let data;
						let params;
						// 生成 POST 传递数据
						if (apiMetadata.method === 'post') {
							/**
							 * 如果有文件数据，则使用 FormData 进行传输
							 */
							if (use_form) {
								data = new FormData();
								for (let index = 0; index < names.length; index++) {
									if (args[index]) {
										if (args[index] instanceof File) {
											data.append(names[index], args[index]);
										} else if (typeof args[index] === 'object') {
											data.append(names[index], JSON.stringify(args[index]));
										} else {
											data.append(names[index], args[index]);
										}
									}
								}
							} else {
								/**
								 * JSON 传输
								 */
								data = Object.create({});
								for (let index = 0; index < names.length; index++) {
									if (args[index]) {
										Reflect.set(data, names[index], args[index]);
									}
								}
							}
						}
						// 生成 GET 传递数据
						else {
							params = new URLSearchParams();
							for (let index = 0; index < names.length; index++) {
								if (args[index]) {
									params.append(names[index], args[index]);
								}
							}
						}

						// 发送请求
						let config: AxiosRequestConfig = {
							// 根据 @Controller 的 path 和 @Api 的 url 合并成完整的请求路径
							url: mergePath(typeof controllerMetadata === 'string' ? controllerMetadata : controllerMetadata.path, apiMetadata.url),
							method: apiMetadata.method,
							headers: {
								'content-type': apiMetadata.method === 'post' ? (use_form ? 'multipart/form-data' : 'application/json') : 'x-www-form-urlencoded'
							}
						};

						// 如果有参数才设置，否则不用设置data
						if (apiMetadata.method === 'post') {
							if (data && Object.keys(data).length > 0) {
								config.data = data;
							}
						} else {
							config.params = params;
						}

						// 请求预处理
						const req = opts?.onrequest?.(config);
						if (typeof req === 'boolean') {
							if (req === false) return false;
						} else {
							config = req || config;
						}

						// 开始发送请求
						try {
							const res = await axios(config);
							opts?.onresponse?.(config, res);
							return res.data;
						} catch (err) {
							opts?.onerror?.(config, err);
							throw err;
						}
					});
				}
			}
		}

		Reflect.set(apis, controller_data.key, api);
	}

	return apis;
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
