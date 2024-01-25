import { createServerControllerMiddleware, json, createControllerDataList, CoreUtils } from 'core';
import { controllers as ApiControllers, controllers } from './api/index';
import express from 'express';
import { cors } from './middleware/cors';
import { mongo } from './middleware/mongo';
import { schemas } from 'schema';

(async () => {
	const app = express();

	// 连接数据库
	await mongo('mongodb://127.0.0.1:27017/lcdp-js-test');

	app
		// 处理跨域
		.use(cors())
		// 解析 post 数据
		.use(express.urlencoded({ extended: false }))
		.use(express.json())
		.get('/schema-data', (req, res) => {
			res.send({
				apis: createControllerDataList(controllers),
				route: CoreUtils.createSchemaRoutes(schemas as any)
			});
		})
		// 低代码框架
		.use(
			createServerControllerMiddleware(ApiControllers, {
				onError(err, req, res) {
					res.json(json(undefined, '服务器错误：' + err.message || String(err), 500));
				}
			})
		);

	app
		// 启动服务器
		.listen(3077, async () => {});
})();
