import { CommonResponse, ListApiCondition, Page, Pagination } from '../controller/interface';
import { BaseSchema } from '../schema';
import { CustomDecorator } from 'custom-decorator';

export interface TableMetadata<S extends BaseSchema, ApiType> extends TableApis<S, ApiType> {
	/** 实体名称 */
	name: string;
	/** 作为搜索数据列表时，选中的渲染方法 */
	renderInSearch?: (schema: S) => string;
}

export interface TableApis<S extends BaseSchema, ApiType> {
	onUpdate?: (apis: ApiType, query: S) => Promise<CommonResponse<any>>;
	onRemove?: (apis: ApiType, query: S) => Promise<CommonResponse<boolean | void>>;
	onCreate?: (apis: ApiType, query: S) => Promise<CommonResponse<S>>;
	onSearch?: (apis: ApiType, query: S, pagination: Pagination) => Promise<CommonResponse<S[]>>;
	onList?: (apis: ApiType, query: S, condition: ListApiCondition, pagination: Pagination) => Promise<CommonResponse<Page<S>>>;
}

export function Table<S extends BaseSchema, ApiType>(table: TableMetadata<S, ApiType>): ClassDecorator {
	return CustomDecorator.classFactory(Table, table);
}
