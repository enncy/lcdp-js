import { CustomDecorator } from 'custom-decorator';
import { BaseSchema } from '../schema';

export interface TableItemRefMetadata<T extends BaseSchema, R extends BaseSchema> {
	target: { new (): R };
	of: (ref: R) => any;
	id: (schema: T) => string;
}

export function TableItemRef<T extends BaseSchema, R extends BaseSchema = BaseSchema>(tableItemRef: TableItemRefMetadata<T, R>): PropertyDecorator {
	return (target, key) => {
		Reflect.set(target, key, undefined);
		CustomDecorator.setPropertyMetadata(TableItemRef, target, key, tableItemRef);
	};
}
