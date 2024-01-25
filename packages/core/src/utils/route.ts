import { MetadataGetter } from '../decorators';
import { BaseSchema } from '../schema';

/**
 * 通过 schema 信息生成 route 路由信息列表
 * @param schemas  实体类列表
 * @returns
 */
export function createSchemaRoutes(schemas: { new (): BaseSchema }[]): any[] {
	return schemas.map((s) => createSchemaRoute(s)).filter((s) => s !== undefined) as any[];
}

/**
 * 通过 schema 信息生成 route 路由信息
 * @param schema  实体类
 * @returns
 */
function createSchemaRoute(schema: { new (): BaseSchema }): any {
	// 获取信息
	const { route, table, properties } = getSchemaMetadata(schema);

	if (!route || !table || !properties) {
		return undefined;
	}

	return {
		path: route.path,
		redirect: route.path,
		meta: { route, schema: { name: schema.name }, title: route.group },
		/** 生成通用增删改查列表 */
		children: [
			{
				path: route.path,
				component: undefined,
				meta: { route, table, properties, schema: { name: schema.name }, title: route.label }
			},
			...(route.children || []).map((c) => {
				const { route, table, properties } = getSchemaMetadata(c);
				return {
					path: route?.path,
					component: undefined,
					meta: { route, table, properties, title: route?.label, schema: c }
				};
			})
		]
	};
}

function getSchemaMetadata(schema: { new (): BaseSchema }) {
	// 获取路由信息
	const route = MetadataGetter.Route(schema);

	// 获取表单信息
	const table = MetadataGetter.Table(schema);

	// 获取字段信息
	const properties = Object.getOwnPropertyNames(schema.prototype)
		.filter((n) => n !== 'constructor')
		.map((key) => {
			return {
				item: MetadataGetter.TableItem(schema.prototype, key),
				ref: MetadataGetter.TableItemRef(schema.prototype, key),
				provider: MetadataGetter.TableItemProvider(schema.prototype, key)
			};
		});

	return { route, table, properties };
}
