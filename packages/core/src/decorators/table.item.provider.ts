import { CustomDecorator } from 'custom-decorator';
import { BaseSchema } from '../schema';

export interface TableItemProviderMetadata<P extends BaseSchema, T extends 'radio' | 'checkbox'> {
	/**
	 * 数据库表名
	 */
	target: string;
	/**
	 * 数据回调接口，返回值将赋值给当前的字段，例如
	 *
	 * value: (user) => user.uid
	 * value: (user) => user.name
	 *
	 * @param schema
	 */
	value: (schema: T extends 'radio' ? P : P[]) => any;
	/**
	 * 单选或者多选
	 */
	type: T;
}

/**
 * 数据提供器
 * 
 * @example
 * 
 * 	@TableItem({ label: '用户ID', type: 'provider' })
	@TableItemProvider({
		target: 'user',
		value: (user) => user.uid,
		type: 'radio'
	})
	user_id: string
 * 
 * @param tableItemProvider 配置
 */
export function TableItemProvider<R extends BaseSchema, T extends 'radio' | 'checkbox'>(tableItemProvider: TableItemProviderMetadata<R, T>): PropertyDecorator {
	return (target, key) => {
		Reflect.set(target, key, undefined);
		CustomDecorator.setPropertyMetadata(TableItemProvider, target, key, tableItemProvider);
	};
}
