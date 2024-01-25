import { BaseSchema } from '../schema';
import { CustomDecorator } from 'custom-decorator';

type TableItemType<S extends BaseSchema = BaseSchema> = string | { (schema?: S): string };

/**
 * 表单字段数据
 */
export interface TableItemMetadata<S extends BaseSchema = BaseSchema, Type extends TableItemType<S> = TableItemType<S>, V = any> {
	/** 字段名 */
	label: string;
	type?: Type;
	/** 是否中列表中隐藏 */
	hide?: boolean;
	attributes?: {
		[x: string]: any;
		min?: string;
		max?: string;
		step?: string;
		required?: boolean;
		disabled?: boolean;
		/** 显示在最前面的排序值 */
		level?: number;
		/** 大小 */
		width?: number;
	};
	columnProps?: any;
	/** type 为 select 时的子选项 [value , label] */
	options?: [string | number, string][];
	/** 是否可以搜索此字段 */
	searchable?: boolean;
	/**
	 * 排序
	 * 0: 默认排序
	 * 1: 升序排序
	 * -1: 降序排序
	 */
	sort?: 0 | 1 | -1;

	render?: (value: V, record: S) => string;

	/** 字段 */
	key: string;
}

export function TableItem<S extends BaseSchema = BaseSchema, Type extends TableItemType<S> = TableItemType<S>, V = any>(
	tableItem: Omit<TableItemMetadata<S, Type, V>, 'key'>
): PropertyDecorator {
	tableItem.type = tableItem.type || ('text' as Type);
	return (target, key) => {
		Reflect.set(target, key, undefined);
		CustomDecorator.setPropertyMetadata(TableItem, target, key, { key, ...tableItem });
	};
}
