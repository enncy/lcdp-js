import { CustomDecorator } from 'custom-decorator';
import { BaseSchema } from '../schema';

/**
 * 路由
 */
export interface RouteMetadata {
	/** 侧边栏名称 */
	label: string;
	/** 路径 */
	path: string;
	/** 分组 */
	group?: string;
	/** 图标 */
	icon?: string;
	/** 子菜单 */
	children?: { new (): BaseSchema }[];
}

/**
 * 路由装饰器，通过读取Schema中的路由可以自动生成路由菜单，用来对接后台的增删改查数据展示
 */
export function Route(rote: RouteMetadata) {
	return CustomDecorator.classFactory(Route, rote);
}
